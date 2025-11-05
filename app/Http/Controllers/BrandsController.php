<?php

namespace App\Http\Controllers;

use App\Http\Resources\BrandResource;
use App\Models\Brand;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class BrandsController extends Controller
{
    protected $brand;

    public function __construct(Brand $brand)
    {
        $this->brand = $brand;
    }

    public function index(Request $request)
    {
        $this->authorize('brands_view');

        $search = $request->search ?? '';
        $trashed = $request->trashed ?? false;
        $brandsQuery = $this->brand->query();

        if (!request()->user()->hasPermission('brands_view', true)) {
            $brandsQuery->where('user_id', Auth::id());
        }

        if (request()->user()->tenant_id != null) {
            $brandsQuery->where('tenant_id', request()->user()->tenant_id);
        }

        if ($search != '') {
            $brandsQuery->where('name', 'like', "%$search%");
        }

        if ($trashed) {
            $brandsQuery->withTrashed();
        }

        $brands = $brandsQuery->orderBy('name')
            ->paginate(12, ['id', 'user_id', 'name', 'status', 'created_at', 'updated_at', 'deleted_at'])
            ->withQueryString();

        return Inertia::render('Brands/Index', [
            'brands' => BrandResource::collection($brands),
            'search' => $search,
            'trashed' => $trashed,
        ]);
    }

    public function store(Request $request)
    {
        $this->authorize('create', Brand::class);
        
        $data = $request->validate([
            'name' => 'required|string|max:255|unique:brands,name,NULL,id,tenant_id,' . Auth::user()->tenant_id,
            'status' => 'required|in:0,1',
        ], [
            'name.unique' => 'Já existe uma marca com esse nome.',
        ]);

        try {
            $data['user_id'] = Auth::user()->id;
            $data['tenant_id'] = Auth::user()->tenant_id;

            $brand = $this->brand->create($data);

            if (!$brand) {
                return redirect()->back()
                    ->with('fail', 'Erro ao criar marca.');
            }

            return redirect()->route('brands.index')
                ->with('success', 'Marca criada com sucesso!');
        } catch (\Exception $e) {
            return redirect()->back()
            ->with('fail', 'Erro ao criar marca: ' . $e->getMessage());
        }
    }

    public function update(Request $request, $id)
    {
        $brand = $this->brand->findOrFail($id);

        $this->authorize('update', $brand);

        try {
            $data = $request->validate([
                'name' => 'required|string|max:255',
                'status' => 'required|in:0,1',
            ]);

            if (!$brand->update($data)) {
                return redirect()->back()
                    ->with('fail', 'Erro ao atualizar marca.');
            }

            return redirect()->route('brands.index')
                ->with('success', 'Marca atualizada com sucesso!');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('fail', 'Erro ao atualizar marca: ' . $e->getMessage());
        }
    }

    public function destroy($id)
    {
        $brand = $this->brand->findOrFail($id);

        $this->authorize('delete', $brand);

        try {
            if (!$brand->delete()) {
                return redirect()->back()
                    ->with('fail', 'Erro ao remover marca.');
            }

            return redirect()->back()
                ->with('success', 'Marca removida com sucesso!');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('fail', 'Erro ao remover marca: ' . $e->getMessage());
        }
    }

    public function restore(Brand $brand)
    {
        $this->authorize('delete', $brand);

        try {
            if (!$brand->restore()) {
                return redirect()->back()
                    ->with('fail', 'Erro ao restaurar marca.');
            }

            return redirect()->back()
                ->with('success', 'Marca restaurada com sucesso!');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('fail', 'Erro ao restaurar marca: ' . $e->getMessage());
        }
    }
}

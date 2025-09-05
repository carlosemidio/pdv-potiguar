<?php

namespace App\Http\Controllers;

use App\Http\Resources\BrandResource;
use App\Models\Brand;
use App\Models\User;
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
        $brandsQuery = $this->brand->query();
        $user = User::find(Auth::user()->id);

        if ($search != '') {
            $brandsQuery->where('name', 'like', "%$search%");
        }

        if (!$user->hasPermission('brands_view', true)) {
            // Lojista can only see their own brands
            $brandsQuery->where('user_id', $user->id)
                ->orWhereNull('user_id');
        }

        $brands = $brandsQuery->orderBy('name')
            ->paginate(12, ['id', 'user_id', 'name', 'status', 'created_at'])
            ->withQueryString();

        return Inertia::render('Brands/Index', [
            'brands' => BrandResource::collection($brands),
            'search' => $search,
        ]);
    }

    public function create()
    {
        $this->authorize('create', Brand::class);

        return Inertia::render('Brands/Form');
    }

    public function store(Request $request)
    {
        $this->authorize('create', Brand::class);

        try {
            $data = $request->validate([
                'name' => 'required|string|max:255',
                'status' => 'required|in:0,1',
            ]);

            $data['user_id'] = Auth::user()->id;

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

    public function edit($id)
    {
        $brand = $this->brand->findOrFail($id);

        $this->authorize('update', $brand);

        return Inertia::render('Brands/Form', [
            'brand' => new BrandResource($brand),
        ]);
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

            return redirect()->route('brands.index')
                ->with('success', 'Marca removida com sucesso!');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('fail', 'Erro ao remover marca: ' . $e->getMessage());
        }
    }
}

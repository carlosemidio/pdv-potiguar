<?php

namespace App\Http\Controllers;

use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CategoriesController extends Controller
{
    protected $category;

    public function __construct(Category $category)
    {
        $this->category = $category;
    }

    public function index(Request $request)
    {
        $this->authorize('categories_view');

        $search = $request->search ?? '';
        $categoriesQuery = $this->category->query();
        
        if (!request()->user()->hasPermission('categories_view', true)) {
            $categoriesQuery->where('user_id', Auth::id());
        }

        if (request()->user()->tenant_id != null) {
            $categoriesQuery->where('tenant_id', request()->user()->tenant_id);
        }

        if ($search != '') {
            $categoriesQuery->where('name', 'like', "%$search%");
        }

        $categories = $categoriesQuery->orderBy('name')
            ->with('parent')
            ->paginate(12, ['id', 'user_id', 'name', 'parent_id', 'status', 'created_at'])
            ->withQueryString();

        return Inertia::render('Categories/Index', [
            'categories' => CategoryResource::collection($categories),
            'search' => $search,
        ]);
    }

    public function store(Request $request)
    {
        $this->authorize('create', Category::class);
        $data = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name,NULL,id,tenant_id,' . Auth::user()->tenant_id,
            'parent_id' => 'nullable|exists:categories,id',
            'status' => 'required|in:0,1',
        ], [
            'name.unique' => 'Já existe uma categoria com esse nome.',
        ]);

        try {
            $data['user_id'] = Auth::user()->id;
            $data['tenant_id'] = Auth::user()->tenant_id;

            $category = $this->category->create($data);

            if (!$category) {
                return redirect()->back()
                    ->with('fail', 'Erro ao criar categoria.');
            }

            return redirect()->route('categories.index')
                ->with('success', 'Categoria criada com sucesso!');
        } catch (\Exception $e) {
            return redirect()->back()
            ->with('fail', 'Erro ao criar categoria: ' . $e->getMessage());
        }
    }

    public function update(Request $request, $id)
    {
        $category = $this->category->findOrFail($id);

        $this->authorize('update', $category);

        try {
            $data = $request->validate([
                'name' => 'required|string|max:255',
                'parent_id' => 'nullable|exists:categories,id',
                'status' => 'required|in:0,1',
            ]);

            if (!$category->update($data)) {
                return redirect()->back()
                    ->with('fail', 'Erro ao atualizar categoria.');
            }

            return redirect()->route('categories.index')
                ->with('success', 'Categoria atualizada com sucesso!');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('fail', 'Erro ao atualizar categoria: ' . $e->getMessage());
        }
    }

    public function destroy($id)
    {
        $category = $this->category->findOrFail($id);

        $this->authorize('delete', $category);

        try {
            if (!$category->delete()) {
                return redirect()->back()
                    ->with('fail', 'Erro ao remover categoria.');
            }

            return redirect()->route('categories.index')
                ->with('success', 'Categoria removida com sucesso!');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('fail', 'Erro ao remover categoria: ' . $e->getMessage());
        }
    }
}

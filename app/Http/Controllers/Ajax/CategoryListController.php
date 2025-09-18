<?php

namespace App\Http\Controllers\Ajax;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CategoryListController extends Controller
{
    protected $category;

    public function __construct( Category $category ) {
        $this->category = $category;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
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

        $categories = $categoriesQuery->orderBy('name')->take(100)
            ->get(['id', 'name']);

        return response()->json($categories);
    }
}

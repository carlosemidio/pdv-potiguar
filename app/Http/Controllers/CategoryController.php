<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
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

        if ($search != '') {
            $categoriesQuery->where('name', 'like', "%$search%");
        }

        $categories = $categoriesQuery->orderBy('name')->take(100)
            ->get(['id', 'name']);

        return response()->json($categories);
    }
}

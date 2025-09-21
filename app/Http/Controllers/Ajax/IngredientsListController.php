<?php

namespace App\Http\Controllers\Ajax;

use App\Http\Controllers\Controller;
use App\Models\Ingredient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class IngredientsListController extends Controller
{
    protected $ingredient;

    public function __construct(Ingredient $ingredient)
    {
        $this->ingredient = $ingredient;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->search ?? '';

        $ingredientsQuery = $this->ingredient->query();

        if (!request()->user()->hasPermission('ingredients_view', true)) {
            $ingredientsQuery->where('user_id', Auth::id());
        }

        if (request()->user()->tenant_id != null) {
            $ingredientsQuery->where('tenant_id', request()->user()->tenant_id);
        }

        if ($search != '') {
            $ingredientsQuery->where('name', 'like', "%$search%");
        }

        $ingredients = $ingredientsQuery->orderBy('name')->take(100)
            ->get(['id', 'name', 'unit_id', 'stock_quantity']);

        return response()->json($ingredients);
    }
}

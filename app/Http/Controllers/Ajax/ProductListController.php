<?php

namespace App\Http\Controllers\Ajax;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProductListController extends Controller
{
    protected $product;

    public function __construct(Product $product) {
        $this->product = $product;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->search ?? '';
        $productsQuery = $this->product->query();

        if (!request()->user()->hasPermission('products_view', true)) {
            $productsQuery->where('user_id', Auth::id());
        }

        if (request()->user()->tenant_id != null) {
            $productsQuery->where('tenant_id', request()->user()->tenant_id);
        }

        if ($search != '') {
            $productsQuery->where('name', 'like', "%$search%");
        }

        $products = $productsQuery->orderBy('name')->take(20)->get();

        return response()->json($products);
    }
}

<?php

namespace App\Http\Controllers\Ajax;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;

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
        $user = User::with('store')->find($request->user()->id);

        $productsQuery = $this->product->query()
            ->with(['variants.attributes', 'productAddons.addon'])
            ->where('store_id', $user->store->id);

        if ($search != '') {
            $productsQuery->where('name', 'like', "%$search%");
        }

        $products = $productsQuery->orderBy('name')->take(20)->get();

        return response()->json($products);
    }
}

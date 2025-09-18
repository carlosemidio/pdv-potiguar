<?php

namespace App\Http\Controllers\Ajax;

use App\Http\Controllers\Controller;
use App\Models\ProductVariant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProductVariantListController extends Controller
{
    protected $productVariant;

    public function __construct(ProductVariant $productVariant) {
        $this->productVariant = $productVariant;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->search ?? '';
        $variantsQuery = $this->productVariant->query();

        if (!request()->user()->hasPermission('product-variants_view', true)) {
            $variantsQuery->where('user_id', Auth::id());
        }

        if (request()->user()->tenant_id != null) {
            $variantsQuery->where('tenant_id', request()->user()->tenant_id);
        }

        if ($search != '') {
            $variantsQuery->whereHas('product', function ($query) use ($search) {
                $query->where('name', 'like', '%' . $search . '%');
            })->orWhere('sku', 'like', '%' . $search . '%');
        }

        $variants = $variantsQuery->orderBy('sku')->take(20)->get();

        return response()->json($variants);
    }
}

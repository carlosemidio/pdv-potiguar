<?php

namespace App\Http\Controllers\Ajax;

use App\Http\Controllers\Controller;
use App\Models\StoreProductVariant;
use Illuminate\Http\Request;

class StoreProductVariantListController extends Controller
{
    protected $storeProductVariant;

    public function __construct(StoreProductVariant $storeProductVariant) {
        $this->storeProductVariant = $storeProductVariant;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->search ?? '';
        $storeProductVariantsQuery = $this->storeProductVariant->query()
            ->with(['productVariant.product']);

        if ($search != '') {
            $storeProductVariantsQuery->whereHas('productVariant', function ($query) use ($search) {
                $query->whereHas('product', function ($query) use ($search) {
                    $query->where('name', 'like', '%' . $search . '%');
                })->orWhere('sku', 'like', '%' . $search . '%');
            });
        }

        $storeProductVariants = $storeProductVariantsQuery->take(20)->get();

        return response()->json($storeProductVariants);
    }
}

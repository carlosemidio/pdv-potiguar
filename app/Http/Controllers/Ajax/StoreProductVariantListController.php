<?php

namespace App\Http\Controllers\Ajax;

use App\Http\Controllers\Controller;
use App\Models\StoreProductVariant;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

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
            ->with(['productVariant', 'variantAddonGroups.addonGroupOptions.addon', 'variantAddons.addon']);

        $user = User::find(Auth::id());
        
        if (!$user->hasPermission('store-product-variants_view', true)) {
            $storeProductVariantsQuery->where('user_id', Auth::id());
        }

        if ($user->tenant_id != null) {
            $storeProductVariantsQuery->where('tenant_id', $user->tenant_id);
        }

        if ($user->store_id != null) {
            $storeProductVariantsQuery->where('store_id', $user->store_id);
        }

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

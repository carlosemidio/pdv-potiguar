<?php

namespace App\Http\Controllers\Ajax;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BrandListController extends Controller
{
    protected $brand;

    public function __construct( Brand $brand ) {
        $this->brand = $brand;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->search ?? '';

        $brandsQuery = $this->brand->query();

        if (!request()->user()->hasPermission('brands_view', true)) {
            $brandsQuery->where('user_id', Auth::id());
        }

        if (request()->user()->tenant_id != null) {
            $brandsQuery->where('tenant_id', request()->user()->tenant_id);
        }

        if ($search != '') {
            $brandsQuery->where('name', 'like', "%$search%");
        }

        $brands = $brandsQuery->orderBy('name')->take(100)
            ->get(['id', 'name']);

        return response()->json($brands);
    }
}

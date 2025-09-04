<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use Illuminate\Http\Request;

class BrandController extends Controller
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

        if ($search != '') {
            $brandsQuery->where('name', 'like', "%$search%");
        }

        $brands = $brandsQuery->orderBy('name')->take(100)
            ->get(['id', 'name']);

        return response()->json($brands);
    }
}

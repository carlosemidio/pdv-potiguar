<?php

namespace App\Http\Controllers;

use App\Models\VariantAttribute;
use Illuminate\Http\Request;

class AttibuteController extends Controller
{
    protected $attribute;

    public function __construct( VariantAttribute $attribute ) {
        $this->attribute = $attribute;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->search ?? '';

        $attributesQuery = $this->attribute->query();

        if ($search != '') {
            $attributesQuery->where('name', 'like', "%$search%");
        }

        $attributes = $attributesQuery->orderBy('name')->take(100)
            ->get(['id', 'name']);

        return response()->json($attributes);
    }
}

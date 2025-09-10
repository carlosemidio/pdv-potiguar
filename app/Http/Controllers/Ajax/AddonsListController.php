<?php

namespace App\Http\Controllers\Ajax;

use App\Http\Controllers\Controller;
use App\Models\Addon;
use Illuminate\Http\Request;

class AddonsListController extends Controller
{
    protected $addon;

    public function __construct(Addon $addon)
    {
        $this->addon = $addon;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->search ?? '';

        $addonsQuery = $this->addon->query();

        if ($search != '') {
            $addonsQuery->where('name', 'like', "%$search%");
        }

        $addons = $addonsQuery->orderBy('name')->take(100)
            ->get(['id', 'name', 'price']);

        return response()->json($addons);
    }
}

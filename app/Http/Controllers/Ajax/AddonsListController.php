<?php

namespace App\Http\Controllers\Ajax;

use App\Http\Controllers\Controller;
use App\Models\Addon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

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

        if (!request()->user()->hasPermission('addons_view', true)) {
            $addonsQuery->where('user_id', Auth::id());
        }

        if (request()->user()->tenant_id != null) {
            $addonsQuery->where('tenant_id', request()->user()->tenant_id);
        }

        if ($search != '') {
            $addonsQuery->where('name', 'like', "%$search%");
        }

        $addons = $addonsQuery->orderBy('name')->take(100)
            ->get(['id', 'name']);

        return response()->json($addons);
    }
}

<?php

namespace App\Http\Controllers\Ajax;

use App\Http\Controllers\Controller;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Http\Request;

class TenantListController extends Controller
{
    protected $tenant;

    public function __construct(Tenant $tenant)
    {
        $this->tenant = $tenant;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->search ?? '';
        $tenantsQuery = $this->tenant->query();
        $user = User::find($request->user()->id);

        if (!$user->hasPermission('tenants_view', true)) {
            $tenantsQuery->where('user_id', $user->id);
        }

        if ($search != '') {
            $tenantsQuery->where('name', 'like', "%$search%");
        }

        $tenants = $tenantsQuery->orderBy('name')->take(100)
            ->get(['id', 'name']);

        return response()->json($tenants);
    }
}

<?php

namespace App\Http\Controllers\Ajax;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CustomersListController extends Controller
{
    protected $customer;

    public function __construct(Customer $customer)
    {
        $this->customer = $customer;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->search ?? '';
        $customersQuery = $this->customer->query();
        
        if (!request()->user()->hasPermission('customers_view', true)) {
            $customersQuery->where('user_id', Auth::id());
        }

        if (request()->user()->tenant_id != null) {
            $customersQuery->where('tenant_id', request()->user()->tenant_id);
        }


        if ($search != '') {
            $customersQuery->where('name', 'like', "%$search%");
        }

        $customers = $customersQuery->orderBy('name')->take(100)
            ->get(['id', 'name', 'email', 'phone']);

        return response()->json($customers);
    }
}

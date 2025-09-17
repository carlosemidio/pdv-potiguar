<?php

namespace App\Http\Controllers\Ajax;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use Illuminate\Http\Request;

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

        if ($search != '') {
            $customersQuery->where('name', 'like', "%$search%");
        }

        $customers = $customersQuery->orderBy('name')->take(100)
            ->get(['id', 'name', 'email', 'phone']);

        return response()->json($customers);
    }
}

<?php

namespace App\Http\Controllers\Reports;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\User;
use Illuminate\Http\Request;

class ReportOrdersController extends Controller
{
    function index(Request $request) {
        // Check if the user is authenticated
        if (!$request->user()) {
            return redirect()->route('login');
        }

        $this->authorize('stock-movements_view');

        $user = User::with('store')->find($request->user()->id);

        $finishedOrders = Order::where('store_id', $user->store_id)
            ->where('status', 'finished')
            ->count();

        $inProgressOrders = Order::where('store_id', $user->store_id)
            ->where('status', 'in_progress')
            ->count();

        dd($finishedOrders, $inProgressOrders);

        return inertia('Dashboard', [
            'user' => $request->user(),
            'inProgressOrders' => $inProgressOrders,
            'finishedOrders' => $finishedOrders,
        ]);
    }
}

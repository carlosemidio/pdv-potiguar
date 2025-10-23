<?php

namespace App\Http\Controllers;

use App\Models\CashRegister;
use App\Models\Order;
use App\Models\User;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    function index(Request $request) {
        // Check if the user is authenticated
        if (!$request->user()) {
            return redirect()->route('login');
        }

        $user = User::with('store')->find($request->user()->id);

        $inProgressOrders = 0;
        $pendingOrders = null;

        if ($user->hasPermission('orders_view', true)) {
            $pendingOrders = Order::where('store_id', $user->store_id)
                ->where('status', 'pending')
                ->count();

            $inProgressOrders = Order::where('store_id', $user->store_id)
                ->where('status', 'in_progress')
                ->count();
        } else {
            $inProgressOrders = Order::where('store_id', $user->store_id)
                ->where('status', 'in_progress')
                ->where('user_id', $user->id)
                ->count();
        }

        $openedCashRegister = null;

        if ($user->hasPermission('cash-registers_view', true)) {
            $openedCashRegister = CashRegister::where('store_id', $user->store_id)
                ->where('status', 1) // assuming '1' means opened
                ->first();
        }

        return inertia('Dashboard', [
            'user' => $request->user(),
            'inProgressOrders' => $inProgressOrders,
            'pendingOrders' => $pendingOrders,
            'openedCashRegister' => $openedCashRegister,
        ]);
    }
}

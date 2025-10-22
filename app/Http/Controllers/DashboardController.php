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
        $inProgressOrders = Order::where('store_id', $user->store_id)
            ->where('status', 'in_progress')
            ->count();
        $pendingOrders = Order::where('store_id', $user->store_id)
            ->where('status', 'pending')
            ->count();

        $openedCashRegister = CashRegister::where('store_id', $user->store_id)
            ->where('status', 1) // assuming '1' means opened
            ->first();

        return inertia('Dashboard', [
            'user' => $request->user(),
            'inProgressOrders' => $inProgressOrders,
            'pendingOrders' => $pendingOrders,
            'openedCashRegister' => $openedCashRegister,
        ]);
    }
}

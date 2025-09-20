<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Payment;
use App\Models\Product;
use App\Models\User;
use App\Models\View;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    function index(Request $request) {
        // Check if the user is authenticated
        if (!$request->user()) {
            return redirect()->route('login');
        }

        $incomesToday = 0;
        $pendingIncomes = 0;
        $inProgressOrders = 0;
        $viewsByPeriod = collect();
        $finishedOrdersToday = 0;
        $totalProducts = 0;

        $user = User::with('store')->find($request->user()->id);

        if ($user && ($user->store_id  != null)) {
            $incomesToday = Payment::whereHas('order', function ($query) use ($user) {
                $query->where('store_id', $user->store_id)
                      ->where('status', 'completed');
            })->whereDate('created_at', now()->toDateString())
            ->sum('amount');

            $pendingIncomes = Order::where('store_id', $user->store_id)
                ->where('status', 'pending')
                ->sum('total_amount');

            $pendingIncomes -= Order::where('store_id', $user->store_id)
                ->where('status', 'pending')
                ->sum('paid_amount');

            $inProgressOrders = Order::where('store_id', $user->store_id)
                ->whereIn('status', ['pending', 'in_progress'])
                ->count();

            $finishedOrdersToday = Order::where('store_id', $user->store_id)
                ->where('status', 'completed')
                ->whereDate('updated_at', now()->toDateString())
                ->count();
        }

        return inertia('Dashboard', [
            'user' => $request->user(),
            'incomesToday' => $incomesToday,
            'pendingIncomes' => $pendingIncomes,
            'inProgressOrders' => $inProgressOrders,
            'viewsByPeriod' => $viewsByPeriod,
            'finishedOrdersToday' => $finishedOrdersToday,
            'totalProducts' => $totalProducts
        ]);
    }
}

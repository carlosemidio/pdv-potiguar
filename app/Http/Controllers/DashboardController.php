<?php

namespace App\Http\Controllers;

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

        $viewsToday = 0;
        $viewsLast7Days = 0;
        $viewsLast30Days = 0;
        $viewsByPeriod = collect();
        $totalViews = 0;
        $totalProducts = 0;

        return inertia('Dashboard', [
            'user' => $request->user(),
            'viewsToday' => $viewsToday,
            'viewsLast7Days' => $viewsLast7Days,
            'viewsLast30Days' => $viewsLast30Days,
            'viewsByPeriod' => $viewsByPeriod,
            'totalViews' => $totalViews,
            'totalProducts' => $totalProducts
        ]);
    }
}

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

        $startDate = now()->subDays(30)->startOfDay();
        $endDate = now()->endOfDay();
        
        $user = User::with('store')->find($request->user()->id);

        if (!$user->store) {
            $viewsToday = 0;
            $viewsLast7Days = 0;
            $viewsLast30Days = 0;
            $viewsByPeriod = collect();
            $totalViews = 0;
            $totalProducts = 0;
        } else {
            $viewsByPeriod = View::where('viewable_type', Product::class)
                ->join('products', 'views.viewable_id', '=', 'products.id')
                ->where('products.store_id', $user->store->id)
                ->whereBetween('views.created_at', [$startDate, $endDate])
                ->selectRaw('DATE(views.created_at) as date, COUNT(*) as views_count')
                ->groupBy('date')
                ->orderBy('date', 'asc')
                ->get()
                ->mapWithKeys(function ($item) {
                    return [$item->date => $item->views_count];
                });

            $viewsToday = $viewsByPeriod[now()->format('Y-m-d')] ?? 0;

            $viewsLast7Days = $viewsByPeriod->filter(function ($count, $date) {
                return now()->subDays(7)->isBefore($date);
            })->sum();

            $viewsLast30Days = $viewsByPeriod->sum();

            $totalViews = View::where('viewable_type', Product::class)
                ->join('products', 'views.viewable_id', '=', 'products.id')
                ->where('products.store_id', $user->store->id)
                ->count();

            $totalProducts = Product::where('store_id', $user->store->id)->count();
        } 

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

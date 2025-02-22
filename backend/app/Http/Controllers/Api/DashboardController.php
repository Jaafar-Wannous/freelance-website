<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\DashboardRequest;
use App\Models\Service;
use App\Models\User;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function stats()
    {
        return response()->json([
            'users' => User::count(),
            'services' => Service::count(),
            'pending_requests' => DashboardRequest::where('status', 'بانتظار المراجعة')->count()
        ]);
    }

    public function getChartData()
    {
        $categories = Category::whereNull('mainCategory')
            ->withCount('categories')
            ->get(['id', 'title']);

        foreach ($categories as $category) {
            $category->categories_count = $category->categories_count ?? 0;
        }

        $requests = DashboardRequest::select('type', \DB::raw('count(*) as requests_count'))
        ->groupBy('type')
        ->get();

        return response()->json([
            'categories' => $categories,
            'requests' => $requests
        ]);
    }

}

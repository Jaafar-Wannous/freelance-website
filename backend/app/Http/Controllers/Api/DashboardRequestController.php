<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DashboardRequest;
use Illuminate\Http\Request;

class DashboardRequestController extends Controller
{
    public function index()
    {
        return DashboardRequest::with('user:id,username,email')->get();
    }

    public function show($id)
    {
        return DashboardRequest::with('user:id,name,email')->findOrFail($id);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|string',
            'status' => 'in:pending,approved,rejected',
            'data' => 'nullable|json',
        ]);

        $dashboardRequest = DashboardRequest::create([
            'user_id' => auth()->id(),
            'type' => $validated['type'],
            'status' => $validated['status'] ?? 'pending',
            'data' => $validated['data'],
        ]);

        return response()->json($dashboardRequest, 201);
    }

}


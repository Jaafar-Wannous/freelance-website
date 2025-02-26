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
        $request->validate([
            'type' => 'required|string',
            'data' => 'nullable|array',
        ]);

        $dashboardRequest = DashboardRequest::create([
            'user_id' => auth()->id(),
            'type' => $request->type,
            'data' => $request->data,
        ]);

        return response()->json($dashboardRequest, 201);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'type' => 'required|string',
            'data' => 'nullable|array',
        ]);

        $dashboardRequest = DashboardRequest::find($id);

        $dashboardRequest->update([
            // 'user_id' => auth()->id(),
            'status' => $request->status,
        ]);

        return response()->json($dashboardRequest, 200); 
    }


}


<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Request;
use Illuminate\Http\Request as Req;

class RequestController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $request = Request::with(['service', 'seller', 'buyer'])
        ->get();

        return response()->json([
            'request' => $request
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Req $req)
    {
        $req->validate([
            'service_id' => 'required',
            'seller_id' => 'required',
            'buyer_id' => 'required',
            'status' => 'required'
        ]);

        $request = Request::create([
            'service_id' => $req->service_id,
            'seller_id' => $req->seller_id,
            'buyer_id' => $req->buyer_id,
            'status' => $req->status
        ]);

        return response()->json([
            'request' => $request
        ], 200);

    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request)
    {
        $req = Request::where('id', '=', value: $request->id)
        ->with(['service', 'seller', 'buyer'])
        ->get();

        return response()->json([
            'request' => $req
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Req $requ)
    {
        $req = Request::find($request->id);

        if(!$req) {
            return response()->json([
                'message' => 'Request did not exist!'
            ], 404);
        }

        $requ->validate([
            'status' => 'required'
        ]);

        $req->update([
            'status' => $requ->status
        ]);

        return response()->json([
            'request' => $req
        ], 200);    
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request)
    {
        $req = Request::find($request->id);

        if(!$req) {
            return response()->json([
                'message' => 'Request did not exist!'
            ], 404);
        }

        $req->delete();

        return response()->json([
            'message' => 'the service deleted successfully!'
        ], 200);
    }
}

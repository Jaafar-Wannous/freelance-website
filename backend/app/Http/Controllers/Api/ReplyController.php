<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reply;
use Illuminate\Http\Request;

class ReplyController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $replies = Reply::with(['user', 'review'])
        ->get();

        return response()->json([
            'replies' => $replies
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'reply' => 'required | string',
            'review_id' => 'required',
            'user_id' => 'required'
        ]);

        $reply = Reply::create([
            'reply' => $request->reply,
            'review_id' => $request->review_id,
            'user_id' => $request->user_id
        ]);

        return response()->json([
            'reply' => $reply
        ], 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(Reply $reply)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Reply $reply)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Reply $reply)
    {
        //
    }
}

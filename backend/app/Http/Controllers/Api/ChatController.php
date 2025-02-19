<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Chat;
use Pusher\Pusher;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    public function sendMessage(Request $request)
    {
        $chat = Chat::create([
            'sender_id' => auth()->id(),
            'receiver_id' => $request->receiver_id,
            'message' => $request->message,
        ]);

        // Send event via Pusher
        $pusher = new Pusher(
            env('PUSHER_APP_KEY'),
            env('PUSHER_APP_SECRET'),
            env('PUSHER_APP_ID'),
            [
                'cluster' => env('PUSHER_APP_CLUSTER'),
                'useTLS' => true,
            ]
        );

        $pusher->trigger('chat-channel', 'new-message', [
            'chat' => $chat
        ]);

        return response()->json(['success' => true, 'chat' => $chat]);
    }

    public function getMessages(Request $request) {

        $chat = Chat::
        // where(function($query) use ($request) {
        //     $query->where('sender_id', '=', $request->sender_id)
        //         ->where('receiver_id', '=', $request->receiver_id);
        // })->orWhere(function(Builder $query) use ($request){
        //     $query->where('sender_id', '=', $request->receiver_id)
        //         ->where('receiver_id', '=', $request->sender_id);
        // })->
        with(['sender', 'receiver'])
        ->get();

        return response()->json([
            'messages' => $chat
        ], 200);
    }
}

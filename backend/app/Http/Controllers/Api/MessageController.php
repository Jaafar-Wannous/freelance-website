<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Message;
use Illuminate\Http\Request;
use Pusher\PushNotifications\PushNotifications;

use function Laravel\Prompts\error;

class MessageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $messages = Message::with(['sender', 'receiver'])->get();
        return response()->json([
            'success' => true,
            'data' => $messages
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

    }

    /**
     * Display the specified resource.
     */
    public function show(Message $message)
    {
        $message = Message::where('id', '=', $message->id)->with(['sender', 'receiver'])
        ->get();
        return response()->json([
            'success' => true,
            'message' => $message
        ]);

    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    public function sendMessage(Request $request)
{
    $validated = $request->validate([
        'receiver_id' => 'required|exists:users,id',
        'message' => 'required|string',
    ]);

    // Send notification using Pusher Beams
    $beamsClient = new PushNotifications([
        "instanceId" => env('PUSHER_BEAMS_INSTANCE_ID'),
        "secretKey" => env('PUSHER_BEAMS_SECRET_KEY'),
    ]);

    $publishResponse = $beamsClient->publishToUsers(
        [(string) $validated['receiver_id']], // Target user
        [
            "fcm" => [
                "notification" => [
                    "title" => "New Message",
                    "body" => "You received a new message",
                ],
            ],
            "apns" => [
                "aps" => [
                    "alert" => [
                        "title" => "New Message",
                        "body" => "You received a new message",
                    ],
                ],
            ],
        ]
    );

    return response()->json([
        "message" => "Message sent and push notification triggered",
        "publishResponse" => $publishResponse,
    ]);
}
}




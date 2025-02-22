<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notifications;
use Illuminate\Http\Request;
use Pusher\Pusher;
use Pusher\PushNotifications\PushNotifications;

class NotificationController extends Controller
{
    public function sendNotification(Request $request) {
        $notification = Notifications::create([
            'sender_id' => auth()->id(),
            'receiver_id' => $request->receiver_id,
            'content' => $request->content,
            'title' => $request->title,
            'data' => $request->data
        ]);

        $pusher = new Pusher(
            env('PUSHER_APP_KEY'),
            env('PUSHER_APP_SECRET'),
            env('PUSHER_APP_ID'),
            [
                'cluster' => env('PUSHER_APP_CLUSTER'),
                'useTLS' => true,
            ]
        );

        $pusher->trigger(
        'notification-channel', 
        'new-notification', 
        [
            'notification' => $notification
        ]);

        return response()->json([
            $notification
        ]);
    }

    public function getNotifications() {
        $notifications = Notifications::with(['sender', 'receiver'])
        ->get();

        return response()->json([
            $notifications
        ]);
    }

    public function makeAsRead(Request $request, Notifications $notifications){
        $not = Notifications::find($notifications->id);

        $not->update([
            'read' => $request->read
        ]);

        return response()->json([
            $not
        ]);
    }
}

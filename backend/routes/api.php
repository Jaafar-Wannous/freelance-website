<?php

use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ChatController;
use App\Http\Controllers\Api\MessageController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Auth\ForgotPasswordController;
use App\Http\Controllers\Auth\GoogleLoginController;
use App\Http\Controllers\Auth\GoogleRegisterController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\LogoutController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\ResetPasswordController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Pusher\PushNotifications\PushNotifications;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware(['auth:sanctum', 'updateLastSeen'])->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware('auth:sanctum')->post('/chat/send', [ChatController::class, 'sendMessage']);

Route::post('/authenticate-device', function (Request $request) {
    $beamsClient = new PushNotifications([
        "instanceId" => env('PUSHER_BEAMS_INSTANCE_ID'),
        "secretKey" => env('PUSHER_BEAMS_SECRET_KEY'),
    ]);

    $userId = auth()->id(); // Ensure user is authenticated

    $beamsToken = $beamsClient->generateToken($userId);

    return response()->json($beamsToken);
});



// Auth Routes
Route::post('register', [RegisterController::class, 'register']);
Route::post('google-register', [GoogleRegisterController::class, 'register']);
Route::post('login', [LoginController::class, 'login']);
Route::post('google-login', [GoogleLoginController::class, 'login']);
Route::post('logout', [LogoutController::class, 'logout']);
Route::post('verify-code', [RegisterController::class, 'verifyCode']);
Route::post('forgot-password', [ForgotPasswordController::class, 'sendResetCode']);
Route::post('reset-password', [ResetPasswordController::class, 'resetPassword']);
Route::post('create-user', [RegisterController::class, 'createUser']);
Route::post('resend-code', [RegisterController::class, 'resendVerificationCode']);
// End Auth Routes




Route::apiResource('messages', MessageController::class)
->only(['index', 'show']);
Route::apiResource('notifications', NotificationController::class)
->only(['index', 'show']);
Route::apiResource('categories', CategoryController::class)
->only(['index', 'show']);
Route::apiResource('services', ServiceController::class)
->only(['index', 'show']);
Route::apiResource('review', ReviewController::class)
->only(['index', 'show']);

Route::middleware('auth:sanctum')->group(function() {
    Route::apiResource('services', ServiceController::class)
    ->except(['index', 'show']);
    Route::apiResource('users', UserController::class)
    ->except('update');
    Route::apiResource('review', ReviewController::class)
    ->except(['index', 'show']);

    Route::put('/users/{user}/job-title', [UserController::class, 'updateJobTitle']);
    Route::delete('/users/{user}/job-title', [UserController::class, 'deleteJobTitle']);
    Route::put('/users/{user}/verify-phone', [UserController::class, 'verifyPhone']);
    Route::put('/users/{user}/about-me', [UserController::class, 'updateAboutMe']);
    Route::put('/users/{user}/role', [UserController::class, 'updateRole']);
    Route::post('/users/{user}/image', [UserController::class, 'updateImage']);
    Route::delete('/users/{user}/image', [UserController::class, 'deleteImage']);


});

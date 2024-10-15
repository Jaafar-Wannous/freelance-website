<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

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

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::controller(RegisterController::class)->group(function() {
    Route::post('register', 'register');
    Route::post('login', 'login');
    Route::post('forget-password', 'forgetPassword');
    Route::post('reset-password', 'resetPassword');
});

Route::apiResource('messages', MessageController::class)
->only(['index', 'show']);
Route::apiResource('notifications', NotificationController::class)
->only(['index', 'show']);
Route::apiResource('categories', CategoryController::class)
->only(['index', 'show']);
Route::apiResource('services', ServiceController::class)
->only(['index', 'show']);

Route::middleware('auth:sanctum')->group(function() {
    Route::apiResource('services', ServiceController::class)
    ->except(['index', 'show']);
    Route::apiResource('users', UserController::class);
});

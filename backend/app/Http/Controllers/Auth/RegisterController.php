<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;



class RegisterController extends Controller
{
    public function register(Request $request) { // (post) http://127.0.0.1:8000/api/register
        $messages = [
            'username.unique' => 'اسم المستخدم هذا مستخدم مسبقًا.',
            'email.unique' => 'البريد الإلكتروني هذا مستخدم مسبقًا.',
        ];

        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users,username',
            'email' => 'required|email|max:255|unique:users,email',
            'password' => 'required|string|min:6',
            'c_password' => 'required|same:password',
            'role' => 'required|in:seller,buyer',
        ], $messages);

        $user = User::create([
            'first_name' => trim($request->first_name),
            'last_name' => trim($request->last_name),
            'username' => trim($request->username),
            'email' => trim($request->email),
            'password' => Hash::make($request->password),
            'role' => $request->role,
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'user' => $user
        ], 201);
    }

}

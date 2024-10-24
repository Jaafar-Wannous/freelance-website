<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;


class RegisterController extends Controller
{
    public function register(Request $request) { // (post) http://127.0.0.1:8000/api/register
        $request->validate( [
            'first_name' => 'required | string',
            'last_name' => 'required | string',
            'username' => 'required | unique',
            'email' => 'required | email',
            'password' => 'required | min:8',
            'c_password' => 'required | same:password',
            'role' => 'required | in:seller,buyer',
            'gender' => 'required | in:male,female',
            'birthdate' => 'required | date'
        ]);

        $user = User::create([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'username' => $request->username,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'gender' => $request->gender,
            'birthdate' => $request->birthdate
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'user' => $user
        ]);
    }

}

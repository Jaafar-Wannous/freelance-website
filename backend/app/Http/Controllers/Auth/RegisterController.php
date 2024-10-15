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
use Illuminate\Validation\Rules\Password as RulesPassword;


class RegisterController extends Controller
{
    public function register(Request $request) { // (post) http://127.0.0.1:8000/api/register
        $request->validate( [
            'first_name' => 'required',
            'last_name' => 'required',
            'username' => 'required',
            'email' => 'required | email',
            'password' => 'required',
            'c_password' => 'required | same:password',
            'is_seller' => 'boolean',
            'is_buyer' => 'boolean',
            'phone_number' => '',
            'gender' => 'required',
            'birthdate' => 'required'
        ]);

        $user = User::create([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'username' => $request->username,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'is_seller' => $request->is_seller,
            'is_buyer' => $request->is_buyer,
            'phone_number' => $request->phone_number,
            'gender' => $request->gender,
            'birthdate' => $request->birthdate
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'user' => $user
        ]);
    }

    public function login(Request $request) { // (post) http://127.0.0.1:8000/api/login
        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
                'message' => 'Invalid login details'
            ], 401);
        }

        $user = User::where('email', $request->email)->first();
        $token = $user->createToken('auth_token')->plainTextToken;

            // if(isset($request->remember) && !empty($request->remember)){
            //     setcookie('email', $request->email, time()+3600);
            //     setcookie('password', $request->password, time()+3600);
            // }else{
            //     setcookie('email', '');
            //     setcookie('password', '');
            // }

            return response()->json([
                'access_token' => $token,
                'user' => $user,
            ]);
        
    }

    public function logout(Request $request) { // (post) http://127.0.0.1:8000/api/logout
        Auth::logout();

        return response()->json([
            'message' => 'Logged out'
        ]);
    }

    public function forgetPassword(Request $request) { // (post) http://127.0.0.1:8000/api/forget-password
        $request->validate([
            'email' => 'required | email'
        ]);

        $status = Password::sendResetLink(
            $request->only('email')
        );

        if($status == Password::RESET_LINK_SENT) {
            return [
                'status' => __($status)
            ];
        }

        throw ValidationException::withMessages([
            'email' => [trans($status)]
        ]);
    }

    public function resetPassword(Request $request) { // (post) http://127.0.0.1:8000/api/reset-password
        $request->validate([
            'token' => 'required',
            'email' => 'required | email',
            'password' => 'required | confirmed'
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user) use($request) {
                $user->forceFill([
                    'password' => Hash::make($request->password),
                    'remember_token' => Str::random(60)
                ])->save();

                $user->tokens()->delete();

                event(new PasswordReset($user));
            }
        );

        if($status == Password::PASSWORD_RESET) {
            // $request->user()->tokens()->delete();
            return response([
                'message' => 'Password reset Successfully!'
            ]);
        }

        return response([
            'message' => __($status)
        ], 500);

    }

}

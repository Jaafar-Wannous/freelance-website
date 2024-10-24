<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Validation\ValidationException;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //for the dashboard
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
    public function show(User $user)
    {
        //for the dashboard
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request,  User $user) // (put) http://127.0.0.1:8000/api/users/{user}
    {
        $u = User::find($user->id);

        $request->validate([
            'first_name' => 'required',
            'last_name' => 'required',
            'username' => 'required',
            'email' => 'required | email',
            'is_seller' => 'boolean',
            'is_buyer' => 'boolean',
            'phone_number' => '',
            'gender' => 'required',
            'birthdate' => 'required'
        ]);

        if(!$u) {
            return response()->json([
                'message' => 'The user don\'t found'
            ],404);
        }

        $u->update([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'username' => $request->username,
            'email' => $request->email,
            'role' => $request->role,
            'phone_number' => $request->phone_number,
            'gender' => $request->gender,
            'birthdate' => $request->birthdate
        ]);

        return response()->json([
            'message' => 'information updated successfully!!',
            'user' => $u
        ], 200);
    }

    public function updatePassword(Request $request) {
        $request->validate([
            'current_password' => 'required | string',
            'password' => 'required | min:8 | string | confirmed',
        ]);

        $currentPasswordStatus = Hash::check($request->current_password, auth()->user()->password);

        if($currentPasswordStatus) {
            User::findOrFail(Auth::user()->id)->update([
                'password' => Hash::make($request->password),
            ]);
            return response()->json([
                'message' => 'Password updated successfully'
            ], 200);
        }else {
            throw ValidationException::withMessages([
                'current_password' => ['The provided password does not match your current password.'],
            ]);
        }

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        // for the dashboard
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Validation\ValidationException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(['users' => User::all()], 200);
    }

    /**
     * Store a newly created resource in storage.
     */

     public function store(Request $request)
     {
         $validated = $request->validate([
             'first_name' => 'required|string|max:255',
             'last_name' => 'required|string|max:255',
             'username' => 'required|string|max:255|unique:users',
             'email' => 'required|email|max:255|unique:users',
             'password' => 'required|string|min:6',
             'phone_number' => 'nullable|string|size:10',
             'role' => 'required|in:admin',
         ]);

         $validated['password'] = bcrypt($validated['password']);

         $user = User::create($validated);

         return response()->json(['message' => 'تمت إضافة المشرف بنجاح', 'user' => $user], 201);
     }



    /**
     * Display the specified resource.
     */


public function update(Request $request, $id)
{
    $user = User::findOrFail($id);

    $request->validate([
        'username' => 'required|string|max:255|unique:users,username,'.$id,
        'email' => 'required|email|unique:users,email,'.$id,
        'role' => 'required|in:admin,seller,user',
        'is_auth_pId' => 'required|boolean',
        'is_auth_phone_num' => 'required|boolean',
    ]);

    $user->update([
        'username' => $request->username,
        'email' => $request->email,
        'role' => $request->role,
        'is_auth_pId' => (bool)$request->is_auth_pId,
        'is_auth_phone_num' => (bool)$request->is_auth_phone_num,
        'password' => $request->filled('password') ? bcrypt($request->password) : $user->password,
    ]);

    return response()->json(['message' => 'تم تعديل المستخدم بنجاح', 'user' => $user]);
}


    public function show(User $user)
    {
        $services = $user->services()->get();
        $requests = $user->seller()->get();
        $reviews = $user->recived()->get();
    
        return response()->json([
            'success' => true,
            'services' => $services,
            'requests' => $requests,
            'reviews' => $reviews
        ]);
    }

    /**
     * Update the specified resource in storage.
     */

    public function updateJobTitle(Request $request, User $user)
    {
    $u = User::find($user->id);

    if (!$u) {
        return response()->json(['message' => 'The user not found'], 404);
    }

    $u->update([
        'job_title' => $request->job_title,
    ]);

    return response()->json([
        'message' => 'Job title updated successfully!',
        'user' => $u
    ], 200);
    }

    public function updateAboutMe(Request $request, User $user)
    {
        $u = User::find($user->id);

        if (!$u) {
            return response()->json(['message' => 'The user not found'], 404);
        }

        $u->update([
            'about_me' => $request->about_me,
        ]);

        return response()->json([
            'message' => 'About me updated successfully!',
            'user' => $u
        ], 200);
    }

    public function updateRole(Request $request, User $user)
    {
        $u = User::find($user->id);

        if (!$u) {
            return response()->json(['message' => 'The user not found'], 404);
        }

        $u->update([
            'role' => $request->role,
        ]);

        return response()->json([
            'message' => 'role updated successfully!',
            'user' => $u
        ], 200);
    }

    public function updateImage(Request $request, User $user)
    {
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        if ($request->has('image')) {
            $imageData = $request->input('image');

            if (preg_match('/^data:image\/(\w+);base64,/', $imageData, $type)) {
                $extension = strtolower($type[1]);

                if (!in_array($extension, ['jpg', 'jpeg', 'png'])) {
                    return response()->json(['message' => 'Unsupported image format'], 400);
                }

                $image = explode(',', $imageData)[1];
                $fileName = time() . '.' . $extension;
                $filePath = 'uploads/profile_pictures/' . $fileName;

                if ($user->image && Storage::disk('public')->exists($user->image)) {
                    Storage::disk('public')->delete($user->image);
                }

                Storage::disk('public')->put($filePath, base64_decode($image));

                $fullPath = asset('storage/' . $filePath);

                $user->update(['image' => $fullPath]);

                return response()->json([
                    'message' => 'Image updated successfully!',
                    'user' => $user,
                    'image_url' => $fullPath, // تأكيد الرابط الكامل
                ], 200);
            }

            return response()->json(['message' => 'Invalid image data'], 400);
        }

        return response()->json(['message' => 'No image uploaded'], 400);
    }

    public function deleteImage(User $user)
    {
    if (!$user) {
        return response()->json(['message' => 'The user not found'], 404);
    }

    if ($user->image && Storage::disk('public')->exists(str_replace('storage/', '', $user->image))) {
        Storage::disk('public')->delete(str_replace('storage/', '', $user->image));
        $user->update(['image' => null]);
    }

    return response()->json(['message' => 'Image deleted successfully'], 200);
    }

    public function deleteJobTitle(User $user)
    {
    $user->job_title = null;
    $user->save();
    return response()->json(['message' => 'تم حذف المسمى الوظيفي بنجاح.'], 200);
    }


    public function verifyPhone(Request $request, User $user)
    {
        $u = User::find($user->id);

        if (!$u) {
            return response()->json(['message' => 'The user not found'], 404);
        }

        // التحقق من صحة رقم الجوال
        $request->validate([
            'phone_number' => 'required',
        ]);

        // تحديث رقم الجوال وتحديده على أنه قيد المراجعة
        $u->update([
            'phone_number' => $request->phone_number,
            'is_auth_phone_num' =>  true
        ]);
        // $u->save();

        return response()->json([
            'message' => 'رقم الجوال قيد المراجعة',
            'user' => $u
        ], 200);
    }


    public function verifypId(Request $request, User $user)
    {
        $u = User::find($user->id);

        if (!$u) {
            return response()->json(['message' => 'The user not found'], 404);
        }

        $u->update([
            'is_auth_pId' =>  true
        ]);

        return response()->json([
            'message' => 'رقم الجوال قيد المراجعة',
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
    public function destroy($id)
    {
        $user = User::findOrFail($id);

        // التحقق مما إذا كان لدى المستخدم خدمات
        if ($user->services()->exists()) {
            return response()->json([
                'message' => 'لا يمكنك حذف مستخدم قبل حذف خدماته'
            ], 400);
        }

        $user->delete();
        return response()->json(['message' => 'تم حذف المستخدم بنجاح']);
    }

}

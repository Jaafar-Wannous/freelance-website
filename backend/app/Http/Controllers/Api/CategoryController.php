<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()  // (get) http://127.0.0.1:8000/api/categories
    {
        $category = Category::with('categories')->where('mainCategory', '=', null)->get();

        return response()->json([
            'success' => true,
            'categories' => $category
        ]);
    }

    public function getAllCat()//Dashboard
    {
        $category = Category::with('categories')->get();

        return response()->json([
            'success' => true,
            'categories' => $category
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'image' => 'nullable|string',
            'mainCategory' => 'nullable|exists:categories,id',
        ]);

        $category = Category::create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'تم إنشاء الفئة بنجاح',
            'category' => $category
        ], 201);
    }


    /**
     * Display the specified resource.
     */
    public function show(Category $category) // (get) http://127.0.0.1:8000/api/categories/{category}
    {
        $cate = Category::where('id', '=', $category->id)
        ->with(['categories', 'services'])
        ->get();

        $cate->load(['categories.services', 'categories.services.review']);

        return response()->json([
            'success' => true,
            'category' => $cate
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $category = Category::findOrFail($id);

        $request->validate([
            'title' => 'required|string|max:255',
            'image' => 'nullable|string',
            'mainCategory' => 'nullable|exists:categories,id',
        ]);

        $category->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'تم تحديث الفئة بنجاح',
            'category' => $category
        ]);
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $category = Category::findOrFail($id);

        if ($category->categories()->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'لا يمكنك حذف التصنيف الرئيسي قبل حذف جميع التصنيفات الفرعية الخاصى به'
            ], 400);
        }

        $category->delete();

        return response()->json([
            'success' => true,
            'message' => 'تم حذف الفئة بنجاح'
        ]);
    }

}

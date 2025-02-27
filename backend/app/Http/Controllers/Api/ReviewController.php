<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index() // (get) http://127.0.0.1:8000/api/review
    {
        $reviews = Review::with(['service', 'writer', 'recipient'])
        ->get();

        return response()->json([
            'reviews' => $reviews
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request) // (post) http://127.0.0.1:8000/api/review
    {
        $request->validate([
            'service_id' => 'required',
            'writer_id' => 'required',
            'recipient_id' => 'required',
            'quality_of_service' => 'required | integer | min:1 | max:5',
            'speed_of_response' => 'required | integer | min:1 | max:5',
            'communication' => 'required | integer | min:1 | max:5',
            'comment' => 'required | string'
        ]);

        $review = Review::create([
            'service_id' => $request->service_id,
            'writer_id' => $request->writer_id,
            'recipient_id' => $request->recipient_id,
            'quality_of_service' => $request->quality_of_service,
            'speed_of_response' => $request->speed_of_response,
            'communication' => $request->communication,
            'comment' => $request->comment
        ]);

        return response()->json([
            'review' => $review
        ], 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(Review $review)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Review $review)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Review $review)
    {
        //
    }
}

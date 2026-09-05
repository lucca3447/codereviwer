<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Snippet;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ReviewController extends Controller
{
    public function index($snippetId)
    {
        $reviews = Review::with('user')->where('snippet_id', $snippetId)->get();

        return response()->json([
            'success' => true,
            'data' => $reviews,
        ]);
    }

    public function store(Request $request, $snippetId)
    {
        $snippet = Snippet::find($snippetId);

        if (!$snippet) {
            return response()->json([
                'success' => false,
                'message' => 'Trecho de código não encontrado.',
            ], 404);
        }

        if ($snippet->user_id === $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Você não pode revisar seu próprio trecho de código.',
            ], 403);
        }

        $existingReview = Review::where('snippet_id', $snippetId)
            ->where('user_id', $request->user()->id)
            ->first();

        if ($existingReview) {
            return response()->json([
                'success' => false,
                'message' => 'Você já revisou este trecho de código.',
            ], 422);
        }

        $validated = $request->validate([
            'status' => ['required', Rule::in(['approved', 'suggestion', 'correction'])],
            'comment' => 'nullable|string',
        ]);

        $review = $request->user()->reviews()->create([
            'snippet_id' => $snippet->id,
            'status' => $validated['status'],
            'comment' => $validated['comment'] ?? null,
        ]);

        return response()->json([
            'success' => true,
            'data' => $review,
        ], 201);
    }
}

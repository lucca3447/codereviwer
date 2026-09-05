<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Snippet;
use Illuminate\Http\Request;

class SnippetController extends Controller
{
    public function index(Request $request)
    {
        $query = Snippet::with('user')->withCount(['reviews', 'comments']);

        if ($request->has('language')) {
            $query->where('language', $request->language);
        }

        $snippets = $query->orderBy('created_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => $snippets,
        ]);
    }

    public function show($id)
    {
        $snippet = Snippet::with(['user', 'reviews.user', 'comments.user'])->find($id);

        if (!$snippet) {
            return response()->json([
                'success' => false,
                'message' => 'Trecho de código não encontrado.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $snippet,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:200',
            'code' => 'required|string',
            'language' => 'required|string|max:50',
            'description' => 'nullable|string',
        ]);

        $snippet = $request->user()->snippets()->create($validated);

        return response()->json([
            'success' => true,
            'data' => $snippet,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $snippet = Snippet::find($id);

        if (!$snippet) {
            return response()->json([
                'success' => false,
                'message' => 'Trecho de código não encontrado.',
            ], 404);
        }

        if ($snippet->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Acesso negado.',
            ], 403);
        }

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:200',
            'code' => 'sometimes|required|string',
            'language' => 'sometimes|required|string|max:50',
            'description' => 'nullable|string',
        ]);

        $snippet->update($validated);

        return response()->json([
            'success' => true,
            'data' => $snippet,
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $snippet = Snippet::find($id);

        if (!$snippet) {
            return response()->json([
                'success' => false,
                'message' => 'Trecho de código não encontrado.',
            ], 404);
        }

        if ($snippet->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Acesso negado.',
            ], 403);
        }

        $snippet->delete();

        return response()->json([
            'success' => true,
            'message' => 'Trecho de código removido com sucesso.',
        ]);
    }
}

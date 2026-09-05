<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Snippet;
use App\Models\Comment;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function index($snippetId)
    {
        $comments = Comment::with('user')
            ->where('snippet_id', $snippetId)
            ->orderBy('line_number')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $comments,
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

        $validated = $request->validate([
            'line_number' => 'required|integer|min:1',
            'content' => 'required|string',
        ]);

        $comment = $request->user()->comments()->create([
            'snippet_id' => $snippet->id,
            'line_number' => $validated['line_number'],
            'content' => $validated['content'],
        ]);

        return response()->json([
            'success' => true,
            'data' => $comment,
        ], 201);
    }

    public function destroy(Request $request, $id)
    {
        $comment = Comment::find($id);

        if (!$comment) {
            return response()->json([
                'success' => false,
                'message' => 'Comentário não encontrado.',
            ], 404);
        }

        if ($comment->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Acesso negado.',
            ], 403);
        }

        $comment->delete();

        return response()->json([
            'success' => true,
            'message' => 'Comentário removido com sucesso.',
        ]);
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Snippet;
use App\Models\Review;
use App\Models\Comment;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function stats(Request $request)
    {
        $user = $request->user();

        $snippetsCount = $user->snippets()->count();
        $reviewsGiven = $user->reviews()->count();
        $commentsGiven = $user->comments()->count();

        $userSnippetIds = $user->snippets()->pluck('id');
        
        $reviewsReceived = Review::whereIn('snippet_id', $userSnippetIds)->count();
        
        $approvedReviewsReceived = Review::whereIn('snippet_id', $userSnippetIds)
            ->where('status', 'approved')
            ->count();

        $approvalRate = $reviewsReceived > 0 
            ? round(($approvedReviewsReceived / $reviewsReceived) * 100, 2) 
            : 0;

        return response()->json([
            'success' => true,
            'data' => [
                'snippets_count' => $snippetsCount,
                'reviews_given' => $reviewsGiven,
                'reviews_received' => $reviewsReceived,
                'approval_rate' => $approvalRate,
                'comments_given' => $commentsGiven,
            ],
        ]);
    }
}

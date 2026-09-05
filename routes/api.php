<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\SnippetController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\CommentController;
use App\Http\Controllers\Api\DashboardController;

// Public routes
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);
Route::get('/snippets', [SnippetController::class, 'index']);
Route::get('/snippets/{id}', [SnippetController::class, 'show']);
Route::get('/snippets/{id}/reviews', [ReviewController::class, 'index']);
Route::get('/snippets/{id}/comments', [CommentController::class, 'index']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/auth/me', [AuthController::class, 'me']);
    
    Route::post('/snippets', [SnippetController::class, 'store']);
    Route::put('/snippets/{id}', [SnippetController::class, 'update']);
    Route::delete('/snippets/{id}', [SnippetController::class, 'destroy']);
    
    Route::post('/snippets/{id}/reviews', [ReviewController::class, 'store']);
    
    Route::post('/snippets/{id}/comments', [CommentController::class, 'store']);
    Route::delete('/comments/{id}', [CommentController::class, 'destroy']);
    
    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);
});

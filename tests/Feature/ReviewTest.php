<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\Snippet;
use App\Models\Review;

class ReviewTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_list_reviews_for_snippet()
    {
        $owner = User::factory()->create();
        $reviewer = User::factory()->create();
        $snippet = Snippet::create([
            'user_id' => $owner->id,
            'title' => 'Code',
            'code' => 'echo "a";',
            'language' => 'php',
        ]);
        
        Review::create([
            'snippet_id' => $snippet->id,
            'user_id' => $reviewer->id,
            'status' => 'approved',
            'comment' => 'Looks good',
        ]);

        $response = $this->getJson('/api/snippets/' . $snippet->id . '/reviews');

        $response->assertStatus(200)
                 ->assertJsonCount(1, 'data')
                 ->assertJsonPath('data.0.status', 'approved');
    }

    public function test_authenticated_user_can_review_snippet()
    {
        $owner = User::factory()->create();
        $reviewer = User::factory()->create();
        $snippet = Snippet::create([
            'user_id' => $owner->id,
            'title' => 'Code',
            'code' => 'echo "a";',
            'language' => 'php',
        ]);

        $response = $this->actingAs($reviewer)->postJson('/api/snippets/' . $snippet->id . '/reviews', [
            'status' => 'suggestion',
            'comment' => 'Maybe add a comment',
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('reviews', [
            'snippet_id' => $snippet->id,
            'user_id' => $reviewer->id,
            'status' => 'suggestion',
        ]);
    }

    public function test_cannot_review_own_snippet()
    {
        $owner = User::factory()->create();
        $snippet = Snippet::create([
            'user_id' => $owner->id,
            'title' => 'Code',
            'code' => 'echo "a";',
            'language' => 'php',
        ]);

        $response = $this->actingAs($owner)->postJson('/api/snippets/' . $snippet->id . '/reviews', [
            'status' => 'approved',
        ]);

        $response->assertStatus(403);
    }

    public function test_cannot_review_snippet_twice()
    {
        $owner = User::factory()->create();
        $reviewer = User::factory()->create();
        $snippet = Snippet::create([
            'user_id' => $owner->id,
            'title' => 'Code',
            'code' => 'echo "a";',
            'language' => 'php',
        ]);

        Review::create([
            'snippet_id' => $snippet->id,
            'user_id' => $reviewer->id,
            'status' => 'suggestion',
        ]);

        $response = $this->actingAs($reviewer)->postJson('/api/snippets/' . $snippet->id . '/reviews', [
            'status' => 'approved',
        ]);

        $response->assertStatus(422);
    }

    public function test_review_requires_valid_status()
    {
        $owner = User::factory()->create();
        $reviewer = User::factory()->create();
        $snippet = Snippet::create([
            'user_id' => $owner->id,
            'title' => 'Code',
            'code' => 'echo "a";',
            'language' => 'php',
        ]);

        $response = $this->actingAs($reviewer)->postJson('/api/snippets/' . $snippet->id . '/reviews', [
            'status' => 'invalid_status',
        ]);

        $response->assertStatus(422);
    }
}

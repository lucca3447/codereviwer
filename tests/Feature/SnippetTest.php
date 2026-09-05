<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\Snippet;

class SnippetTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_list_snippets()
    {
        $user = User::factory()->create();
        Snippet::create([
            'user_id' => $user->id,
            'title' => 'Test Snippet',
            'code' => 'echo "Hello";',
            'language' => 'php',
        ]);

        $response = $this->getJson('/api/snippets');

        $response->assertStatus(200)
                 ->assertJsonPath('success', true)
                 ->assertJsonCount(1, 'data');
    }

    public function test_can_view_single_snippet()
    {
        $user = User::factory()->create();
        $snippet = Snippet::create([
            'user_id' => $user->id,
            'title' => 'Single Snippet',
            'code' => 'return true;',
            'language' => 'php',
        ]);

        $response = $this->getJson('/api/snippets/' . $snippet->id);

        $response->assertStatus(200)
                 ->assertJsonPath('success', true)
                 ->assertJsonPath('data.title', 'Single Snippet');
    }

    public function test_authenticated_user_can_create_snippet()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->postJson('/api/snippets', [
            'title' => 'New Snippet',
            'code' => 'console.log("Hi");',
            'language' => 'javascript',
        ]);

        $response->assertStatus(201)
                 ->assertJsonPath('success', true);
                 
        $this->assertDatabaseHas('snippets', [
            'title' => 'New Snippet',
        ]);
    }

    public function test_unauthenticated_user_cannot_create_snippet()
    {
        $response = $this->postJson('/api/snippets', [
            'title' => 'New Snippet',
            'code' => 'console.log("Hi");',
            'language' => 'javascript',
        ]);

        $response->assertStatus(401);
    }

    public function test_owner_can_update_snippet()
    {
        $user = User::factory()->create();
        $snippet = Snippet::create([
            'user_id' => $user->id,
            'title' => 'Old Title',
            'code' => 'return false;',
            'language' => 'php',
        ]);

        $response = $this->actingAs($user)->putJson('/api/snippets/' . $snippet->id, [
            'title' => 'Updated Title',
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('snippets', [
            'id' => $snippet->id,
            'title' => 'Updated Title',
        ]);
    }

    public function test_owner_can_delete_snippet()
    {
        $user = User::factory()->create();
        $snippet = Snippet::create([
            'user_id' => $user->id,
            'title' => 'To Delete',
            'code' => 'exit;',
            'language' => 'php',
        ]);

        $response = $this->actingAs($user)->deleteJson('/api/snippets/' . $snippet->id);

        $response->assertStatus(200);
        $this->assertDatabaseMissing('snippets', [
            'id' => $snippet->id,
        ]);
    }

    public function test_non_owner_cannot_delete_snippet()
    {
        $owner = User::factory()->create();
        $otherUser = User::factory()->create();
        $snippet = Snippet::create([
            'user_id' => $owner->id,
            'title' => 'My Snippet',
            'code' => 'exit;',
            'language' => 'php',
        ]);

        $response = $this->actingAs($otherUser)->deleteJson('/api/snippets/' . $snippet->id);

        $response->assertStatus(403);
        $this->assertDatabaseHas('snippets', [
            'id' => $snippet->id,
        ]);
    }

    public function test_can_filter_snippets_by_language()
    {
        $user = User::factory()->create();
        Snippet::create([
            'user_id' => $user->id,
            'title' => 'PHP Snippet',
            'code' => 'echo "php";',
            'language' => 'php',
        ]);
        Snippet::create([
            'user_id' => $user->id,
            'title' => 'JS Snippet',
            'code' => 'console.log("js");',
            'language' => 'javascript',
        ]);

        $response = $this->getJson('/api/snippets?language=php');

        $response->assertStatus(200)
                 ->assertJsonCount(1, 'data')
                 ->assertJsonPath('data.0.language', 'php');
    }
}

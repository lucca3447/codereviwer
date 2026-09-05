<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Snippet;
use App\Models\Review;
use App\Models\Comment;
use Illuminate\Support\Facades\Hash;

class DemoSeeder extends Seeder
{
    public function run(): void
    {
        $user1 = User::create([
            'name' => 'Alice Developer',
            'email' => 'alice@example.com',
            'password' => Hash::make('password'),
        ]);

        $user2 = User::create([
            'name' => 'Bob Reviewer',
            'email' => 'bob@example.com',
            'password' => Hash::make('password'),
        ]);

        $user3 = User::create([
            'name' => 'Charlie Coder',
            'email' => 'charlie@example.com',
            'password' => Hash::make('password'),
        ]);

        $snippet1 = Snippet::create([
            'user_id' => $user1->id,
            'title' => 'Calculadora de Fatorial em PHP',
            'description' => 'Uma função simples para calcular o fatorial de um número usando recursão.',
            'code' => "<?php\n\nfunction factorial(\$n) {\n    if (\$n <= 1) {\n        return 1;\n    }\n    return \$n * factorial(\$n - 1);\n}\n\necho factorial(5);",
            'language' => 'php',
        ]);

        $snippet2 = Snippet::create([
            'user_id' => $user3->id,
            'title' => 'Conexão PDO',
            'description' => 'Exemplo de como conectar ao MySQL usando PDO com tratamento de erros.',
            'code' => "<?php\n\n\$host = '127.0.0.1';\n\$db   = 'test';\n\$user = 'root';\n\$pass = '';\n\$charset = 'utf8mb4';\n\n\$dsn = \"mysql:host=\$host;dbname=\$db;charset=\$charset\";\n\$options = [\n    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,\n    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,\n    PDO::ATTR_EMULATE_PREPARES   => false,\n];\n\ntry {\n     \$pdo = new PDO(\$dsn, \$user, \$pass, \$options);\n} catch (\\PDOException \$e) {\n     throw new \\PDOException(\$e->getMessage(), (int)\$e->getCode());\n}",
            'language' => 'php',
        ]);

        Review::create([
            'snippet_id' => $snippet1->id,
            'user_id' => $user2->id,
            'status' => 'approved',
            'comment' => 'Código limpo e fácil de entender. Muito bom!',
        ]);

        Review::create([
            'snippet_id' => $snippet2->id,
            'user_id' => $user1->id,
            'status' => 'suggestion',
            'comment' => 'Você poderia usar variáveis de ambiente para as credenciais do banco.',
        ]);

        Comment::create([
            'snippet_id' => $snippet1->id,
            'user_id' => $user2->id,
            'line_number' => 4,
            'content' => 'Gostei do uso de early return aqui.',
        ]);

        Comment::create([
            'snippet_id' => $snippet2->id,
            'user_id' => $user1->id,
            'line_number' => 3,
            'content' => 'Não deixe senhas fixas no código!',
        ]);
    }
}

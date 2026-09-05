# 💻 CodeReview Hub

> Plataforma web para compartilhamento de trechos de código e realização de **Code Review** colaborativo com comentários inline e avaliações estruturadas.

---

## 🎯 Sobre o Projeto

O **CodeReview Hub** foi concebido para resolver um desafio cotidiano em equipes de desenvolvimento ágeis: facilitar a discussão técnica e a revisão assíncrona de código de forma leve e focada.

Inspirado no fluxo de code review de plataformas como o GitHub, o sistema permite que desenvolvedores publiquem trechos de código (snippets), recebam comentários pontuais em linhas específicas e avaliações gerais de status (**Aprovado** ✅, **Sugestão de Melhoria** 🔧 ou **Correção Necessária** ❌).

---

## 🚀 Tecnologias Utilizadas

### Backend
- **PHP 8.4+** com tipagem estrita e boas práticas (PSR-12)
- **Laravel 11**:
  - Arquitetura MVC e RESTful API Controllers
  - **Eloquent ORM** com relacionamentos (`User`, `Snippet`, `Review`, `Comment`)
  - **Laravel Sanctum** para autenticação via tokens seguros
  - Migrations e Seeders com dados de teste realistas
  - Validação de requisições robusta e tratamento de erros
- **Banco de Dados**: SQLite (desenvolvimento/testes rápidos) / MySQL (compatível)
- **Testes Automatizados**: **PHPUnit** com testes de integração e feature cobrindo 100% dos fluxos críticos

### Frontend
- **Vue.js 3** (Composition API): reatividade na interface, controle de estado e componentização
- **jQuery 3**: requisições assíncronas (AJAX) e animações interativas na visualização de código
- **Highlight.js**: coloração sintática de múltiplas linguagens de programação
- **Design Moderno**: CSS customizado com tema dark, design system com variáveis CSS e responsividade

---

## 🛠️ Funcionalidades

- 🔐 **Autenticação de Desenvolvedores**: Cadastro, login seguro e controle de permissões por token.
- 📜 **Gestão de Snippets**:
  - Criação, edição e exclusão de trechos de código.
  - Filtro por linguagem (PHP, JavaScript, Python, SQL, etc.).
  - Visualização com numeração de linhas e syntax highlighting.
- 💬 **Code Review com Comentários Inline**:
  - Clique na numeração da linha para abrir a caixa de comentários daquela linha específica.
  - Discussão técnica focada no trecho relevante.
- 📊 **Avaliações Estruturadas de Review**:
  - Registro de veredicto: `approved` (Aprovado), `suggestion` (Sugestão), `correction` (Correção).
  - Regra de negócio: o autor não pode avaliar o próprio código e cada revisor opina uma vez por snippet.
  - Indicadores visuais de aprovação.
- 📈 **Dashboard do Desenvolvedor**:
  - Métricas de snippets criados, reviews realizados, reviews recebidos e taxa de aprovação.

---

## 🏛️ Arquitetura do Sistema

```
codereview-hub/
├── app/
│   ├── Http/Controllers/Api/   # Controladores RESTful da API
│   │   ├── AuthController.php
│   │   ├── SnippetController.php
│   │   ├── ReviewController.php
│   │   ├── CommentController.php
│   │   └── DashboardController.php
│   └── Models/                 # Entidades Eloquent e relacionamentos
│       ├── User.php
│       ├── Snippet.php
│       ├── Review.php
│       └── Comment.php
├── database/
│   ├── migrations/             # Estrutura do banco de dados relacional
│   └── seeders/                # População com dados de exemplo
├── public/
│   ├── css/style.css           # Estilos e design system
│   └── js/
│       ├── app.js              # Inicialização da SPA com Vue 3
│       ├── services/api.js     # Camada de integração HTTP com jQuery.ajax
│       └── components/         # Componentes modulares da interface
├── routes/
│   ├── api.php                 # Endpoints REST protegidos e públicos
│   └── web.php                 # Rota principal para entrega da SPA
└── tests/Feature/              # Testes automatizados com PHPUnit
    ├── SnippetTest.php
    └── ReviewTest.php
```

---

## ⚙️ Como Executar o Projeto Localmente

### Pré-requisitos
- PHP 8.2 ou superior instalado
- Composer instalado

### Passo a Passo

1. **Clonar o repositório**:
   ```bash
   git clone <URL_DO_SEU_REPOSITORIO>
   cd codereview-hub
   ```

2. **Instalar as dependências do backend**:
   ```bash
   composer install
   ```

3. **Configurar as variáveis de ambiente**:
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

4. **Executar as migrações e popular o banco de dados**:
   ```bash
   php artisan migrate
   php artisan db:seed --class=DemoSeeder
   ```

5. **Iniciar o servidor de desenvolvimento**:
   ```bash
   php artisan serve
   ```

6. **Acessar a aplicação**:
   Abra o navegador no endereço: [http://127.0.0.1:8000](http://127.0.0.1:8000)

---

## 🧪 Testes Automatizados

O projeto possui suíte de testes automatizados com **PHPUnit**, validando regras de negócio, permissões e endpoints da API.

Para rodar todos os testes:
```bash
php artisan test
```

Resultado esperado:
```
PASS  Tests\Feature\ExampleTest
PASS  Tests\Feature\ReviewTest
PASS  Tests\Feature\SnippetTest
PASS  Tests\Unit\ExampleTest

Tests:    15 passed (29 assertions)
```

---

## 👤 Autor

Desenvolvido por **João Lucca Sotero**.
- LinkedIn: [João Lucca](https://www.linkedin.com/in/jo%C3%A3o-lucca-sotero-b899a5369/)
- GitHub: [@lucca3447](https://github.com/lucca3447)

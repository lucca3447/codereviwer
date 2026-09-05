<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="CodeReview Hub - Plataforma de compartilhamento e revisão de código entre desenvolvedores">
    <title>CodeReview Hub</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">

    <!-- Highlight.js -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css">

    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">

    <!-- App CSS -->
    <link rel="stylesheet" href="{{ asset('css/style.css') }}">
</head>
<body>
    <div id="app">
        <app-header></app-header>

        <main class="main-content">
            <component :is="currentComponent"></component>
        </main>

        <!-- Modal de Autenticação -->
        <auth-forms v-if="showAuthModal"></auth-forms>

        <!-- Notificações Toast -->
        <toast-notification></toast-notification>
    </div>

    <!-- Vue.js 3 -->
    <script src="https://unpkg.com/vue@3/dist/vue.global.prod.js"></script>

    <!-- jQuery 3 -->
    <script src="https://unpkg.com/jquery@3/dist/jquery.min.js"></script>

    <!-- Highlight.js -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>

    <!-- API Service (jQuery.ajax) -->
    <script src="{{ asset('js/services/api.js') }}"></script>

    <!-- Vue Components -->
    <script src="{{ asset('js/components/ToastNotification.js') }}"></script>
    <script src="{{ asset('js/components/AppHeader.js') }}"></script>
    <script src="{{ asset('js/components/AuthForms.js') }}"></script>
    <script src="{{ asset('js/components/SnippetList.js') }}"></script>
    <script src="{{ asset('js/components/SnippetForm.js') }}"></script>
    <script src="{{ asset('js/components/CodeViewer.js') }}"></script>
    <script src="{{ asset('js/components/InlineComments.js') }}"></script>
    <script src="{{ asset('js/components/ReviewPanel.js') }}"></script>
    <script src="{{ asset('js/components/SnippetDetail.js') }}"></script>
    <script src="{{ asset('js/components/Dashboard.js') }}"></script>

    <!-- Vue App -->
    <script src="{{ asset('js/app.js') }}"></script>
</body>
</html>

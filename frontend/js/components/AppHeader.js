const AppHeader = {
    template: `
        <header class="app-header">
            <div class="container header-container">
                <div class="logo" @click="navigate('snippets')">
                    &lt;/&gt; <span>CodeReview Hub</span>
                </div>
                <nav class="nav-links">
                    <a class="nav-link" :class="{ active: currentView === 'snippets' }" @click="navigate('snippets')">Snippets</a>
                    <a v-if="user" class="nav-link" :class="{ active: currentView === 'new-snippet' }" @click="navigate('new-snippet')">Novo Snippet</a>
                    <a v-if="user" class="nav-link" :class="{ active: currentView === 'dashboard' }" @click="navigate('dashboard')">Dashboard</a>
                </nav>
                <div class="header-actions">
                    <template v-if="!user">
                        <button class="btn btn-outline" @click="navigate('login')">Entrar</button>
                        <button class="btn btn-primary" @click="navigate('register')">Cadastrar</button>
                    </template>
                    <template v-else>
                        <div class="user-menu">
                            <div class="avatar">{{ user.name.charAt(0).toUpperCase() }}</div>
                            <span class="text-secondary">{{ user.name }}</span>
                            <button class="btn btn-outline" @click="logout">Sair</button>
                        </div>
                    </template>
                </div>
            </div>
        </header>
    `,
    setup() {
        const user = Vue.inject('user');
        const currentView = Vue.inject('currentView');
        const navigate = Vue.inject('navigate');
        const logout = Vue.inject('logout');
        
        return { user, currentView, navigate, logout };
    }
};

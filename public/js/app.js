const { createApp, ref, computed, onMounted, provide } = Vue;

const app = createApp({
    setup() {
        // State
        const currentView = ref('snippets');
        const user = ref(null);
        const selectedSnippetId = ref(null);
        const showAuthModal = ref(false);
        const authMode = ref('login');
        const toasts = ref([]);

        // Navigation
        function navigate(view, data = null) {
            if (view === 'snippet-detail' && data) selectedSnippetId.value = data;
            if (view === 'login') { showAuthModal.value = true; authMode.value = 'login'; return; }
            if (view === 'register') { showAuthModal.value = true; authMode.value = 'register'; return; }
            currentView.value = view;
            window.scrollTo(0, 0);
        }

        // Component mapping
        const currentComponent = computed(() => {
            const map = {
                'snippets': 'snippet-list',
                'snippet-detail': 'snippet-detail',
                'new-snippet': 'snippet-form',
                'dashboard': 'dashboard-view',
            };
            return map[currentView.value] || 'snippet-list';
        });

        // Auth
        function setUser(userData) { user.value = userData; }
        function logout() {
            API.clearAuth();
            user.value = null;
            navigate('snippets');
            showToast('Logout realizado com sucesso!', 'info');
        }
        async function checkAuth() {
            if (API.isAuthenticated()) {
                try {
                    const res = await API.getMe();
                    if (res.success) {
                        user.value = res.data.user;
                    } else {
                        API.clearAuth();
                    }
                } catch { 
                    API.clearAuth(); 
                }
            }
        }

        // Toast
        function showToast(message, type = 'success') {
            const id = Date.now();
            toasts.value.push({ id, message, type });
            setTimeout(() => { toasts.value = toasts.value.filter(t => t.id !== id); }, 3000);
        }

        // Provide to all children
        provide('currentView', currentView);
        provide('user', user);
        provide('selectedSnippetId', selectedSnippetId);
        provide('navigate', navigate);
        provide('setUser', setUser);
        provide('logout', logout);
        provide('showToast', showToast);
        provide('showAuthModal', showAuthModal);
        provide('authMode', authMode);
        provide('toasts', toasts);

        onMounted(checkAuth);

        return { currentView, currentComponent, user, showAuthModal, authMode, toasts, selectedSnippetId };
    }
});

// Register all components here
app.component('app-header', AppHeader);
app.component('auth-forms', AuthForms);
app.component('snippet-list', SnippetList);
app.component('snippet-form', SnippetForm);
app.component('snippet-detail', SnippetDetail);
app.component('code-viewer', CodeViewer);
app.component('inline-comments', InlineComments);
app.component('review-panel', ReviewPanel);
app.component('dashboard-view', DashboardView);
app.component('toast-notification', ToastNotification);

app.mount('#app');

const SnippetDetail = {
    template: `
        <div v-if="loading" class="text-center py-5">
            <div class="spinner"></div>
            <p class="mt-4 text-secondary">Carregando snippet...</p>
        </div>
        <div v-else-if="!snippet" class="empty-state">
            <h3>Snippet não encontrado</h3>
            <button class="btn btn-primary mt-4" @click="navigate('snippets')">Voltar para Snippets</button>
        </div>
        <div v-else class="detail-layout">
            <div class="left-col">
                <div class="card mb-4">
                    <div class="d-flex justify-between items-center mb-2">
                        <h2 style="margin: 0">{{ snippet.title }}</h2>
                        <span :class="'badge badge-lang-' + snippet.language.toLowerCase()">{{ snippet.language }}</span>
                    </div>
                    
                    <div class="d-flex items-center gap-2 text-secondary mb-4">
                        <div class="avatar" style="width: 24px; height: 24px; font-size: 0.7rem;">{{ snippet.user?.name.charAt(0).toUpperCase() }}</div>
                        <span>{{ snippet.user?.name }} publicou {{ formatDate(snippet.created_at) }}</span>
                    </div>
                    
                    <p v-if="snippet.description" class="mb-4">{{ snippet.description }}</p>
                    
                    <div v-if="isOwner" class="d-flex gap-2 mb-4">
                        <button class="btn btn-outline" @click="deleteSnippet">Excluir Snippet</button>
                    </div>
                    
                    <h3 class="mb-2">Código</h3>
                    <code-viewer 
                        :code="snippet.code" 
                        :language="snippet.language" 
                        :comments="comments" 
                        :snippet-id="snippet.id"
                        @comment-added="loadComments">
                    </code-viewer>
                </div>
            </div>
            
            <div class="right-col">
                <review-panel 
                    :snippet="snippet" 
                    :reviews="reviews" 
                    @review-added="loadReviews">
                </review-panel>
            </div>
        </div>
    `,
    setup() {
        const snippetId = Vue.inject('selectedSnippetId');
        const navigate = Vue.inject('navigate');
        const showToast = Vue.inject('showToast');
        const user = Vue.inject('user');
        
        const snippet = Vue.ref(null);
        const reviews = Vue.ref([]);
        const comments = Vue.ref([]);
        const loading = Vue.ref(true);
        
        const isOwner = Vue.computed(() => {
            return user.value && snippet.value && user.value.id === snippet.value.user_id;
        });
        
        function formatDate(dateStr) {
            if (!dateStr) return '';
            const date = new Date(dateStr);
            const now = new Date();
            const diffMs = now - date;
            const diffMins = Math.floor(diffMs / 60000);
            if (diffMins < 60) return \`há \${diffMins} minutos\`;
            const diffHours = Math.floor(diffMins / 60);
            if (diffHours < 24) return \`há \${diffHours} horas\`;
            const diffDays = Math.floor(diffHours / 24);
            return \`há \${diffDays} dias\`;
        }
        
        async function loadSnippet() {
            loading.value = true;
            try {
                const res = await API.getSnippet(snippetId.value);
                if (res.success) {
                    snippet.value = res.data;
                    await Promise.all([loadReviews(), loadComments()]);
                } else {
                    snippet.value = null;
                }
            } catch (err) {
                snippet.value = null;
            } finally {
                loading.value = false;
            }
        }
        
        async function loadReviews() {
            try {
                const res = await API.getReviews(snippetId.value);
                if (res.success) reviews.value = res.data;
            } catch (e) { }
        }
        
        async function loadComments() {
            try {
                const res = await API.getComments(snippetId.value);
                if (res.success) comments.value = res.data;
            } catch (e) { }
        }
        
        async function deleteSnippet() {
            if (!confirm('Tem certeza que deseja excluir este snippet?')) return;
            try {
                const res = await API.deleteSnippet(snippetId.value);
                if (res.success) {
                    showToast('Snippet excluído');
                    navigate('snippets');
                } else {
                    showToast(res.message, 'error');
                }
            } catch (e) {
                showToast('Erro ao excluir', 'error');
            }
        }
        
        Vue.onMounted(loadSnippet);
        
        return { snippet, reviews, comments, loading, isOwner, formatDate, loadReviews, loadComments, deleteSnippet, navigate };
    }
};

const InlineComments = {
    props: ['comments', 'snippetId'],
    emits: ['comment-deleted'],
    template: `
        <div class="inline-comments-list">
            <div v-for="comment in comments" :key="comment.id" class="inline-comment mb-2 p-2" style="background: var(--bg-dark); border-radius: 6px; border: 1px solid var(--border-color);">
                <div class="d-flex justify-between items-center mb-1">
                    <div class="d-flex items-center gap-2">
                        <div class="avatar" style="width: 20px; height: 20px; font-size: 0.6rem;">{{ comment.user.name.charAt(0).toUpperCase() }}</div>
                        <strong style="font-size: 0.85rem">{{ comment.user.name }}</strong>
                        <span class="text-secondary" style="font-size: 0.75rem">{{ formatDate(comment.created_at) }}</span>
                    </div>
                    <button v-if="user && user.id === comment.user_id" @click="deleteComment(comment.id)" class="btn btn-outline" style="padding: 0 4px; border: none; color: var(--danger);">
                        <small>Excluir</small>
                    </button>
                </div>
                <div style="font-size: 0.9rem; margin-left: 28px; white-space: pre-wrap;">{{ comment.content }}</div>
            </div>
        </div>
    `,
    setup(props, { emit }) {
        const user = Vue.inject('user');
        const showToast = Vue.inject('showToast');
        
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
        
        async function deleteComment(id) {
            if (!confirm('Excluir comentário?')) return;
            try {
                const res = await API.deleteComment(id);
                if (res.success) {
                    showToast('Comentário excluído');
                    emit('comment-deleted');
                }
            } catch (e) {
                showToast('Erro ao excluir', 'error');
            }
        }
        
        return { user, formatDate, deleteComment };
    }
};

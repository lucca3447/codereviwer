const ReviewPanel = {
    props: ['snippet', 'reviews'],
    emits: ['review-added'],
    template: `
        <div class="card">
            <h3 class="mb-4">Reviews</h3>
            
            <div class="mb-4" v-if="reviews.length > 0">
                <div class="d-flex justify-between mb-2">
                    <span class="text-secondary">Total: {{ reviews.length }}</span>
                </div>
                <div style="display: flex; height: 8px; border-radius: 4px; overflow: hidden; margin-bottom: 10px;">
                    <div :style="{ width: getPercentage('approved') + '%', background: 'var(--success)' }"></div>
                    <div :style="{ width: getPercentage('suggestion') + '%', background: 'var(--warning)' }"></div>
                    <div :style="{ width: getPercentage('correction') + '%', background: 'var(--danger)' }"></div>
                </div>
                <div class="d-flex justify-between" style="font-size: 0.8rem">
                    <span style="color: var(--success)">{{ counts.approved }} Aprovados</span>
                    <span style="color: var(--warning)">{{ counts.suggestion }} Sugestões</span>
                    <span style="color: var(--danger)">{{ counts.correction }} Correções</span>
                </div>
            </div>
            <div v-else class="text-secondary mb-4 text-center">Nenhum review ainda.</div>
            
            <div v-if="reviews.length > 0" class="reviews-list mb-4">
                <div v-for="review in reviews" :key="review.id" class="review-item p-3 mb-2" style="background: var(--bg-dark); border-radius: 8px; border: 1px solid var(--border-color);">
                    <div class="d-flex justify-between items-center mb-2">
                        <div class="d-flex items-center gap-2">
                            <div class="avatar" style="width: 24px; height: 24px; font-size: 0.7rem;">{{ review.user.name.charAt(0).toUpperCase() }}</div>
                            <strong>{{ review.user.name }}</strong>
                        </div>
                        <span :class="'badge badge-' + review.status">{{ getStatusLabel(review.status) }}</span>
                    </div>
                    <p style="font-size: 0.9rem; margin-bottom: 0.5rem; white-space: pre-wrap;">{{ review.comment }}</p>
                    <div class="text-secondary" style="font-size: 0.75rem">{{ formatDate(review.created_at) }}</div>
                </div>
            </div>
            
            <div v-if="user && !isOwner && !hasReviewed" class="add-review-section" style="border-top: 1px solid var(--border-color); padding-top: 1rem;">
                <h4 class="mb-3">Deixe seu Review</h4>
                <form @submit.prevent="submitReview">
                    <div class="d-flex gap-2 mb-3">
                        <label class="flex-1" style="flex: 1; cursor: pointer;">
                            <input type="radio" v-model="form.status" value="approved" style="display:none">
                            <div class="p-2 text-center" :style="form.status === 'approved' ? 'border: 2px solid var(--success); border-radius: 6px; background: rgba(16, 185, 129, 0.1); color: var(--success)' : 'border: 1px solid var(--border-color); border-radius: 6px; color: var(--text-secondary)'">✅ Aprovar</div>
                        </label>
                        <label class="flex-1" style="flex: 1; cursor: pointer;">
                            <input type="radio" v-model="form.status" value="suggestion" style="display:none">
                            <div class="p-2 text-center" :style="form.status === 'suggestion' ? 'border: 2px solid var(--warning); border-radius: 6px; background: rgba(245, 158, 11, 0.1); color: var(--warning)' : 'border: 1px solid var(--border-color); border-radius: 6px; color: var(--text-secondary)'">🔧 Sugerir</div>
                        </label>
                        <label class="flex-1" style="flex: 1; cursor: pointer;">
                            <input type="radio" v-model="form.status" value="correction" style="display:none">
                            <div class="p-2 text-center" :style="form.status === 'correction' ? 'border: 2px solid var(--danger); border-radius: 6px; background: rgba(239, 68, 68, 0.1); color: var(--danger)' : 'border: 1px solid var(--border-color); border-radius: 6px; color: var(--text-secondary)'">❌ Corrigir</div>
                        </label>
                    </div>
                    
                    <textarea class="form-control mb-3" v-model="form.comment" placeholder="Seus comentários gerais sobre o código..." required style="min-height: 100px;"></textarea>
                    
                    <button type="submit" class="btn btn-primary w-100" style="width: 100%" :disabled="loading">
                        <span v-if="loading" class="spinner d-inline-block" style="width: 16px; height: 16px; border-width: 2px;"></span>
                        <span v-else>Enviar Review</span>
                    </button>
                </form>
            </div>
            
            <div v-else-if="user && isOwner" class="text-center text-secondary mt-3 p-3" style="background: var(--bg-dark); border-radius: 6px;">
                Você não pode avaliar seu próprio snippet.
            </div>
            <div v-else-if="user && hasReviewed" class="text-center text-secondary mt-3 p-3" style="background: var(--bg-dark); border-radius: 6px;">
                Você já avaliou este snippet.
            </div>
            <div v-else-if="!user" class="text-center text-secondary mt-3 p-3" style="background: var(--bg-dark); border-radius: 6px;">
                Faça <a href="#" @click.prevent="navigate('login')">login</a> para avaliar.
            </div>
        </div>
    `,
    setup(props, { emit }) {
        const user = Vue.inject('user');
        const showToast = Vue.inject('showToast');
        const navigate = Vue.inject('navigate');
        
        const form = Vue.ref({ status: 'approved', comment: '' });
        const loading = Vue.ref(false);
        
        const isOwner = Vue.computed(() => {
            return user.value && props.snippet && user.value.id === props.snippet.user_id;
        });
        
        const hasReviewed = Vue.computed(() => {
            return user.value && props.reviews.some(r => r.user_id === user.value.id);
        });
        
        const counts = Vue.computed(() => {
            const res = { approved: 0, suggestion: 0, correction: 0 };
            props.reviews.forEach(r => res[r.status]++);
            return res;
        });
        
        function getPercentage(status) {
            if (props.reviews.length === 0) return 0;
            return (counts.value[status] / props.reviews.length) * 100;
        }
        
        function getStatusLabel(status) {
            if (status === 'approved') return '✅ Aprovado';
            if (status === 'suggestion') return '🔧 Sugestão';
            if (status === 'correction') return '❌ Correção';
            return status;
        }
        
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
        
        async function submitReview() {
            loading.value = true;
            try {
                const res = await API.createReview(props.snippet.id, form.value);
                if (res.success) {
                    showToast('Review enviado com sucesso!');
                    form.value = { status: 'approved', comment: '' };
                    emit('review-added');
                } else {
                    showToast(res.message || 'Erro ao enviar review', 'error');
                }
            } catch (err) {
                showToast('Erro de conexão', 'error');
            } finally {
                loading.value = false;
            }
        }
        
        return { user, form, loading, isOwner, hasReviewed, counts, getPercentage, getStatusLabel, formatDate, submitReview, navigate };
    }
};

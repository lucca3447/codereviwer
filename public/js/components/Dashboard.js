const DashboardView = {
    template: `
        <div>
            <h2 class="mb-4">Meu Dashboard</h2>
            
            <div v-if="loading" class="text-center py-5">
                <div class="spinner"></div>
            </div>
            
            <div v-else class="dashboard-grid">
                <div class="card stat-card" style="border-top: 4px solid var(--accent-primary)">
                    <div class="stat-value">{{ stats.snippets_count || 0 }}</div>
                    <div class="stat-label">📝 Snippets Criados</div>
                </div>
                
                <div class="card stat-card" style="border-top: 4px solid #3b82f6">
                    <div class="stat-value">{{ stats.reviews_given || 0 }}</div>
                    <div class="stat-label">🔍 Reviews Realizados</div>
                </div>
                
                <div class="card stat-card" style="border-top: 4px solid var(--success)">
                    <div class="stat-value">{{ stats.reviews_received || 0 }}</div>
                    <div class="stat-label">📥 Reviews Recebidos</div>
                </div>
                
                <div class="card stat-card" style="border-top: 4px solid var(--warning)">
                    <div class="stat-value">{{ formatPercentage(stats.approval_rate) }}</div>
                    <div class="stat-label">✅ Taxa de Aprovação</div>
                </div>
                
                <div class="card stat-card" style="border-top: 4px solid #14b8a6">
                    <div class="stat-value">{{ stats.comments_given || 0 }}</div>
                    <div class="stat-label">💬 Comentários Feitos</div>
                </div>
            </div>
        </div>
    `,
    setup() {
        const stats = Vue.ref({});
        const loading = Vue.ref(true);
        const user = Vue.inject('user');
        
        function formatPercentage(val) {
            if (val === undefined || val === null) return '0%';
            return Math.round(val) + '%';
        }
        
        async function loadStats() {
            loading.value = true;
            try {
                const res = await API.getStats();
                if (res.success) {
                    stats.value = res.data;
                }
            } catch (e) {
                console.error(e);
            } finally {
                loading.value = false;
            }
        }
        
        Vue.onMounted(() => {
            if (user.value) loadStats();
        });
        
        return { stats, loading, formatPercentage };
    }
};

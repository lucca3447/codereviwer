const SnippetList = {
    template: `
        <div>
            <div class="d-flex justify-between items-center mb-4">
                <h2>Snippets para Review</h2>
                <div>
                    <select class="form-control" v-model="filterLang" style="width: 200px" @change="loadSnippets">
                        <option value="">Todas as Linguagens</option>
                        <option value="PHP">PHP</option>
                        <option value="JavaScript">JavaScript</option>
                        <option value="Python">Python</option>
                        <option value="SQL">SQL</option>
                        <option value="CSS">CSS</option>
                        <option value="HTML">HTML</option>
                        <option value="Java">Java</option>
                        <option value="C#">C#</option>
                        <option value="Go">Go</option>
                        <option value="Ruby">Ruby</option>
                        <option value="TypeScript">TypeScript</option>
                    </select>
                </div>
            </div>
            
            <div v-if="loading" class="text-center py-5">
                <div class="spinner"></div>
                <p class="mt-4 text-secondary">Carregando snippets...</p>
            </div>
            
            <div v-else-if="snippets.length === 0" class="empty-state">
                <h3>Nenhum snippet encontrado</h3>
                <p>Seja o primeiro a compartilhar código!</p>
                <button class="btn btn-primary mt-4" @click="navigate('new-snippet')">Compartilhar Snippet</button>
            </div>
            
            <div v-else class="snippet-grid">
                <div v-for="snippet in snippets" :key="snippet.id" class="card snippet-card" @click="goToSnippet(snippet.id)">
                    <div class="d-flex justify-between items-center">
                        <h3 style="font-size: 1.1rem; margin:0">{{ snippet.title }}</h3>
                        <span :class="'badge badge-lang-' + snippet.language.toLowerCase()">{{ snippet.language }}</span>
                    </div>
                    
                    <div class="code-preview" style="background: var(--code-bg); padding: 10px; border-radius: 6px; overflow: hidden; max-height: 100px;">
                        <pre><code :class="'language-' + snippet.language.toLowerCase()">{{ getPreviewCode(snippet.code) }}</code></pre>
                    </div>
                    
                    <div class="d-flex justify-between items-center mt-2 text-secondary" style="font-size: 0.85rem">
                        <div class="d-flex items-center gap-2">
                            <div class="avatar" style="width: 24px; height: 24px; font-size: 0.7rem;">{{ snippet.user.name.charAt(0).toUpperCase() }}</div>
                            <span>{{ snippet.user.name }} • {{ formatDate(snippet.created_at) }}</span>
                        </div>
                        <div>
                            <span>⭐ {{ snippet.reviews_count || 0 }} reviews</span>
                            <span class="ml-2" style="margin-left: 8px">💬 {{ snippet.comments_count || 0 }} coments</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    setup() {
        const snippets = Vue.ref([]);
        const loading = Vue.ref(true);
        const filterLang = Vue.ref('');
        const navigate = Vue.inject('navigate');
        
        function getPreviewCode(code) {
            return code.split('\\n').slice(0, 4).join('\\n');
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
        
        async function loadSnippets() {
            loading.value = true;
            try {
                const res = await API.getSnippets(filterLang.value);
                if (res.success) {
                    snippets.value = res.data;
                    // Apply syntax highlighting next tick
                    Vue.nextTick(() => {
                        document.querySelectorAll('.snippet-card pre code').forEach((block) => {
                            hljs.highlightElement(block);
                        });
                    });
                }
            } catch (e) {
                console.error("Failed to load snippets", e);
            } finally {
                loading.value = false;
            }
        }
        
        function goToSnippet(id) {
            navigate('snippet-detail', id);
        }
        
        Vue.onMounted(loadSnippets);
        
        return { snippets, loading, filterLang, loadSnippets, getPreviewCode, formatDate, goToSnippet, navigate };
    }
};

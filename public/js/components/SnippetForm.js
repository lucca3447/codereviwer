const SnippetForm = {
    template: `
        <div class="card max-w-4xl mx-auto">
            <h2 class="mb-4">Novo Snippet</h2>
            <form @submit.prevent="submit">
                <div class="form-group">
                    <label class="form-label">Título</label>
                    <input type="text" class="form-control" v-model="form.title" required placeholder="Ex: Função para calcular fibonacci">
                </div>
                
                <div class="form-group">
                    <label class="form-label">Linguagem</label>
                    <select class="form-control" v-model="form.language" required>
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
                        <option value="Other">Outra</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Descrição (opcional)</label>
                    <textarea class="form-control" v-model="form.description" placeholder="Explique o contexto ou o que você gostaria que fosse revisado..."></textarea>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Código</label>
                    <div class="detail-layout">
                        <div>
                            <textarea class="form-control code-input" v-model="form.code" required placeholder="Cole seu código aqui..." @input="updatePreview"></textarea>
                        </div>
                        <div class="code-preview-pane">
                            <label class="form-label">Preview</label>
                            <div class="code-viewer-wrapper" style="min-height: 300px; padding: 1rem;">
                                <pre><code ref="previewBlock" :class="'language-' + form.language.toLowerCase()">{{ form.code || '// Seu código aparecerá aqui' }}</code></pre>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="d-flex justify-between items-center mt-4">
                    <button type="button" class="btn btn-outline" @click="navigate('snippets')">Cancelar</button>
                    <button type="submit" class="btn btn-primary" :disabled="loading">
                        <span v-if="loading" class="spinner d-inline-block" style="width: 16px; height: 16px; border-width: 2px;"></span>
                        <span v-else>Publicar Snippet</span>
                    </button>
                </div>
            </form>
        </div>
    `,
    setup() {
        const navigate = Vue.inject('navigate');
        const showToast = Vue.inject('showToast');
        const previewBlock = Vue.ref(null);
        
        const form = Vue.ref({
            title: '',
            language: 'JavaScript',
            description: '',
            code: ''
        });
        const loading = Vue.ref(false);
        
        function updatePreview() {
            if (previewBlock.value) {
                // To avoid breaking Vue binding, we don't modify DOM directly if not needed, 
                // but highlight.js modifies the DOM. So we re-apply it.
                previewBlock.value.removeAttribute('data-highlighted');
                hljs.highlightElement(previewBlock.value);
            }
        }
        
        Vue.watch(() => form.value.language, updatePreview);
        
        async function submit() {
            loading.value = true;
            try {
                const res = await API.createSnippet(form.value);
                if (res.success) {
                    showToast('Snippet publicado com sucesso!');
                    navigate('snippet-detail', res.data.snippet.id);
                } else {
                    showToast(res.message || 'Erro ao publicar snippet', 'error');
                }
            } catch (err) {
                showToast('Erro de conexão', 'error');
            } finally {
                loading.value = false;
            }
        }
        
        return { form, loading, submit, navigate, previewBlock, updatePreview };
    }
};

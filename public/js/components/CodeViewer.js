const CodeViewer = {
    props: ['code', 'language', 'comments', 'snippetId'],
    emits: ['comment-added'],
    template: `
        <div class="code-viewer-wrapper" ref="wrapper">
            <div class="code-table">
                <template v-for="(line, index) in lines" :key="index">
                    <div class="code-line">
                        <div class="line-number" :data-line="index + 1" @click="toggleCommentForm(index + 1)">
                            {{ index + 1 }}
                            <div v-if="hasComments(index + 1)" class="comment-indicator"></div>
                        </div>
                        <div class="line-content">
                            <code :class="'language-' + language.toLowerCase()">{{ line || ' ' }}</code>
                        </div>
                    </div>
                    
                    <div :id="'comment-form-' + (index + 1)" class="inline-comment-section">
                        <inline-comments 
                            v-if="hasComments(index + 1)" 
                            :comments="getCommentsForLine(index + 1)" 
                            :snippet-id="snippetId"
                            @comment-deleted="$emit('comment-added')">
                        </inline-comments>
                        
                        <div v-if="user" class="mt-2">
                            <textarea class="form-control mb-2" v-model="newComments[index + 1]" placeholder="Adicionar comentário nesta linha..." style="min-height: 60px;"></textarea>
                            <div class="d-flex justify-between items-center">
                                <button class="btn btn-outline" @click="toggleCommentForm(index + 1)" style="padding: 0.25rem 0.5rem; font-size: 0.8rem">Cancelar</button>
                                <button class="btn btn-primary" @click="submitComment(index + 1)" style="padding: 0.25rem 0.5rem; font-size: 0.8rem">Comentar</button>
                            </div>
                        </div>
                        <div v-else class="text-secondary text-center mt-2">
                            <small>Faça <a href="#" @click.prevent="navigate('login')">login</a> para comentar.</small>
                        </div>
                    </div>
                </template>
            </div>
        </div>
    `,
    setup(props, { emit }) {
        const user = Vue.inject('user');
        const showToast = Vue.inject('showToast');
        const navigate = Vue.inject('navigate');
        const wrapper = Vue.ref(null);
        
        const lines = Vue.computed(() => props.code ? props.code.split('\\n') : []);
        const newComments = Vue.ref({});
        
        function hasComments(lineNum) {
            return props.comments && props.comments.some(c => c.line_number === lineNum);
        }
        
        function getCommentsForLine(lineNum) {
            return props.comments ? props.comments.filter(c => c.line_number === lineNum) : [];
        }
        
        function toggleCommentForm(lineNum) {
            const $form = $(wrapper.value).find(\`#comment-form-\${lineNum}\`);
            $form.slideToggle(200);
        }
        
        async function submitComment(lineNum) {
            const content = newComments.value[lineNum];
            if (!content || !content.trim()) return;
            
            try {
                const res = await API.createComment(props.snippetId, { line_number: lineNum, content });
                if (res.success) {
                    newComments.value[lineNum] = '';
                    emit('comment-added');
                    showToast('Comentário adicionado');
                } else {
                    showToast(res.message, 'error');
                }
            } catch (e) {
                showToast('Erro ao comentar', 'error');
            }
        }
        
        function applyHighlight() {
            if (!wrapper.value) return;
            $(wrapper.value).find('code').each(function(i, block) {
                block.removeAttribute('data-highlighted');
                hljs.highlightElement(block);
            });
        }
        
        // Always show form if there are comments for that line
        Vue.watch(() => props.comments, () => {
            if (!wrapper.value) return;
            Vue.nextTick(() => {
                props.comments.forEach(c => {
                    const $form = $(wrapper.value).find(\`#comment-form-\${c.line_number}\`);
                    if (!$form.is(':visible')) {
                        $form.show();
                    }
                });
            });
        }, { deep: true });
        
        Vue.onMounted(() => {
            applyHighlight();
            if (props.comments) {
                Vue.nextTick(() => {
                    props.comments.forEach(c => {
                        $(wrapper.value).find(\`#comment-form-\${c.line_number}\`).show();
                    });
                });
            }
        });
        
        Vue.onUpdated(() => {
            applyHighlight();
        });
        
        return { user, lines, newComments, wrapper, hasComments, getCommentsForLine, toggleCommentForm, submitComment, navigate };
    }
};

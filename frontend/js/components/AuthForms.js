const AuthForms = {
    template: `
        <div class="modal-overlay" @click.self="close">
            <div class="modal-content">
                <div class="modal-header">
                    <div class="modal-tab" :class="{ active: mode === 'login' }" @click="mode = 'login'">Entrar</div>
                    <div class="modal-tab" :class="{ active: mode === 'register' }" @click="mode = 'register'">Cadastrar</div>
                </div>
                <div class="modal-body">
                    <form v-if="mode === 'login'" @submit.prevent="handleLogin">
                        <div class="form-group">
                            <label class="form-label">Email</label>
                            <input type="email" class="form-control" v-model="loginForm.email" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Senha</label>
                            <input type="password" class="form-control" v-model="loginForm.password" required>
                        </div>
                        <div v-if="error" class="mb-2 text-danger text-center"><small>{{ error }}</small></div>
                        <button type="submit" class="btn btn-primary w-100" style="width: 100%" :disabled="loading">
                            <span v-if="loading" class="spinner d-inline-block" style="width: 16px; height: 16px; border-width: 2px;"></span>
                            <span v-else>Entrar</span>
                        </button>
                    </form>
                    
                    <form v-if="mode === 'register'" @submit.prevent="handleRegister">
                        <div class="form-group">
                            <label class="form-label">Nome</label>
                            <input type="text" class="form-control" v-model="registerForm.name" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Email</label>
                            <input type="email" class="form-control" v-model="registerForm.email" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Senha</label>
                            <input type="password" class="form-control" v-model="registerForm.password" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Confirmar Senha</label>
                            <input type="password" class="form-control" v-model="registerForm.confirmPassword" required>
                        </div>
                        <div v-if="error" class="mb-2 text-danger text-center"><small>{{ error }}</small></div>
                        <button type="submit" class="btn btn-primary w-100" style="width: 100%" :disabled="loading">
                            <span v-if="loading" class="spinner d-inline-block" style="width: 16px; height: 16px; border-width: 2px;"></span>
                            <span v-else>Cadastrar</span>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    `,
    setup() {
        const showAuthModal = Vue.inject('showAuthModal');
        const authMode = Vue.inject('authMode');
        const setUser = Vue.inject('setUser');
        const showToast = Vue.inject('showToast');
        
        const mode = Vue.ref(authMode.value);
        const loading = Vue.ref(false);
        const error = Vue.ref('');
        
        const loginForm = Vue.ref({ email: '', password: '' });
        const registerForm = Vue.ref({ name: '', email: '', password: '', confirmPassword: '' });
        
        function close() {
            showAuthModal.value = false;
        }
        
        async function handleLogin() {
            loading.value = true;
            error.value = '';
            try {
                const res = await API.login(loginForm.value.email, loginForm.value.password);
                if (res.success) {
                    API.setToken(res.data.token);
                    setUser(res.data.user);
                    showToast('Login realizado com sucesso!');
                    close();
                } else {
                    error.value = res.message || 'Erro ao realizar login';
                }
            } catch (err) {
                error.value = 'Erro de conexão ou credenciais inválidas';
            } finally {
                loading.value = false;
            }
        }
        
        async function handleRegister() {
            if (registerForm.value.password !== registerForm.value.confirmPassword) {
                error.value = 'As senhas não coincidem';
                return;
            }
            loading.value = true;
            error.value = '';
            try {
                const res = await API.register(registerForm.value.name, registerForm.value.email, registerForm.value.password);
                if (res.success) {
                    API.setToken(res.data.token);
                    setUser(res.data.user);
                    showToast('Cadastro realizado com sucesso!');
                    close();
                } else {
                    error.value = res.message || 'Erro ao realizar cadastro';
                }
            } catch (err) {
                error.value = 'Erro de conexão ou dados inválidos';
            } finally {
                loading.value = false;
            }
        }
        
        return { mode, loginForm, registerForm, handleLogin, handleRegister, close, loading, error };
    }
};

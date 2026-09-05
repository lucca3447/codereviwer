const API = {
    baseUrl: '/api',
    
    getToken() { return localStorage.getItem('cr_token'); },
    setToken(token) { localStorage.setItem('cr_token', token); },
    setUser(user) { localStorage.setItem('cr_user', JSON.stringify(user)); },
    getUser() { const u = localStorage.getItem('cr_user'); return u ? JSON.parse(u) : null; },
    clearAuth() { localStorage.removeItem('cr_token'); localStorage.removeItem('cr_user'); },
    isAuthenticated() { return !!this.getToken(); },
    
    request(method, endpoint, data = null) {
        const options = {
            url: `${this.baseUrl}${endpoint}`,
            method,
            contentType: 'application/json',
            dataType: 'json',
            headers: {}
        };
        if (data) options.data = JSON.stringify(data);
        if (this.getToken()) options.headers['Authorization'] = `Bearer ${this.getToken()}`;
        return $.ajax(options);
    },
    
    // Auth methods
    login(email, password) { return this.request('POST', '/auth/login', { email, password }); },
    register(name, email, password) { return this.request('POST', '/auth/register', { name, email, password }); },
    getMe() { return this.request('GET', '/auth/me'); },
    
    // Snippet methods
    getSnippets(language = null) {
        const query = language ? `?language=${language}` : '';
        return this.request('GET', `/snippets${query}`);
    },
    getSnippet(id) { return this.request('GET', `/snippets/${id}`); },
    createSnippet(data) { return this.request('POST', '/snippets', data); },
    updateSnippet(id, data) { return this.request('PUT', `/snippets/${id}`, data); },
    deleteSnippet(id) { return this.request('DELETE', `/snippets/${id}`); },
    
    // Review methods
    getReviews(snippetId) { return this.request('GET', `/snippets/${snippetId}/reviews`); },
    createReview(snippetId, data) { return this.request('POST', `/snippets/${snippetId}/reviews`, data); },
    
    // Comment methods
    getComments(snippetId) { return this.request('GET', `/snippets/${snippetId}/comments`); },
    createComment(snippetId, data) { return this.request('POST', `/snippets/${snippetId}/comments`, data); },
    deleteComment(id) { return this.request('DELETE', `/comments/${id}`); },
    
    // Dashboard
    getStats() { return this.request('GET', '/dashboard/stats'); },
};

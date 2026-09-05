const ToastNotification = {
    template: `
        <div class="toast-container">
            <div v-for="toast in toasts" :key="toast.id" :class="['toast', 'toast-' + toast.type]">
                {{ toast.message }}
            </div>
        </div>
    `,
    setup() {
        const toasts = Vue.inject('toasts');
        return { toasts };
    }
};

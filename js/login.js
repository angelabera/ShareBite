class ShareBiteLogin {
    constructor() {
        this.init();
    }

    init() {
        this.setupLoginForm();
        this.setupRememberMe();
    }

    setupLoginForm() {
        const loginForm = document.getElementById('loginForm');
        const emailInput = document.getElementById('loginEmail');
        const passwordInput = document.getElementById('loginPassword');

        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = emailInput.value.trim();
            const password = passwordInput.value.trim();

            if (!email || !password) {
                this.showError('Please fill in both fields.');
                return;
            }

            // Example authentication
            if (email === 'user@example.com' && password === 'password123') {
                this.showSuccess('Login successful! Redirecting...');
                setTimeout(() => {
                    window.location.href = '../dashboard/index.html';
                }, 1000);
            } else {
                this.showError('Invalid email or password.');
            }
        });
    }

    setupRememberMe() {
        const rememberCheckbox = document.getElementById('rememberMe');
        const emailInput = document.getElementById('loginEmail');

        const savedEmail = localStorage.getItem('sharebite-email');
        if (savedEmail) emailInput.value = savedEmail;

        rememberCheckbox.addEventListener('change', () => {
            if (rememberCheckbox.checked) {
                localStorage.setItem('sharebite-email', emailInput.value);
            } else {
                localStorage.removeItem('sharebite-email');
            }
        });
    }

    showError(message) {
        alert(message); // Simple alert, can replace with toast
    }

    showSuccess(message) {
        alert(message); // Simple alert, can replace with toast
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ShareBiteLogin();
});

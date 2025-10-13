async function checkAuth() {
    try {
        const res = await fetch('http://localhost:3000/api/current-user', {
            credentials: 'include'
        });

        if (res.ok) {
            const userData = await res.json();

            const roleDisplay = document.getElementById('currentRole');
            const roleSwitch = document.getElementById('roleSwitch');
            const loginBtn = document.querySelector('.login-btn');

            if (roleDisplay && roleSwitch) {
                roleDisplay.textContent = userData.role.charAt(0).toUpperCase() + userData.role.slice(1);

                roleSwitch.style.cursor = 'default';
                roleSwitch.style.opacity = '0.8';

                const newRoleSwitch = roleSwitch.cloneNode(true);
                roleSwitch.parentNode.replaceChild(newRoleSwitch, roleSwitch);

                newRoleSwitch.title = 'Role is set based on your account';
            }

            if (loginBtn) {
                loginBtn.textContent = 'Logout';
                loginBtn.onclick = async () => {
                    try {
                        await fetch('http://localhost:3000/logout', {
                            credentials: 'include'
                        });
                        sessionStorage.clear();
                        window.location.href = '/';
                    } catch (err) {
                        console.error('Logout error:', err);
                    }
                };
            }

            window.userRole = userData.role;

            return userData;
        } else {
            sessionStorage.clear();
            return null;
        }
    } catch (err) {
        console.error('Auth check error:', err);
        return null;
    }
}

document.addEventListener('DOMContentLoaded', checkAuth);

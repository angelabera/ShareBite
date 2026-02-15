/**
 * ShareBite shared core – theme, toast, storage, format, and DOM helpers.
 * Used by script.js (index) and foodlisting.js to avoid duplication.
 */
(function (global) {
    'use strict';

    var ShareBiteShared = global.ShareBiteShared || {};

    // ----- Format utilities -----
    function formatTime(timeString) {
        if (!timeString || typeof timeString !== 'string') return '';
        var trimmed = timeString.trim();
        var match = trimmed.match(/(\d+)\s*:\s*(\d+)\s*(am|pm)?/i);
        if (match) {
            var hour = parseInt(match[1], 10);
            var minute = parseInt(match[2], 10);
            var period = (match[3] || '').toLowerCase();
            if (period === 'pm' && hour !== 12) hour += 12;
            if (period === 'am' && hour === 12) hour = 0;
            var d = new Date();
            d.setHours(hour, minute, 0, 0);
            return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        var parts = trimmed.split(':');
        if (parts.length >= 2) {
            var h = parseInt(parts[0], 10);
            var m = parseInt(parts[1], 10);
            if (!isNaN(h) && !isNaN(m)) {
                var date = new Date();
                date.setHours(h, m, 0, 0);
                return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            }
        }
        return trimmed;
    }

    function getTimeAgo(date) {
        var now = new Date();
        var d = date instanceof Date ? date : new Date(date);
        var diff = now - d;
        var minutes = Math.floor(diff / 60000);
        var hours = Math.floor(minutes / 60);
        if (minutes < 60) return minutes + 'm ago';
        if (hours < 24) return hours + 'h ago';
        return Math.floor(hours / 24) + 'd ago';
    }

    function formatDateTime(dateTimeString) {
        var date = new Date(dateTimeString);
        var now = new Date();
        var diff = date - now;
        var hours = Math.floor(diff / (1000 * 60 * 60));
        if (hours < 24) return hours + 'h left';
        return Math.floor(hours / 24) + 'd left';
    }

    function getUrgencyStatus(freshUntil) {
        var now = new Date();
        var expiry = new Date(freshUntil);
        var diffMs = expiry - now;
        var hoursLeft = diffMs / (1000 * 60 * 60);
        if (hoursLeft > 6) return { label: '🟢 Fresh', className: 'fresh' };
        if (hoursLeft > 2) return { label: '🟡 Expiring Soon', className: 'expiring' };
        return { label: '🔴 Urgent', className: 'urgent' };
    }

    function getExpiryStatus(expiryDate) {
        var now = new Date();
        var expiry = new Date(expiryDate);
        var hoursRemaining = (expiry - now) / (1000 * 60 * 60);
        if (hoursRemaining < 0) return 'expired';
        if (hoursRemaining < 2) return 'expiring-soon';
        return 'active';
    }

    ShareBiteShared.format = {
        formatTime: formatTime,
        getTimeAgo: getTimeAgo,
        formatDateTime: formatDateTime,
        getUrgencyStatus: getUrgencyStatus,
        getExpiryStatus: getExpiryStatus
    };

    // ----- DOM / display helpers -----
    function getFoodIcon(category) {
        if (!category) return 'utensils';
        var icons = { restaurant: 'store', household: 'home', bakery: 'bread-slice', event: 'calendar-alt' };
        return icons[String(category).toLowerCase()] || 'utensils';
    }

    function capitalizeFirst(str) {
        if (!str) return '';
        return String(str).charAt(0).toUpperCase() + String(str).slice(1);
    }

    ShareBiteShared.helpers = {
        getFoodIcon: getFoodIcon,
        capitalizeFirst: capitalizeFirst
    };

    // ----- Storage (claimed items & notifications) -----
    function loadClaimedItems() {
        try {
            var stored = localStorage.getItem('sharebite-claimed-items');
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            return [];
        }
    }

    function saveClaimedItems(items) {
        try {
            localStorage.setItem('sharebite-claimed-items', JSON.stringify(items));
        } catch (e) {}
    }

    function loadNotifications() {
        try {
            var stored = localStorage.getItem('sharebite-notifications');
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            return [];
        }
    }

    function saveNotifications(notifications) {
        try {
            localStorage.setItem('sharebite-notifications', JSON.stringify(notifications));
        } catch (e) {}
    }

    ShareBiteShared.storage = {
        loadClaimedItems: loadClaimedItems,
        saveClaimedItems: saveClaimedItems,
        loadNotifications: loadNotifications,
        saveNotifications: saveNotifications
    };

    // ----- Toast -----
    function showToast(message, type) {
        type = type || 'success';
        var toast = document.createElement('div');
        toast.className = 'toast toast-' + type;
        toast.innerHTML = '<i class="fas fa-' + (type === 'success' ? 'check-circle' : 'exclamation-circle') + '"></i><span>' + String(message).replace(/</g, '&lt;') + '</span>';
        toast.style.cssText = [
            'position:fixed',
            'top:100px',
            'right:20px',
            'max-width:400px',
            'min-height:auto',
            'background:var(--primary-color)',
            'color:white',
            'padding:1rem 1.5rem',
            'border-radius:var(--border-radius, 8px)',
            'display:flex',
            'align-items:center',
            'gap:0.5rem',
            'z-index:3000',
            'box-shadow:0 4px 12px rgba(0,0,0,0.15)',
            'animation:slideInRight 0.3s ease'
        ].join(';');
        if (type === 'error') toast.style.background = 'var(--secondary-color, #c0392b)';
        document.body.appendChild(toast);
        setTimeout(function () {
            if (toast.parentNode) toast.parentNode.removeChild(toast);
        }, 3000);
    }

    ShareBiteShared.toast = { showToast: showToast };

    // ----- Theme (supports both #themeToggle and #theme-toggle) -----
    function getThemeToggleButton() {
        return document.getElementById('themeToggle') || document.getElementById('theme-toggle');
    }

    function applyTheme(theme) {
        var root = document.documentElement;
        var body = document.body;
        if (theme === 'dark') {
            root.classList.add('dark');
            if (body) body.classList.add('dark-mode');
        } else {
            root.classList.remove('dark');
            if (body) body.classList.remove('dark-mode');
        }
        var btn = getThemeToggleButton();
        if (btn) {
            var icon = btn.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-moon', 'fa-sun');
                icon.classList.add(theme === 'dark' ? 'fa-sun' : 'fa-moon');
            } else {
                btn.textContent = theme === 'dark' ? '☀️' : '🌙';
            }
        }
    }

    function initTheme() {
        var stored = localStorage.getItem('sharebite-theme');
        var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        var theme = stored || (prefersDark ? 'dark' : 'light');
        applyTheme(theme);
    }

    function setupThemeToggle() {
        var btn = getThemeToggleButton();
        if (!btn) return;
        btn.addEventListener('click', function () {
            var isDark = document.documentElement.classList.contains('dark');
            var newTheme = isDark ? 'light' : 'dark';
            applyTheme(newTheme);
            localStorage.setItem('sharebite-theme', newTheme);
        });
    }

    ShareBiteShared.theme = {
        initTheme: initTheme,
        applyTheme: applyTheme,
        setupThemeToggle: setupThemeToggle
    };

    global.ShareBiteShared = ShareBiteShared;
})(typeof window !== 'undefined' ? window : this);

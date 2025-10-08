// Support Page JavaScript

// FAQ Accordion functionality
document.addEventListener('DOMContentLoaded', function() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', () => {
            // Close other open items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });

            // Toggle current item
            item.classList.toggle('active');
        });
    });

    // Field name obfuscation mapping - security through obscurity
    const fieldMap = {
        'x7k9m': 'name',      // Name field
        'p3q8r': 'email',     // Email field
        'w5n2j': 'subject',   // Subject field
        'h4t6y': 'category',  // Category field
        'z9v4b': 'message',   // Message field
        'q2m7k': 'timestamp', // Timestamp field
        'f8d2n': 'honeypot'   // Honeypot field
    };

    // Initialize form timestamp for bot detection
    const formTimestamp = document.getElementById('q2m7k');
    if (formTimestamp) {
        formTimestamp.value = Date.now();
    }

    // Support Form Submission with Honeypot Security
    const supportForm = document.getElementById('supportForm');

    if (supportForm) {
        supportForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Honeypot check - if the hidden field is filled, it's likely a bot
            const honeypotField = document.getElementById('f8d2n');
            if (honeypotField && honeypotField.value !== '') {
                console.warn('Bot detected: honeypot field filled');
                // Silently reject - don't give feedback to bots
                return false;
            }

            // Time-based check - bots usually fill forms too quickly
            const timestamp = document.getElementById('q2m7k');
            const timeElapsed = Date.now() - parseInt(timestamp.value);
            const minTimeRequired = 3000; // 3 seconds minimum

            if (timeElapsed < minTimeRequired) {
                console.warn('Bot detected: form submitted too quickly');
                // Show error for suspiciously fast submission
                showErrorMessage('Please take your time filling out the form.');
                return false;
            }

            // Get form values using obfuscated field names
            const obfuscatedData = {
                x7k9m: document.getElementById('x7k9m').value,
                p3q8r: document.getElementById('p3q8r').value,
                w5n2j: document.getElementById('w5n2j').value,
                h4t6y: document.getElementById('h4t6y').value,
                z9v4b: document.getElementById('z9v4b').value,
                q2m7k: timestamp.value
            };

            // Decode to actual field names for processing
            const formData = {
                name: obfuscatedData.x7k9m,
                email: obfuscatedData.p3q8r,
                subject: obfuscatedData.w5n2j,
                category: obfuscatedData.h4t6y,
                message: obfuscatedData.z9v4b,
                timestamp: obfuscatedData.q2m7k
            };

            // Validate email format
            if (!isValidEmail(formData.email)) {
                showErrorMessage('Please enter a valid email address.');
                return false;
            }

            // Here you would typically send the obfuscated data to a server
            // The server would use the same fieldMap to decode the values
            console.log('Support form submitted (obfuscated):', obfuscatedData);
            console.log('Support form submitted (decoded):', formData);

            // Show success message
            showSuccessMessage();

            // Reset form and timestamp
            supportForm.reset();
            timestamp.value = Date.now();
        });
    }

    // Chat Button
    const chatBtn = document.querySelector('.chat-btn');

    if (chatBtn) {
        chatBtn.addEventListener('click', function() {
            alert('Chat feature coming soon! Please use email or phone support in the meantime.');
        });
    }

    // Smooth scroll for internal links
    const helpLinks = document.querySelectorAll('.help-link');

    helpLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            if (href && href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);

                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // Hamburger menu functionality (mobile)
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    // Role switch functionality
    const roleSwitch = document.getElementById('roleSwitch');
    const currentRole = document.getElementById('currentRole');

    if (roleSwitch && currentRole) {
        roleSwitch.addEventListener('click', () => {
            if (currentRole.textContent === 'Donor') {
                currentRole.textContent = 'Recipient';
            } else {
                currentRole.textContent = 'Donor';
            }
        });
    }
});

// Email validation function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Success message function
function showSuccessMessage() {
    // Create success message element
    const message = document.createElement('div');
    message.className = 'success-message';
    message.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>Message sent successfully! We'll get back to you soon.</span>
    `;

    // Style the message
    message.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #4CAF50 0%, #81C784 100%);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 5px 25px rgba(0, 0, 0, 0.15);
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-weight: 600;
        z-index: 10000;
        animation: slideInRight 0.4s ease;
    `;

    // Add to document
    document.body.appendChild(message);

    // Remove after 4 seconds
    setTimeout(() => {
        message.style.animation = 'fadeOut 0.4s ease';
        setTimeout(() => {
            document.body.removeChild(message);
        }, 400);
    }, 4000);
}

// Error message function
function showErrorMessage(text) {
    // Create error message element
    const message = document.createElement('div');
    message.className = 'error-message';
    message.innerHTML = `
        <i class="fas fa-exclamation-circle"></i>
        <span>${text}</span>
    `;

    // Style the message
    message.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #FF6B35 0%, #E65100 100%);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 5px 25px rgba(0, 0, 0, 0.15);
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-weight: 600;
        z-index: 10000;
        animation: slideInRight 0.4s ease;
    `;

    // Add to document
    document.body.appendChild(message);

    // Remove after 4 seconds
    setTimeout(() => {
        message.style.animation = 'fadeOut 0.4s ease';
        setTimeout(() => {
            document.body.removeChild(message);
        }, 400);
    }, 4000);
}

// Add animation keyframes for messages
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes fadeOut {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(400px);
        }
    }
`;
document.head.appendChild(style);

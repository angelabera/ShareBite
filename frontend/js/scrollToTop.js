/**
 * Scroll To Top Button Component
 * Provides a reusable scroll-to-top functionality for all pages
 */

class ScrollToTop {
    constructor() {
        this.init();
    }

    init() {
        // Create the scroll to top button if it doesn't exist
        this.createButton();
        
        // Add event listeners
        this.addEventListeners();
        
        // Check scroll position on load
        this.checkScrollPosition();
    }

    createButton() {
        // Check if button already exists
        if (document.getElementById('scrollToTopBtn')) {
            this.button = document.getElementById('scrollToTopBtn');
            return;
        }

        // Create wrapper if it doesn't exist
        let wrapper = document.getElementById('scrollTopWrapper');
        if (!wrapper) {
            wrapper = document.createElement('div');
            wrapper.id = 'scrollTopWrapper';
            document.body.appendChild(wrapper);
        }

        // Create button
        this.button = document.createElement('button');
        this.button.id = 'scrollToTopBtn';
        this.button.title = 'Go to top';
        this.button.innerHTML = '<i class="fas fa-arrow-up"></i>';
        
        // Add to wrapper
        wrapper.appendChild(this.button);
    }

    addEventListeners() {
        // Scroll event to show/hide button
        window.addEventListener('scroll', () => {
            this.checkScrollPosition();
        });

        // Click event to scroll to top
        this.button.addEventListener('click', () => {
            this.scrollToTop();
        });
    }

    checkScrollPosition() {
        const scrollPosition = document.documentElement.scrollTop || document.body.scrollTop;
        if (scrollPosition > 200) {
            this.button.classList.add('show');
        } else {
            this.button.classList.remove('show');
        }
    }

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ScrollToTop();
});

// Export for potential use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ScrollToTop;
}
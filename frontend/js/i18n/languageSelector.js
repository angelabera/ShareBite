// Language Selector UI Component
import { i18n } from './i18n.js';
import { SUPPORTED_LANGUAGES } from './config.js';

class LanguageSelector {
    constructor() {
        this.selector = null;
        this.button = null;
        this.dropdown = null;
        this.isOpen = false;
        this.init();
    }

    // Initialize the language selector
    init() {
        // Wait for i18n to be ready
        if (!i18n.isLoaded) {
            i18n.addObserver(() => this.init());
            return;
        }

        // Clean up any existing instance
        this.cleanup();

        this.selector = document.getElementById('languageSelector');
        if (!this.selector) {
            console.warn('Language selector element not found');
            return;
        }

        this.button = this.selector.querySelector('.language-selector-button');
        this.dropdown = this.selector.querySelector('.language-selector-dropdown');

        this.setupDropdown();
        this.attachEventListeners();
        this.updateUI();
    }

    // Cleanup method to prevent memory leaks
    cleanup() {
        if (this.button) {
            this.button.removeEventListener('click', this.handleButtonClick);
        }
        if (this.dropdown) {
            this.dropdown.removeEventListener('click', this.handleDropdownClick);
        }
        document.removeEventListener('click', this.handleDocumentClick);
        
        // Reset state
        this.isOpen = false;
        this.isToggling = false;
        this.isSelecting = false;
    }

    // Setup dropdown with language options
    setupDropdown() {
        if (!this.dropdown) return;

        // Clear existing options
        this.dropdown.innerHTML = '';

        // Add language options
        Object.entries(SUPPORTED_LANGUAGES).forEach(([code, config]) => {
            const option = document.createElement('button');
            option.className = 'language-option';
            option.setAttribute('data-lang', code);
            option.setAttribute('type', 'button');
            option.setAttribute('aria-label', `Switch to ${config.name}`);

            if (code === i18n.getCurrentLanguage()) {
                option.classList.add('active');
            }

            option.innerHTML = `
                <span class="language-flag">${config.flag}</span>
                <span class="language-name">${config.nativeName}</span>
                <span class="language-english">${config.name}</span>
                <span class="language-check">${code === i18n.getCurrentLanguage() ? '✓' : ''}</span>
            `;

            this.dropdown.appendChild(option);
        });
    }

    // Attach event listeners
    attachEventListeners() {
        if (!this.button || !this.dropdown) return;

        // Remove any existing listeners to prevent duplicates
        this.button.removeEventListener('click', this.handleButtonClick);
        document.removeEventListener('click', this.handleDocumentClick);
        this.dropdown.removeEventListener('click', this.handleDropdownClick);

        // Bind methods to maintain context
        this.handleButtonClick = this.handleButtonClick.bind(this);
        this.handleDocumentClick = this.handleDocumentClick.bind(this);
        this.handleDropdownClick = this.handleDropdownClick.bind(this);

        // Toggle dropdown
        this.button.addEventListener('click', this.handleButtonClick);

        // Handle language selection
        this.dropdown.addEventListener('click', this.handleDropdownClick);

        // Close on outside click
        document.addEventListener('click', this.handleDocumentClick);

        // Keyboard navigation
        this.button.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.toggle();
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                this.open();
                this.focusFirstOption();
            }
        });

        this.dropdown.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.close();
                this.button.focus();
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                this.focusNextOption();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                this.focusPreviousOption();
            }
        });

        // Handle i18n language changes
        i18n.addObserver(() => this.updateUI());
    }

    // Handle button click
    handleButtonClick(e) {
        e.preventDefault();
        e.stopPropagation();
        this.toggle();
    }

    // Handle document click (for closing dropdown)
    handleDocumentClick(e) {
        if (this.isOpen && !this.selector.contains(e.target)) {
            this.close();
        }
    }

    // Handle dropdown click (for language selection)
    handleDropdownClick(e) {
        const option = e.target.closest('.language-option');
        if (option) {
            const lang = option.getAttribute('data-lang');
            this.selectLanguage(lang);
        }
    }

    // Toggle dropdown
    toggle() {
        // Prevent rapid toggling
        if (this.isToggling) return;
        this.isToggling = true;

        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }

        // Reset toggle flag after animation
        setTimeout(() => {
            this.isToggling = false;
        }, 200);
    }

    // Open dropdown
    open() {
        if (this.isOpen) return;
        
        this.isOpen = true;
        this.selector.classList.add('open');
        this.button.setAttribute('aria-expanded', 'true');
        
        // Ensure dropdown is visible
        this.dropdown.style.display = 'block';
        setTimeout(() => {
            this.dropdown.style.opacity = '1';
            this.dropdown.style.visibility = 'visible';
            this.dropdown.style.transform = 'translateY(0)';
        }, 10);
    }

    // Close dropdown
    close() {
        if (!this.isOpen) return;
        
        this.isOpen = false;
        this.selector.classList.remove('open');
        this.button.setAttribute('aria-expanded', 'false');
        
        // Hide dropdown with animation
        this.dropdown.style.opacity = '0';
        this.dropdown.style.visibility = 'hidden';
        this.dropdown.style.transform = 'translateY(-10px)';
        setTimeout(() => {
            this.dropdown.style.display = 'none';
        }, 200);
    }

    // Select a language
    async selectLanguage(language) {
        // Close dropdown immediately when any language is clicked
        this.close();

        if (language === i18n.getCurrentLanguage()) {
            return;
        }

        // Prevent multiple simultaneous selections
        if (this.isSelecting) {
            return;
        }
        
        this.isSelecting = true;
        
        try {
            const success = await i18n.setLanguage(language);
            
            if (success) {
                // Update UI after a small delay to ensure smooth transition
                setTimeout(() => {
                    this.updateUI();
                }, 100);
            }
        } catch (error) {
            console.error('Error selecting language:', error);
        } finally {
            // Always reset the selecting flag
            this.isSelecting = false;
        }
    }

    // Update UI to reflect current language
    updateUI() {
        if (!this.button || !this.dropdown) return;

        const currentLang = i18n.getCurrentLanguage();
        const langConfig = SUPPORTED_LANGUAGES[currentLang];

        // Update button
        const flag = this.button.querySelector('.language-flag');
        const name = this.button.querySelector('.language-name');
        
        if (flag) flag.textContent = langConfig.flag;
        if (name) name.textContent = langConfig.nativeName;

        // Update dropdown options
        const options = this.dropdown.querySelectorAll('.language-option');
        options.forEach(option => {
            const lang = option.getAttribute('data-lang');
            const check = option.querySelector('.language-check');
            
            if (lang === currentLang) {
                option.classList.add('active');
                if (check) check.textContent = '✓';
            } else {
                option.classList.remove('active');
                if (check) check.textContent = '';
            }
        });
    }

    // Focus first option
    focusFirstOption() {
        const firstOption = this.dropdown.querySelector('.language-option');
        if (firstOption) firstOption.focus();
    }

    // Focus next option
    focusNextOption() {
        const options = Array.from(this.dropdown.querySelectorAll('.language-option'));
        const currentIndex = options.findIndex(option => option === document.activeElement);
        const nextIndex = (currentIndex + 1) % options.length;
        options[nextIndex].focus();
    }

    // Focus previous option
    focusPreviousOption() {
        const options = Array.from(this.dropdown.querySelectorAll('.language-option'));
        const currentIndex = options.findIndex(option => option === document.activeElement);
        const prevIndex = currentIndex === 0 ? options.length - 1 : currentIndex - 1;
        options[prevIndex].focus();
    }
}

// Create and initialize language selector
new LanguageSelector();

// Main i18n system for ShareBite
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE, LANGUAGE_STORAGE_KEY } from './config.js';

class I18n {
    constructor() {
        this.currentLanguage = DEFAULT_LANGUAGE;
        this.translations = {};
        this.isLoaded = false;
        this.observers = [];
    }

    // Initialize the i18n system
    async init() {
        // Detect language from localStorage or browser
        const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
        const browserLanguage = this.detectBrowserLanguage();
        this.currentLanguage = savedLanguage || browserLanguage || DEFAULT_LANGUAGE;
        
        // Load translations
        await this.loadTranslations(this.currentLanguage);
        
        // Apply translations to DOM
        this.applyTranslations();
        
        // Set document language and direction
        this.updateDocumentLanguage();
        
        this.isLoaded = true;
        this.notifyObservers();
    }

    // Detect browser language
    detectBrowserLanguage() {
        const browserLang = navigator.language || navigator.userLanguage;
        const langCode = browserLang.split('-')[0]; // Get primary language code
        
        // Check if supported
        if (SUPPORTED_LANGUAGES[langCode]) {
            return langCode;
        }
        
        return DEFAULT_LANGUAGE;
    }

    // Load translations for a specific language
    async loadTranslations(language) {
        try {
            console.log('📦 Loading translations for language:', language);
            
            // Dynamic import of translation file
            const module = await import(`./translations/${language}.js`);
            this.translations = module.default;
            
            console.log('✅ Successfully loaded translations for:', language);
            console.log('📋 Available translation keys:', Object.keys(this.translations).length);
            
        } catch (error) {
            console.warn(`❌ Failed to load translations for ${language}, falling back to English`);
            console.error('Error details:', error);
            
            // Fallback to English
            try {
                const module = await import('./translations/en.js');
                this.translations = module.default;
                this.currentLanguage = 'en';
                console.log('🔄 Fallback to English completed');
            } catch (fallbackError) {
                console.error('❌ Critical error: Could not load fallback translations');
                this.translations = {};
                this.currentLanguage = 'en';
            }
        }
    }

    // Change language
    async setLanguage(language) {
        if (!SUPPORTED_LANGUAGES[language]) {
            console.warn(`Language ${language} is not supported`);
            return false;
        }

        if (language === this.currentLanguage) {
            return true; // Already set
        }

        // Show loading state
        const selector = document.getElementById('languageSelector');
        if (selector) {
            selector.classList.add('loading');
        }

        try {
            // Load new translations
            await this.loadTranslations(language);
            this.currentLanguage = language;
            
            // Save to localStorage
            localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
            
            // Apply translations
            this.applyTranslations();
            
            // Update document language
            this.updateDocumentLanguage();
            
            // Update language selector UI
            this.updateLanguageSelector();
            
            // Notify observers
            this.notifyObservers();
            
            return true;
        } catch (error) {
            console.error('Failed to change language:', error);
            return false;
        } finally {
            // Hide loading state
            if (selector) {
                selector.classList.remove('loading');
            }
        }
    }

    // Get translation for a key
    translate(key, params = {}) {
        const translation = this.translations[key];
        
        if (!translation) {
            // Return key if translation not found
            console.warn(`Translation not found for key: ${key}`);
            return key;
        }
        
        // Handle parameter interpolation
        return this.interpolate(translation, params);
    }

    // Interpolate parameters into translation string
    interpolate(str, params) {
        return str.replace(/\{\{(\w+)\}\}/g, (match, key) => {
            return params[key] !== undefined ? params[key] : match;
        });
    }

    // Apply translations to DOM elements
    applyTranslations() {
        console.log('🌍 Applying translations for language:', this.currentLanguage);
        
        // Count elements to translate
        const elementsToTranslate = document.querySelectorAll('[data-i18n]');
        console.log('📝 Found elements to translate:', elementsToTranslate.length);
        
        // Translate elements with data-i18n attribute
        elementsToTranslate.forEach((element, index) => {
            const key = element.getAttribute('data-i18n');
            const translation = this.translate(key);
            
            console.log(`🔤 Translating element ${index + 1}: ${key} -> "${translation}"`);
            
            // Handle different element types
            if (element.tagName === 'INPUT' && element.type === 'text') {
                element.placeholder = translation;
            } else if (element.tagName === 'INPUT' && element.type === 'submit') {
                element.value = translation;
            } else if (element.tagName === 'INPUT' && element.type === 'button') {
                element.value = translation;
            } else if (element.tagName === 'BUTTON') {
                // For buttons, only update text content, preserve HTML structure
                if (element.children.length === 0) {
                    element.textContent = translation;
                } else {
                    // Find text nodes and update them
                    this.updateTextNodes(element, translation);
                }
            } else if (element.tagName === 'SPAN' || element.tagName === 'P' || element.tagName === 'H1' || element.tagName === 'H2' || element.tagName === 'H3' || element.tagName === 'H4' || element.tagName === 'H5' || element.tagName === 'H6') {
                // For text elements, preserve HTML structure but update text
                if (element.children.length === 0) {
                    element.textContent = translation;
                } else {
                    this.updateTextNodes(element, translation);
                }
            } else {
                // For other elements, update text content
                element.textContent = translation;
            }
        });

        console.log('✅ Translation application completed');

        // Translate elements with data-i18n-placeholder attribute
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            element.placeholder = this.translate(key);
        });

        // Translate elements with data-i18n-alt attribute
        document.querySelectorAll('[data-i18n-alt]').forEach(element => {
            const key = element.getAttribute('data-i18n-alt');
            element.alt = this.translate(key);
        });

        // Translate elements with data-i18n-title attribute
        document.querySelectorAll('[data-i18n-title]').forEach(element => {
            const key = element.getAttribute('data-i18n-title');
            element.title = this.translate(key);
        });
    }

    // Helper method to update text nodes while preserving HTML structure
    updateTextNodes(element, newText) {
        // If element has only one text node, update it
        const textNodes = [];
        const walker = document.createTreeWalker(
            element,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );
        
        let node;
        while (node = walker.nextNode()) {
            if (node.textContent.trim()) {
                textNodes.push(node);
            }
        }
        
        // Update the first non-empty text node
        if (textNodes.length > 0) {
            textNodes[0].textContent = newText;
        } else {
            // If no text nodes found, add text at the beginning
            element.insertBefore(document.createTextNode(newText), element.firstChild);
        }
    }

    // Update document language and direction
    updateDocumentLanguage() {
        const langConfig = SUPPORTED_LANGUAGES[this.currentLanguage];
        document.documentElement.lang = this.currentLanguage;
        document.documentElement.dir = langConfig.direction;
        
        // Add language class to body for styling
        document.body.className = document.body.className.replace(/lang-\w+/g, '');
        document.body.classList.add(`lang-${this.currentLanguage}`);
    }

    // Update language selector UI
    updateLanguageSelector() {
        const selector = document.getElementById('languageSelector');
        if (!selector) return;

        const button = selector.querySelector('.language-selector-button');
        const flag = selector.querySelector('.language-flag');
        const name = selector.querySelector('.language-name');

        const langConfig = SUPPORTED_LANGUAGES[this.currentLanguage];
        
        if (flag) flag.textContent = langConfig.flag;
        if (name) name.textContent = langConfig.nativeName;
    }

    // Get current language
    getCurrentLanguage() {
        return this.currentLanguage;
    }

    // Get supported languages
    getSupportedLanguages() {
        return SUPPORTED_LANGUAGES;
    }

    // Add observer for language changes
    addObserver(callback) {
        this.observers.push(callback);
    }

    // Remove observer
    removeObserver(callback) {
        this.observers = this.observers.filter(obs => obs !== callback);
    }

    // Notify all observers
    notifyObservers() {
        this.observers.forEach(callback => callback(this.currentLanguage));
    }

    // Format number according to locale
    formatNumber(number, options = {}) {
        try {
            return new Intl.NumberFormat(this.currentLanguage, options).format(number);
        } catch (error) {
            return number.toString();
        }
    }

    // Format date according to locale
    formatDate(date, options = {}) {
        try {
            return new Intl.DateTimeFormat(this.currentLanguage, options).format(date);
        } catch (error) {
            return date.toString();
        }
    }

    // Format currency according to locale
    formatCurrency(amount, currency = 'INR', options = {}) {
        try {
            return new Intl.NumberFormat(this.currentLanguage, {
                style: 'currency',
                currency: currency,
                ...options
            }).format(amount);
        } catch (error) {
            return `${currency} ${amount}`;
        }
    }
}

// Create and export singleton instance
export const i18n = new I18n();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => i18n.init());
} else {
    i18n.init();
}

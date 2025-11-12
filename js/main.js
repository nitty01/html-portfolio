// Enhanced JavaScript for Portfolio Landing Page
document.addEventListener('DOMContentLoaded', function() {
    // Theme Management (existing functionality)
    initTheme();

    // Mobile Navigation
    initMobileNav();

    // Scroll Effects
    initScrollEffects();

    // A/B Testing for Hero Headline
    initABTesting();

    // Role Rotator (respects reduced motion)
    initRoleRotator();

    // Scroll Hint
    initScrollHint();

    // CTA Analytics
    initCTAAnalytics();

    // Projects Modal Enhancement
    enhanceProjectModal();

    // Accessibility Enhancements
    enhanceAccessibility();
});

// Theme Management
function initTheme() {
    let currentTheme = localStorage.getItem('theme') || 'dark';

    const themeConfig = {
        light: { bodyClass: 'light', icon: 'fas fa-moon', nextTheme: 'dark' },
        dark: { bodyClass: 'dark', icon: 'fas fa-sun', nextTheme: 'light' }
    };

    function applyTheme(theme) {
        if (!themeConfig[theme]) return;

        const body = document.body;
        const btn = document.getElementById('globalThemeToggle');

        Object.values(themeConfig).forEach(config => {
            body.classList.remove(config.bodyClass);
        });

        body.classList.add(themeConfig[theme].bodyClass);
        window.currentTheme = theme;

        if (btn) {
            btn.innerHTML = `<i class="${themeConfig[theme].icon}"></i>`;
        }

        localStorage.setItem('theme', theme);
    }

    function toggleTheme() {
        const newTheme = themeConfig[currentTheme].nextTheme;
        applyTheme(newTheme);
    }

    const themeBtn = document.getElementById('globalThemeToggle');
    if (themeBtn) {
        themeBtn.addEventListener('click', toggleTheme);
    }

    applyTheme(currentTheme);
    window.themeManager = { applyTheme, toggleTheme, getCurrentTheme: () => currentTheme };
}

// Mobile Navigation
function initMobileNav() {
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('nav-links');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            const expanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', String(!expanded));
            navLinks.classList.toggle('open');
        });
    }
}

// Scroll Effects
function initScrollEffects() {
    const nav = document.querySelector('.site-nav');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            nav?.classList.add('is-scrolled');
        } else {
            nav?.classList.remove('is-scrolled');
        }
    });

    // Scroll to top functionality
    const scrollToTopBtn = document.getElementById('scroll-to-top');
    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

// A/B Testing for Hero Headline
function initABTesting() {
    const abKey = 'heroVariant';
    let variant = localStorage.getItem(abKey);

    if (!variant) {
        variant = (Math.random() < 0.5) ? 'A' : 'B';
        localStorage.setItem(abKey, variant);
    }

    const heroHeadline = document.getElementById('hero-headline');
    if (heroHeadline) {
        if (variant === 'A') {
            heroHeadline.textContent = 'Principal Data Engineer — Turning raw data into real-world intelligence';
        } else {
            heroHeadline.textContent = 'I build scalable data platforms that power AI-driven decisions';
        }

        // Log variant for analytics
        if (window.gtag) {
            gtag('event', 'hero_variant_shown', {
                event_category: 'ab_testing',
                label: variant
            });
        }

        console.log(`A/B Test: Showing variant ${variant}`);
    }
}

// Role Rotator (respects reduced motion)
function initRoleRotator() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return; // Skip animation if user prefers reduced motion
    }

    const roles = ['Data Engineer', 'Cloud Architect', 'Principal Engineer'];
    let idx = 0;

    const roleElement = document.createElement('div');
    roleElement.className = 'role-rotator';
    roleElement.setAttribute('aria-live', 'polite');

    const heroCopy = document.querySelector('.hero-copy');
    if (heroCopy) {
        heroCopy.appendChild(roleElement);

        const interval = setInterval(() => {
            roleElement.textContent = roles[idx];
            idx = (idx + 1) % roles.length;
        }, 3000);

        // Store interval for cleanup if needed
        window.roleRotatorInterval = interval;
    }
}

// Scroll Hint
function initScrollHint() {
    const scrollHint = document.getElementById('scroll-hint');
    if (scrollHint) {
        scrollHint.addEventListener('click', () => {
            document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' });
        });

        // Hide hint after scrolling
        let hintVisible = true;
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100 && hintVisible) {
                scrollHint.style.opacity = '0';
                hintVisible = false;
            }
        });
    }
}

// CTA Analytics
function initCTAAnalytics() {
    document.querySelectorAll('[data-gtm]').forEach(btn => {
        btn.addEventListener('click', () => {
            const eventData = {
                event_category: 'engagement',
                label: btn.dataset.gtm
            };

            if (window.gtag) {
                gtag('event', 'cta_click', eventData);
            }

            console.log('CTA Click:', eventData);
        });
    });
}

// Enhanced Project Modal
function enhanceProjectModal() {
    // Keep existing modal functionality but enhance it
    const modal = document.getElementById('project-modal');
    const closeModal = document.getElementById('close-modal');
    const modalContent = document.getElementById('modal-content');

    // Enhanced close functionality
    function closeProjectModal() {
        modal?.classList.add('hidden');
        document.body.style.overflow = 'auto';

        // Focus management for accessibility
        const triggerElement = document.querySelector('[data-project][onclick*="openProjectModal"]:focus');
        if (triggerElement) {
            triggerElement.focus();
        }
    }

    if (closeModal) {
        closeModal.addEventListener('click', closeProjectModal);
    }

    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeProjectModal();
            }
        });
    }

    // Enhanced keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
            closeProjectModal();
        }
    });

    // Improve focus management
    const originalOpenModal = window.openProjectModal;
    if (originalOpenModal) {
        window.openProjectModal = function(projectId) {
            originalOpenModal(projectId);
            // Focus the close button when modal opens
            setTimeout(() => {
                closeModal?.focus();
            }, 100);
        };
    }
}

// Accessibility Enhancements
function enhanceAccessibility() {
    // Add focus-visible polyfill behavior
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-nav');
        }
    });

    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-nav');
    });

    // Ensure all interactive elements are focusable
    document.querySelectorAll('button, a, [tabindex]').forEach(el => {
        if (!el.hasAttribute('tabindex') && el.tagName !== 'A' && el.tagName !== 'BUTTON') {
            // Skip elements that shouldn't be focusable
            return;
        }

        // Add visual focus indicators for keyboard users
        el.addEventListener('focus', function() {
            if (document.body.classList.contains('keyboard-nav')) {
                this.classList.add('focus-visible');
            }
        });

        el.addEventListener('blur', function() {
            this.classList.remove('focus-visible');
        });
    });

    // Announce dynamic content changes
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    announcer.style.position = 'absolute';
    announcer.style.left = '-10000px';
    announcer.style.width = '1px';
    announcer.style.height = '1px';
    announcer.style.overflow = 'hidden';
    document.body.appendChild(announcer);

    window.announceToScreenReader = function(message) {
        announcer.textContent = message;
    };
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Export for potential use by other scripts
window.PortfolioApp = {
    initTheme,
    initMobileNav,
    initScrollEffects,
    initABTesting,
    initRoleRotator,
    initScrollHint,
    initCTAAnalytics,
    enhanceProjectModal,
    enhanceAccessibility,
    debounce
};

/**
 * 3Dream Studios — Main Application Logic
 * ==========================================
 * Handles:
 * - Intersection Observer animations (fade-up with stagger)
 * - Hero parallax (scroll + mouse)
 * - Mobile menu toggle
 * - Active nav highlight
 * - Counter animations
 * - FAQ accordion
 * - Scroll progress bar
 * - Form validation
 * - Performance optimizations (throttle/debounce)
 * 
 * @version 2.0.0
 * @author 3Dream Studios
 */

document.addEventListener("DOMContentLoaded", () => {
    'use strict';

    // =========================================================================
    // UTILITY: Throttle function for scroll/resize performance
    // =========================================================================

    function throttle(fn, delay) {
        let last = 0;
        return function (...args) {
            const now = Date.now();
            if (now - last >= delay) {
                last = now;
                fn.apply(this, args);
            }
        };
    }

    // =========================================================================
    // 1. Fade-Up Intersection Observer (with stagger support)
    // =========================================================================

    const observerOptions = {
        root: null,
        rootMargin: "0px 0px -50px 0px",
        threshold: 0.05
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-up-element');
    fadeElements.forEach(el => observer.observe(el));

    // =========================================================================
    // 2. Model Viewer (lazy load only when needed)
    // =========================================================================

    if (document.querySelector('model-viewer') || document.querySelector('[data-model-viewer]')) {
        const script = document.createElement('script');
        script.type = 'module';
        script.src = 'https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js';
        document.head.appendChild(script);
    }

    // =========================================================================
    // 3. Hero Parallax Animation (scroll + mouse)
    // =========================================================================

    const heroSection = document.getElementById('hero-section');
    const auras = document.querySelectorAll('.parallax-aura');

    if (heroSection) {
        let scrollY = window.scrollY;
        let ticking = false;

        function updateHero() {
            const heroHeight = heroSection.offsetHeight;
            const progress = Math.min(scrollY / heroHeight, 1);
            heroSection.style.setProperty('--hero-scroll', progress.toFixed(3));
            ticking = false;
        }

        window.addEventListener('scroll', () => {
            scrollY = window.scrollY;
            if (!ticking) {
                window.requestAnimationFrame(updateHero);
                ticking = true;
            }
        }, { passive: true });

        // Mouse parallax (desktop only — save mobile resources)
        if (window.matchMedia('(hover: hover)').matches) {
            document.addEventListener('mousemove', throttle((e) => {
                const x = (e.clientX / window.innerWidth - 0.5) * 50;
                const y = (e.clientY / window.innerHeight - 0.5) * 50;

                auras.forEach(aura => {
                    const speed = parseFloat(aura.getAttribute('data-speed')) || 1;
                    aura.style.setProperty('--mouse-x', `${x * speed}px`);
                    aura.style.setProperty('--mouse-y', `${y * speed}px`);
                });
            }, 16)); // ~60fps
        }
    }

    // =========================================================================
    // 4. Mobile Menu Toggle (Accessible)
    // =========================================================================

    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            const icon = mobileMenuBtn.querySelector('span');
            const isOpen = !mobileMenu.classList.contains('hidden');

            if (!isOpen) {
                mobileMenu.classList.remove('hidden');
                setTimeout(() => {
                    mobileMenu.classList.remove('opacity-0', 'translate-y-[-20px]');
                    mobileMenu.classList.add('opacity-100', 'translate-y-0');
                }, 10);
                icon.textContent = 'close';
                mobileMenuBtn.setAttribute('aria-expanded', 'true');
                document.body.style.overflow = 'hidden';
            } else {
                mobileMenu.classList.remove('opacity-100', 'translate-y-0');
                mobileMenu.classList.add('opacity-0', 'translate-y-[-20px]');
                setTimeout(() => mobileMenu.classList.add('hidden'), 500);
                icon.textContent = 'menu';
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
                mobileMenuBtn.click();
            }
        });

        // Close when clicking a link inside mobile menu
        mobileMenu.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                mobileMenuBtn.click();
            }
        });
    }

    // =========================================================================
    // 5. Scroll Progress Bar
    // =========================================================================

    const scrollProgress = document.getElementById('scroll-progress');

    if (scrollProgress) {
        window.addEventListener('scroll', throttle(() => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            scrollProgress.style.width = `${progress}%`;
        }, 16), { passive: true });
    }

    // =========================================================================
    // 6. Counter Animation (Intersection-triggered)
    // =========================================================================

    const counterElements = document.querySelectorAll('[data-counter]');
    
    if (counterElements.length > 0) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        counterElements.forEach(el => counterObserver.observe(el));
    }

    function animateCounter(el) {
        const target = parseInt(el.getAttribute('data-counter'), 10);
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = 2000;
        const start = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            // Ease-out quad
            const eased = 1 - (1 - progress) * (1 - progress);
            const current = Math.floor(eased * target);
            
            el.textContent = current + suffix;
            
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = target + suffix;
            }
        }

        requestAnimationFrame(update);
    }

    // =========================================================================
    // 7. FAQ Accordion
    // =========================================================================

    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const header = item.querySelector('.faq-header');
        if (!header) return;

        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all others
            faqItems.forEach(other => other.classList.remove('active'));
            
            // Toggle current
            if (!isActive) {
                item.classList.add('active');
            }
        });

        // Keyboard accessibility
        header.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                header.click();
            }
        });
    });

    // =========================================================================
    // 8. Form Validation (Real-time visual feedback)
    // =========================================================================

    const connectForm = document.getElementById('connectForm');

    if (connectForm) {
        const fields = connectForm.querySelectorAll('input, select, textarea');

        fields.forEach(field => {
            field.addEventListener('blur', () => validateField(field));
            field.addEventListener('input', () => {
                if (field.closest('.form-field-wrapper')?.classList.contains('invalid')) {
                    validateField(field);
                }
            });
        });

        // Auto-resize textarea
        const textarea = connectForm.querySelector('textarea');
        if (textarea) {
            textarea.addEventListener('input', () => {
                textarea.style.height = 'auto';
                textarea.style.height = textarea.scrollHeight + 'px';
            });
        }

        connectForm.addEventListener('submit', (e) => {
            e.preventDefault();
        });
    }

    function validateField(field) {
        const wrapper = field.closest('.form-field-wrapper');
        if (!wrapper) return;

        wrapper.classList.remove('valid', 'invalid');

        if (field.value.trim() === '') return;

        if (field.checkValidity()) {
            wrapper.classList.add('valid');
        } else {
            wrapper.classList.add('invalid');
        }
    }

    // =========================================================================
    // 9. Service Card Mouse Tracking
    // =========================================================================

    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            card.style.setProperty('--mouse-x', x + '%');
            card.style.setProperty('--mouse-y', y + '%');
        });
    });

    // =========================================================================
    // 10. Smooth Scroll for Anchor Links
    // =========================================================================

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // =========================================================================
    // 11. Nav Shrink on Scroll
    // =========================================================================

    const nav = document.querySelector('nav');
    if (nav) {
        window.addEventListener('scroll', throttle(() => {
            if (window.scrollY > 100) {
                nav.classList.add('py-2');
                nav.classList.remove('py-4');
            } else {
                nav.classList.remove('py-2');
                nav.classList.add('py-4');
            }
        }, 100), { passive: true });
    }

});

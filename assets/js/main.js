document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Fade-Up Intersections
    const observerOptions = {
        root: null,
        rootMargin: "0px",
        threshold: 0.05
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // 3D Model Viewer Component
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js';
    document.head.appendChild(script);

    const fadeElements = document.querySelectorAll('.fade-up-element');
    fadeElements.forEach(el => observer.observe(el));

    // 2. High-Performance Hero Animations (Scroll + Mouse)
    const heroSection = document.getElementById('hero-section');
    const auras = document.querySelectorAll('.parallax-aura');
    
    if (heroSection) {
        let scrollY = window.scrollY;
        let ticking = false;

        function updateHero() {
            const heroHeight = heroSection.offsetHeight;
            const progress = Math.min(scrollY / heroHeight, 1);
            
            // Efficiently update CSS variable for the entire section
            heroSection.style.setProperty('--hero-scroll', progress.toFixed(3));
            ticking = false;
        }

        window.addEventListener('scroll', () => {
            scrollY = window.scrollY;
            if (!ticking) {
                window.requestAnimationFrame(updateHero);
                ticking = true;
            }
        });

        // Combined Mouse Parallax for Auras
        document.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 50;
            const y = (e.clientY / window.innerHeight - 0.5) * 50;
            
            auras.forEach(aura => {
                const speed = parseFloat(aura.getAttribute('data-speed')) || 1;
                // We update only the element's specific offset variable
                aura.style.setProperty('--mouse-x', `${x * speed}px`);
                aura.style.setProperty('--mouse-y', `${y * speed}px`);
            });
        });
    }

    // 3. Highlight Active Navigation Link based on current page
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath) {
            link.classList.add('border-b-2', 'border-cyan-400', 'text-cyan-400');
            link.classList.remove('text-neutral-400');
        } else {
            link.classList.remove('border-b-2', 'border-cyan-400', 'text-cyan-400');
            link.classList.add('text-neutral-400');
        }
    });

    // 4. Form Submission interaction (for connect.html)
    const connectForm = document.getElementById('connectForm');
    if(connectForm) {
        connectForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = connectForm.querySelector('button[type="submit"]');
            btn.innerHTML = "SYSTEM ENGAGED <span class='material-symbols-outlined ml-2 animate-spin'>sync</span>";
            setTimeout(() => {
                btn.innerHTML = "ACCESS GRANTED";
                btn.classList.add('bg-secondary-container', 'text-on-secondary-container');
                connectForm.reset();
                setTimeout(() => {
                     btn.innerHTML = "INITIATE PHASE ONE";
                     btn.classList.remove('bg-secondary-container', 'text-on-secondary-container');
                }, 3000);
            }, 2000);
        });
    }

    // 5. Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinksContainer = document.getElementById('mobile-links-container');
    const desktopNav = document.querySelector('nav .hidden.md\\:flex');

    if (mobileMenuBtn && mobileMenu && desktopNav && mobileLinksContainer) {
        // Clone links from desktop nav into mobile nav
        const links = desktopNav.querySelectorAll('a');
        links.forEach(link => {
            const clone = link.cloneNode(true);
            // Replace the small classes with huge, bold typography for mobile
            clone.className = "text-neutral-400 hover:text-cyan-300 transition-all duration-300 font-headline font-black text-3xl uppercase tracking-[0.1em] hover:scale-105 hover:drop-shadow-[0_0_15px_rgba(0,242,255,0.8)]";
            mobileLinksContainer.appendChild(clone);
        });

        // Toggle logic with animations
        mobileMenuBtn.addEventListener('click', () => {
            const icon = mobileMenuBtn.querySelector('span');
            if (mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.remove('hidden');
                // A small timeout to allow display:block to apply before changing opacity for transition
                setTimeout(() => {
                    mobileMenu.classList.remove('opacity-0', 'translate-y-[-20px]');
                    mobileMenu.classList.add('opacity-100', 'translate-y-0');
                }, 10);
                icon.textContent = 'close';
                document.body.style.overflow = 'hidden'; // Prevent scrolling while menu is open
            } else {
                mobileMenu.classList.remove('opacity-100', 'translate-y-0');
                mobileMenu.classList.add('opacity-0', 'translate-y-[-20px]');
                setTimeout(() => {
                    mobileMenu.classList.add('hidden');
                }, 500); // match duration-500
                icon.textContent = 'menu';
                document.body.style.overflow = '';
            }
        });
    }

});

document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Fade-Up Intersections
    const observerOptions = {
        root: null,
        rootMargin: "0px",
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-up-element');
    fadeElements.forEach(el => observer.observe(el));

    // 2. Simple Parallax for Auras in Hero
    const auras = document.querySelectorAll('.parallax-aura');
    if (auras.length > 0) {
        document.addEventListener('mousemove', (e) => {
            const x = e.clientX / window.innerWidth - 0.5;
            const y = e.clientY / window.innerHeight - 0.5;
            
            auras.forEach(aura => {
                const speed = aura.getAttribute('data-speed') || 50;
                aura.style.transform = `translate(calc(-50% + ${x * speed}px), calc(-50% + ${y * speed}px))`;
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

});

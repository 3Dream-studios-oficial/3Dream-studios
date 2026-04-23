/**
 * 3Dream Studios — Centralized Component System
 * ================================================
 * Single source of truth for navigation, footer, cookie consent,
 * and floating WhatsApp button across ALL pages.
 * 
 * USAGE: Include this script BEFORE main.js in every page.
 * <script src="assets/js/components.js"></script>
 * 
 * SCALABILITY: To add a new page to navigation:
 *   1. Add entry to NAV_LINKS array below
 *   2. That's it — all pages update automatically
 * 
 * @version 2.0.0
 * @author 3Dream Studios
 * @license Proprietary
 */

(function () {
    'use strict';

    // =========================================================================
    // CONFIGURATION — Edit these to update ALL pages at once
    // =========================================================================

    const SITE_CONFIG = {
        name: '3Dream Studios',
        tagline: 'BEYOND REALITY',
        year: new Date().getFullYear(),
        phone: '527731357457',
        email: 'b.3dreamstudios@gmail.com',
        instagram: 'https://www.instagram.com/3dreamstdio?igsh=ODYzbXdrb3FsaXFu',
        cgtrader: 'https://www.cgtrader.com/designers/brandonurielcalixtog',
        logoPath: 'assets/img/logo.png',
    };

    /**
     * Navigation links — Add new pages here.
     * The system auto-detects the current page and highlights it.
     */
    const NAV_LINKS = [
        { label: 'Galería', href: 'gallery.html' },
        { label: 'WebAR Menús', href: 'index.html#webar-menus', highlight: true },
        { label: 'Universo', href: 'universe.html' },
        { label: 'Proceso', href: 'process.html' },
        { label: 'Archivo', href: 'archive.html' },
    ];

    const FOOTER_LINKS = [
        { label: 'Términos', href: 'terms.html' },
        { label: 'Privacidad', href: 'privacy.html' },
        { label: 'CGTrader', href: SITE_CONFIG.cgtrader, external: true },
        { label: 'Instagram', href: SITE_CONFIG.instagram, external: true },
    ];

    // =========================================================================
    // PATH RESOLVER — Handles both root and subdirectory pages
    // =========================================================================

    function getBasePath() {
        const path = window.location.pathname;
        if (path.includes('/projects/')) return '../';
        return '';
    }

    function resolveHref(href) {
        if (href.startsWith('http')) return href;
        return getBasePath() + href;
    }

    function resolveAsset(path) {
        return getBasePath() + path;
    }

    function isCurrentPage(href) {
        const current = window.location.pathname.split('/').pop() || 'index.html';
        return href === current;
    }

    // =========================================================================
    // NAVIGATION COMPONENT
    // =========================================================================

    function renderNav() {
        const target = document.getElementById('nav-root');
        if (!target) return;

        const desktopLinks = NAV_LINKS.map(link => {
            const active = isCurrentPage(link.href.split('#')[0]);
            if (link.highlight) {
                return `<a class="relative inline-flex items-center gap-1.5 text-emerald-400 font-semibold hover:text-emerald-300 hover:scale-105 transition-all duration-300 group" href="${resolveHref(link.href)}">
                    <span class="relative flex h-1.5 w-1.5"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span class="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span></span>
                    ${link.label}
                </a>`;
            }
            const classes = active
                ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold'
                : 'text-neutral-400 font-medium hover:text-cyan-300 hover:scale-105';
            return `<a class="${classes} transition-all duration-300" href="${resolveHref(link.href)}">${link.label}</a>`;
        }).join('');

        const mobileLinks = NAV_LINKS.map(link => {
            if (link.highlight) {
                return `<a class="text-emerald-400 hover:text-emerald-300 transition-all duration-300 font-headline font-black text-3xl uppercase tracking-[0.1em] hover:scale-105 hover:drop-shadow-[0_0_15px_rgba(16,185,129,0.8)] flex items-center gap-3" href="${resolveHref(link.href)}">
                    <span class="relative flex h-2 w-2"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span></span>
                    ${link.label}
                </a>`;
            }
            return `<a class="text-neutral-400 hover:text-cyan-300 transition-all duration-300 font-headline font-black text-3xl uppercase tracking-[0.1em] hover:scale-105 hover:drop-shadow-[0_0_15px_rgba(0,242,255,0.8)]" href="${resolveHref(link.href)}">${link.label}</a>`;
        }).join('');

        target.innerHTML = `
        <nav class="fixed top-0 w-full rounded-b-lg border-b border-white/10 bg-neutral-950/40 backdrop-blur-xl shadow-[0_0_40px_rgba(0,242,255,0.06)] z-50 transition-all duration-300" role="navigation" aria-label="Navegación principal">
            <div class="flex justify-between items-center w-full px-8 py-4 max-w-screen-2xl mx-auto">
                <a href="${resolveHref('index.html')}" class="flex items-center gap-4 group" aria-label="Inicio - 3Dream Studios">
                    <img src="${resolveAsset(SITE_CONFIG.logoPath)}" alt="3Dream Studios Logo"
                        class="h-12 w-auto group-hover:drop-shadow-[0_0_15px_rgba(0,242,255,0.8)] transition-all duration-300"
                        width="48" height="48">
                    <span class="hidden sm:block text-2xl font-black tracking-widest text-cyan-400 drop-shadow-[0_0_8px_rgba(0,242,255,0.5)] font-headline uppercase">
                        3Dream Studios
                    </span>
                </a>
                <div class="hidden md:flex items-center gap-8 font-headline uppercase tracking-tighter text-sm">
                    ${desktopLinks}
                </div>
                <div class="flex items-center">
                    <a href="${resolveHref('cotizar.html')}" id="nav-cta-cotizar"
                        class="relative group px-6 py-2 rounded-full overflow-hidden flex items-center gap-2 bg-neutral-900 border border-cyan-500/30 shadow-[0_0_15px_rgba(0,242,255,0.15)] hover:shadow-[0_0_25px_rgba(0,242,255,0.4)] hover:border-cyan-400 transition-all duration-500">
                        <div class="absolute inset-0 bg-gradient-to-r from-cyan-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <span class="material-symbols-outlined text-cyan-400 text-xl group-hover:scale-110 transition-transform relative z-10">bolt</span>
                        <span class="font-headline font-bold uppercase tracking-[0.2em] text-white text-sm relative z-10 group-hover:text-cyan-300 transition-colors">Cotizar</span>
                    </a>
                    <button id="mobile-menu-btn" class="md:hidden ml-4 p-2 text-cyan-400 hover:text-cyan-300 transition-colors flex items-center justify-center rounded-full bg-neutral-900 border border-white/10" aria-label="Abrir menú de navegación" aria-expanded="false" aria-controls="mobile-menu">
                        <span class="material-symbols-outlined text-2xl pointer-events-none">menu</span>
                    </button>
                </div>
            </div>
            <div id="mobile-menu" class="hidden absolute top-full left-0 w-full h-[calc(100vh-1px)] bg-neutral-950 border-t border-white/10 flex-col items-center justify-center gap-10 z-50 overflow-hidden transition-all duration-500 opacity-0 translate-y-[-20px]" role="dialog" aria-label="Menú móvil">
                <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none"></div>
                <div class="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-purple-500 to-cyan-400 opacity-50"></div>
                <div id="mobile-links-container" class="flex flex-col items-center gap-8 w-full relative z-10">
                    ${mobileLinks}
                </div>
                <div class="mt-8 relative z-10">
                    <p class="font-headline font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-purple-500 tracking-[0.4em] text-xs opacity-70">
                        ${SITE_CONFIG.tagline}
                    </p>
                </div>
            </div>
        </nav>`;
    }

    // =========================================================================
    // FOOTER COMPONENT
    // =========================================================================

    function renderFooter() {
        const target = document.getElementById('footer-root');
        if (!target) return;

        const links = FOOTER_LINKS.map(link => {
            const ext = link.external ? ' target="_blank" rel="noopener noreferrer"' : '';
            return `<a class="font-label text-xs tracking-widest uppercase text-neutral-500 hover:text-cyan-400 hover:scale-105 transition-all duration-300" href="${link.external ? link.href : resolveHref(link.href)}"${ext}>${link.label}</a>`;
        }).join('');

        target.innerHTML = `
        <footer class="bg-neutral-950 w-full border-t border-white/5 pt-20 pb-10 z-10 relative mt-auto" role="contentinfo">
            <div class="max-w-screen-2xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-6">
                <div class="flex flex-col items-center md:items-start gap-2">
                    <span class="font-headline font-bold text-neutral-100 text-xl tracking-widest uppercase">${SITE_CONFIG.name}</span>
                    <p class="font-label text-xs tracking-widest uppercase text-neutral-500">
                        © ${SITE_CONFIG.year} 3DREAM STUDIOS. TODOS LOS DERECHOS RESERVADOS.
                    </p>
                </div>
                <div class="flex gap-8 border-none flex-wrap justify-center">${links}</div>
                <button
                    class="w-10 h-10 flex items-center justify-center rounded-full border border-white/10 text-neutral-500 hover:text-cyan-400 hover:border-cyan-400 hover:-translate-y-2 transition-all duration-300 shadow-[0_0_15px_rgba(0,242,255,0.1)]"
                    onclick="window.scrollTo({top: 0, behavior: 'smooth'})" aria-label="Volver arriba">
                    <span class="material-symbols-outlined">arrow_upward</span>
                </button>
            </div>
        </footer>`;
    }

    // =========================================================================
    // COOKIE CONSENT BANNER (LFPDPPP / GDPR Compliance)
    // =========================================================================

    function renderCookieBanner() {
        if (localStorage.getItem('3dream_cookies_accepted')) return;

        const banner = document.createElement('div');
        banner.id = 'cookie-banner';
        banner.setAttribute('role', 'alert');
        banner.setAttribute('aria-live', 'polite');
        banner.className = 'fixed bottom-0 left-0 w-full z-[9998] p-4 md:p-6 transition-all duration-500 translate-y-full';
        banner.innerHTML = `
            <div class="max-w-screen-xl mx-auto bg-neutral-900/95 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] flex flex-col md:flex-row items-center gap-6">
                <div class="flex-1">
                    <div class="flex items-center gap-3 mb-2">
                        <span class="material-symbols-outlined text-cyan-400 text-2xl">cookie</span>
                        <h3 class="font-headline font-bold text-white uppercase tracking-wider text-sm">Aviso de Privacidad</h3>
                    </div>
                    <p class="font-body text-neutral-400 text-sm leading-relaxed">
                        Este sitio utiliza cookies esenciales para su funcionamiento. Al continuar navegando, aceptas nuestra 
                        <a href="${resolveHref('privacy.html')}" class="text-cyan-400 hover:text-cyan-300 underline underline-offset-2">Política de Privacidad</a> 
                        y el uso de cookies conforme a la <strong class="text-neutral-300">Ley Federal de Protección de Datos Personales (LFPDPPP)</strong>.
                    </p>
                </div>
                <div class="flex gap-3 shrink-0">
                    <button id="cookie-reject" class="px-5 py-2 rounded-full border border-white/10 text-neutral-400 hover:text-white hover:border-white/30 transition-all duration-300 font-headline text-xs uppercase tracking-widest">
                        Solo esenciales
                    </button>
                    <button id="cookie-accept" class="px-6 py-2 rounded-full bg-cyan-500 text-neutral-950 font-headline font-bold text-xs uppercase tracking-widest hover:bg-cyan-400 hover:shadow-[0_0_20px_rgba(0,242,255,0.4)] transition-all duration-300">
                        Aceptar
                    </button>
                </div>
            </div>`;
        document.body.appendChild(banner);

        // Animate in after short delay
        requestAnimationFrame(() => {
            setTimeout(() => {
                banner.classList.remove('translate-y-full');
                banner.classList.add('translate-y-0');
            }, 1500);
        });

        document.getElementById('cookie-accept').addEventListener('click', () => {
            localStorage.setItem('3dream_cookies_accepted', 'all');
            dismissCookieBanner(banner);
        });

        document.getElementById('cookie-reject').addEventListener('click', () => {
            localStorage.setItem('3dream_cookies_accepted', 'essential');
            dismissCookieBanner(banner);
        });
    }

    function dismissCookieBanner(banner) {
        banner.classList.remove('translate-y-0');
        banner.classList.add('translate-y-full');
        setTimeout(() => banner.remove(), 500);
    }

    // =========================================================================
    // FLOATING WHATSAPP BUTTON
    // =========================================================================

    function renderWhatsAppButton() {
        const btn = document.createElement('a');
        btn.href = `https://wa.me/${SITE_CONFIG.phone}?text=${encodeURIComponent('¡Hola 3Dream Studios! 🚀 Me interesa cotizar un proyecto.')}`;
        btn.target = '_blank';
        btn.rel = 'noopener noreferrer';
        btn.id = 'whatsapp-float';
        btn.setAttribute('aria-label', 'Contactar por WhatsApp');
        btn.className = 'fixed bottom-6 right-6 z-[9997] w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(37,211,102,0.4)] hover:shadow-[0_4px_30px_rgba(37,211,102,0.7)] hover:scale-110 active:scale-95 transition-all duration-300 group opacity-0 translate-y-4';
        btn.innerHTML = `
            <svg class="w-7 h-7 text-white group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
            </svg>
            <span class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-ping opacity-75"></span>
            <span class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full"></span>`;
        document.body.appendChild(btn);

        // Animate in
        setTimeout(() => {
            btn.classList.remove('opacity-0', 'translate-y-4');
            btn.classList.add('opacity-100', 'translate-y-0');
        }, 2000);
    }

    // =========================================================================
    // SCROLL PROGRESS INDICATOR
    // =========================================================================

    function renderScrollProgress() {
        const bar = document.createElement('div');
        bar.id = 'scroll-progress';
        bar.className = 'fixed top-0 left-0 h-[3px] bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 z-[60] transition-none';
        bar.style.width = '0%';
        bar.setAttribute('role', 'progressbar');
        bar.setAttribute('aria-label', 'Progreso de lectura');
        document.body.appendChild(bar);
    }

    // =========================================================================
    // INITIALIZATION
    // =========================================================================

    function init() {
        renderNav();
        renderFooter();
        renderScrollProgress();
        renderCookieBanner();
        renderWhatsAppButton();
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();

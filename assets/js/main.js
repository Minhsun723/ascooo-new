/**
 * ASCOOO — Main JS
 * Global initialization (Lenis, i18n, Animations, Menu, Header)
 */
document.addEventListener('DOMContentLoaded', () => {

  // ---- 0. Page Transitions ----
  const opEl = document.querySelector('.p-op');
  if (opEl && typeof gsap !== 'undefined') {
    const isFirstVisit = !sessionStorage.getItem('ascooo-visited');
    
    // Hide hero slide initially to prevent flashing before entrance animation finishes
    if (document.querySelector('.p-hero__slide')) {
      gsap.set('.p-hero__slide', { opacity: 0, y: 40, filter: 'blur(8px)' });
    }

    // Page Entrance Animation
    const entranceTl = gsap.timeline({
      onComplete: () => {
        sessionStorage.setItem('ascooo-visited', '1');
        opEl.style.pointerEvents = 'none'; // Ensure clicks pass through
        // If there's a hero slide, animate it in
        if (document.querySelector('.p-hero__slide')) {
          gsap.to('.p-hero__slide',
            { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1, ease: 'power3.out' }
          );
        }
      }
    });

    if (isFirstVisit) {
      // Full animation with logo for first visit
      entranceTl.fromTo('.p-op__logo', 
        { opacity: 0, scale: 0.9, filter: 'blur(10px)' },
        { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.6, ease: 'power3.out', delay: 0.1 }
      )
      .to('.p-op__logo', {
        opacity: 0,
        scale: 1.1,
        filter: 'blur(10px)',
        duration: 0.4,
        ease: 'power3.in',
        delay: 0.3,
      })
      .to('.p-op__overlay', {
        yPercent: -100,
        duration: 0.9,
        ease: 'power4.inOut',
        stagger: 0.1,
      }, '-=0.2');
    } else {
      // Faster animation without logo for subsequent visits / page transitions
      gsap.set('.p-op__logo', { display: 'none' });
      entranceTl.to('.p-op__overlay', {
        yPercent: -100,
        duration: 0.35,
        ease: 'power2.inOut',
        stagger: 0.03,
      });
    }

    // Intercept Link Clicks for Exit Animation
    const links = document.querySelectorAll('a[href]');
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        const target = link.getAttribute('target');
        
        // Ignore links that shouldn't trigger transition:
        // Hash links, external links, target="_blank", mailto:, tel:
        if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || target === '_blank') return;
        
        // Check if internal link
        const currentDomain = window.location.hostname;
        const linkDomain = new URL(link.href, window.location.href).hostname;
        
        if (currentDomain !== linkDomain) return;

        // Check if clicking link to the exact same page (e.g. Logo on Home)
        const currentPath = window.location.pathname;
        const linkPath = new URL(link.href, window.location.href).pathname;
        const normalizePath = (p) => p.replace(/\/index\.html$/, '/').replace(/\/$/, '') || '/';
        
        if (normalizePath(currentPath) === normalizePath(linkPath) && !link.search && !link.hash) {
          e.preventDefault();
          // Scroll to top smoothly if on same page
          if (typeof lenis !== 'undefined' && lenis) {
            lenis.scrollTo(0);
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
          return;
        }

        // Ignore if just empty hash or similar
        if (href === '#' || href === '') return;

        e.preventDefault();
        
        // Ensure opEl is visible and on top
        opEl.style.display = 'block';
        opEl.style.pointerEvents = 'all';
        gsap.set('.p-op__logo', { display: 'none' });

        // Animate overlays down to cover the screen (coming from bottom)
        gsap.fromTo('.p-op__overlay', 
          { yPercent: 100 }, 
          { 
            yPercent: 0, 
            duration: 0.3, 
            ease: 'power2.inOut', 
            stagger: 0.03,
            onComplete: () => {
              window.location.href = href;
            }
          }
        );
      });
    });
  }

  // ---- 1. i18n Initialization ----
  if (typeof I18n !== 'undefined') {
    I18n.init();
  }

  // ---- 2. Animations Initialization ----
  if (typeof Animations !== 'undefined') {
    Animations.init();
  }

  // ---- 3. Lenis Smooth Scroll ----
  let lenis;
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Integrate with GSAP ScrollTrigger
    if (typeof ScrollTrigger !== 'undefined' && typeof gsap !== 'undefined') {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    }
  }

  // ---- 4. Header & Navigation Menu ----
  const header = document.getElementById('header');
  const menuBtn = document.querySelector('[data-menu]');
  const nav = document.querySelector('.l-nav');
  const menuCloses = document.querySelectorAll('[data-menu-close]');
  let isMenuOpen = false;

  // Header background on scroll
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    });
    // initial check
    if (window.scrollY > 50) {
      header.classList.add('is-scrolled');
    }
  }

  // Toggle Menu
  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
    if (isMenuOpen) {
      document.body.setAttribute('data-menu-open', '');
      nav?.classList.add('is-open');
      if (lenis) lenis.stop();
    } else {
      document.body.removeAttribute('data-menu-open');
      nav?.classList.remove('is-open');
      if (lenis) lenis.start();
    }
  }

  if (menuBtn) {
    menuBtn.addEventListener('click', toggleMenu);
  }

  if (menuCloses) {
    menuCloses.forEach(btn => {
      btn.addEventListener('click', () => {
        if (isMenuOpen) toggleMenu();
      });
    });
  }

  // ---- 5. Page Top Button ----
  const pageTopBtn = document.createElement('button');
  pageTopBtn.className = 'c-page-top';
  pageTopBtn.setAttribute('aria-label', 'Scroll to top');
  pageTopBtn.setAttribute('data-anchor', 'top');
  pageTopBtn.innerHTML = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M12 19V5M5 12l7-7 7 7"/>
    </svg>
  `;
  document.body.appendChild(pageTopBtn);

  // Show/hide based on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      pageTopBtn.classList.add('is-visible');
    } else {
      pageTopBtn.classList.remove('is-visible');
    }
  });

  // ---- 6. Anchor Links (ScrollTo) ----
  const anchorLinks = document.querySelectorAll('[data-anchor]');
  anchorLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetStr = link.getAttribute('data-anchor');
      
      // Close menu if open
      if (isMenuOpen) toggleMenu();

      if (targetStr === 'top') {
        if (lenis) {
          lenis.scrollTo(0);
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        return;
      }

      const targetEl = document.querySelector(targetStr);
      if (targetEl) {
        if (lenis) {
          lenis.scrollTo(targetEl, { offset: -80 }); // Adjust offset for header
        } else {
          const top = targetEl.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      } else {
        // If target not on this page, go to home page with hash
        if (window.location.pathname !== '/' && window.location.pathname !== '/index.html') {
          window.location.href = `/${targetStr}`;
        }
      }
    });
  });

  // ---- 6. Mobile Language dropdown behavior fix if needed ----
  const langToggle = document.querySelector('.l-lang__toggle');
  const langMenu = document.querySelector('.l-lang__menu');
  if (langToggle && langMenu) {
    langToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      langMenu.classList.toggle('is-active');
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.l-lang')) {
        langMenu.classList.remove('is-active');
      }
    });
  }

});

// ---- Handle Bfcache (Back button stuck animation fix) ----
window.addEventListener('pageshow', (event) => {
  if (event.persisted) {
    if (typeof gsap !== 'undefined') {
      // Hide the overlays immediately
      gsap.set('.p-op__overlay', { yPercent: -100 });
      const opEl = document.querySelector('.p-op');
      if (opEl) {
        opEl.style.pointerEvents = 'none';
      }
    }
  }
});

/**
 * ASCOOO — Shared GSAP Animations
 * ScrollTrigger-based reveal effects
 */

const Animations = (() => {

  /**
   * Scroll Reveal: Fade-up elements
   * Apply .js-reveal class to elements
   */
  function initScrollReveal() {
    const reveals = document.querySelectorAll('.js-reveal');
    if (!reveals.length) return;

    ScrollTrigger.batch(reveals, {
      onEnter: (elements) => {
        gsap.to(elements, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          stagger: 0.12,
          overwrite: true,
        });
      },
      start: 'top 85%',
      once: true,
    });
  }

  /**
   * Scroll Reveal from left
   */
  function initScrollRevealLeft() {
    const els = document.querySelectorAll('.js-reveal-left');
    if (!els.length) return;

    ScrollTrigger.batch(els, {
      onEnter: (elements) => {
        gsap.to(elements, {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: 'power2.out',
          stagger: 0.1,
          overwrite: true,
        });
      },
      start: 'top 85%',
      once: true,
    });
  }

  /**
   * Scroll Reveal from right
   */
  function initScrollRevealRight() {
    const els = document.querySelectorAll('.js-reveal-right');
    if (!els.length) return;

    ScrollTrigger.batch(els, {
      onEnter: (elements) => {
        gsap.to(elements, {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: 'power2.out',
          stagger: 0.1,
          overwrite: true,
        });
      },
      start: 'top 85%',
      once: true,
    });
  }

  /**
   * Scale reveal
   */
  function initScrollRevealScale() {
    const els = document.querySelectorAll('.js-reveal-scale');
    if (!els.length) return;

    ScrollTrigger.batch(els, {
      onEnter: (elements) => {
        gsap.to(elements, {
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: 'power2.out',
          stagger: 0.1,
          overwrite: true,
        });
      },
      start: 'top 85%',
      once: true,
    });
  }

  /**
   * Section Title Watermark Slide
   * The large background text slides in from left
   */
  function initSectionTitles() {
    const titles = document.querySelectorAll('.c-section-title');
    titles.forEach(title => {
      const bg = title.querySelector('.c-section-title__bg');
      const text = title.querySelector('.c-section-title__text');
      const cap = title.querySelector('.c-section-title__cap');

      if (bg) {
        gsap.fromTo(bg,
          { xPercent: -20, opacity: 0, scale: 0.95, filter: 'blur(8px)' },
          {
            xPercent: 0,
            opacity: 1,
            scale: 1,
            filter: 'blur(0px)',
            duration: 1.5,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: title,
              start: 'top 85%',
              once: true,
            },
          }
        );
      }

      if (text) {
        gsap.fromTo(text,
          { y: 40, opacity: 0, letterSpacing: '0.2em', filter: 'blur(8px)', clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)' },
          {
            y: 0,
            opacity: 1,
            letterSpacing: '-0.02em',
            filter: 'blur(0px)',
            clipPath: 'polygon(-20% -20%, 120% -20%, 120% 120%, -20% 120%)',
            duration: 1.2,
            ease: 'power3.out',
            delay: 0.1,
            scrollTrigger: {
              trigger: title,
              start: 'top 85%',
              once: true,
            },
          }
        );
      }

      if (cap) {
        gsap.fromTo(cap,
          { y: 20, opacity: 0, letterSpacing: '0.5em', filter: 'blur(4px)' },
          {
            y: 0,
            opacity: 1,
            letterSpacing: '0.1em',
            filter: 'blur(0px)',
            duration: 1,
            ease: 'power3.out',
            delay: 0.3,
            scrollTrigger: {
              trigger: title,
              start: 'top 85%',
              once: true,
            },
          }
        );
      }

      // Decorative line animation
      gsap.fromTo(title,
        { '--title-line-scale': 0 },
        {
          '--title-line-scale': 1,
          duration: 1,
          ease: 'power3.inOut',
          delay: 0.4,
          scrollTrigger: {
            trigger: title,
            start: 'top 85%',
            once: true,
          },
        }
      );
    });
  }

  /**
   * Parallax effect on background elements
   */
  function initParallax() {
    const parallaxEls = document.querySelectorAll('[data-parallax]');
    parallaxEls.forEach(el => {
      const speed = parseFloat(el.getAttribute('data-parallax')) || 0.1;
      gsap.to(el, {
        yPercent: speed * 100,
        ease: 'none',
        scrollTrigger: {
          trigger: el.parentElement || el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    });
  }

  /**
   * Initialize all shared animations
   */
  function init() {
    gsap.registerPlugin(ScrollTrigger);

    initScrollReveal();
    initScrollRevealLeft();
    initScrollRevealRight();
    initScrollRevealScale();
    initSectionTitles();
    initParallax();
  }

  return { init };
})();

/**
 * ASCOOO — Home Page JS
 * Opening animation, Hero Swiper, Page-specific ScrollTrigger
 */

document.addEventListener('DOMContentLoaded', () => {

  // ---- Opening Animation ----
  // Handled globally in main.js now

  // ---- Hero Swiper ----
  const heroSwiperEl = document.querySelector('.js-hero-swiper');
  if (heroSwiperEl) {
    new Swiper(heroSwiperEl, {
      slidesPerView: 'auto',
      centeredSlides: true,
      spaceBetween: 24,
      loop: true,
      speed: 800,
      autoplay: {
        delay: 4000,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.p-hero__pagination',
        clickable: true,
      },
      navigation: {
        prevEl: '.p-hero__slide-btn.--prev',
        nextEl: '.p-hero__slide-btn.--next',
      }
    });
  }

  // ---- Lineup Swiper ----
  const lineupSwiperEl = document.querySelector('.js-lineup-swiper');
  if (lineupSwiperEl) {
    new Swiper(lineupSwiperEl, {
      slidesPerView: 'auto',
      spaceBetween: 20,
      freeMode: true,
      speed: 500,
      navigation: {
        prevEl: '.p-lineup__slide-btn.--prev',
        nextEl: '.p-lineup__slide-btn.--next',
      },
    });
  }

  // Event listeners or other home.js logic can go here
});

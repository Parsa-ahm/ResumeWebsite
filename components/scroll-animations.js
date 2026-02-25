/**
 * Scroll Animations
 * Uses Intersection Observer to animate elements when they enter the viewport
 */
(function() {
  const SELECTORS = [
    '.metric-card',
    '.standard-card',
    '.accordion-item',
    '.section-title',
    '.card-row .col',
    '.skill-chart-card',
    '.section-spacing .row > *'
  ];

  function initScrollAnimations() {
    const elements = document.querySelectorAll(SELECTORS.join(', '));
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    elements.forEach((el) => {
      el.classList.add('animate-on-scroll');
      observer.observe(el);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollAnimations);
  } else {
    initScrollAnimations();
  }
})();

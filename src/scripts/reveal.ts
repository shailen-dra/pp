// Fades [data-reveal] elements in once as they enter the viewport.
// The hidden state lives in CSS under html.js + prefers-reduced-motion: no-preference.
const elements = document.querySelectorAll<HTMLElement>('[data-reveal]');

if (!('IntersectionObserver' in window)) {
  elements.forEach((el) => el.classList.add('is-visible'));
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      }
    },
    { rootMargin: '0px 0px -10% 0px' },
  );
  elements.forEach((el) => observer.observe(el));
}

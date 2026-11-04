// Scroll reveal plus the small pointer and number effects.
// Hidden start states live in CSS under html.js + prefers-reduced-motion: no-preference,
// so without JS (or with reduced motion) everything simply shows.
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;

// Stagger index for the children of list / line reveals.
document.querySelectorAll<HTMLElement>('[data-reveal="stagger"], [data-reveal="lines"]').forEach((group) => {
  Array.from(group.children).forEach((child, i) => (child as HTMLElement).style.setProperty('--i', String(i)));
});

function countUp(el: HTMLElement) {
  const target = Number(el.dataset.countUp);
  if (!target || reduceMotion) return;
  const duration = 1400;
  const start = performance.now();
  const step = (now: number) => {
    const t = Math.min((now - start) / duration, 1);
    el.textContent = String(Math.round(target * (1 - Math.pow(1 - t, 3))));
    if (t < 1) requestAnimationFrame(step);
  };
  el.textContent = '0';
  requestAnimationFrame(step);
}

const elements = document.querySelectorAll<HTMLElement>('[data-reveal]');
const counters = document.querySelectorAll<HTMLElement>('[data-count-up]');

if (!('IntersectionObserver' in window)) {
  elements.forEach((el) => el.classList.add('is-visible'));
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target as HTMLElement;
        if ('countUp' in el.dataset) countUp(el);
        else el.classList.add('is-visible');
        observer.unobserve(el);
      }
    },
    { rootMargin: '0px 0px -10% 0px' },
  );
  elements.forEach((el) => observer.observe(el));
  counters.forEach((el) => observer.observe(el));
}

// Hero: the glow leans toward the pointer and the photo tilts slightly.
const hero = document.querySelector<HTMLElement>('[data-hero]');
if (hero && finePointer && !reduceMotion) {
  const glow = hero.querySelector<HTMLElement>('[data-glow]');
  const photo = hero.querySelector<HTMLElement>('[data-tilt]');
  let frame = 0;

  hero.addEventListener('pointermove', (event) => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      const rect = hero.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      if (glow) glow.style.translate = `${x * 12}% ${y * 12}%`;
      if (photo) photo.style.transform = `perspective(900px) rotateY(${x * 10}deg) rotateX(${-y * 8}deg)`;
    });
  });

  hero.addEventListener('pointerleave', () => {
    cancelAnimationFrame(frame);
    if (glow) glow.style.translate = '';
    if (photo) photo.style.transform = '';
  });
}

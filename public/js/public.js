/* ── HERO IMAGE SLIDER ── */
function initHeroSlider() {
  const imgs = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-full-dots span');
  if (!imgs.length) return;
  let i = 0;
  setInterval(() => {
    imgs[i].classList.remove('active');
    dots[i] && dots[i].classList.remove('active');
    i = (i + 1) % imgs.length;
    imgs[i].classList.add('active');
    dots[i] && dots[i].classList.add('active');
  }, 4500);

  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      imgs[i].classList.remove('active');
      dots[i].classList.remove('active');
      i = idx;
      imgs[i].classList.add('active');
      dots[i].classList.add('active');
    });
  });
}

/* ── SPOTLIGHT ARROWS (cycles through placeholder items) ── */
function initSpotlightArrows() {
  const items = window.__jgsSpotlightItems || [];
  const imgEl = document.getElementById('spotlightImg');
  const titleEl = document.getElementById('spotlightTitle');
  const prevBtn = document.getElementById('spotlightPrev');
  const nextBtn = document.getElementById('spotlightNext');
  if (!items.length || !imgEl || !titleEl) return;
  let i = 0;
  function render() {
    imgEl.src = items[i].img;
    titleEl.textContent = items[i].title;
  }
  prevBtn && prevBtn.addEventListener('click', () => { i = (i - 1 + items.length) % items.length; render(); });
  nextBtn && nextBtn.addEventListener('click', () => { i = (i + 1) % items.length; render(); });
}

/* ── ALUMNI CARD EXPAND ON CLICK ── */
function initAlumniCards() {
  document.querySelectorAll('.alumni-card').forEach(card => {
    card.addEventListener('click', () => card.classList.toggle('expanded'));
  });
}

/* ── NAV: switch from transparent-over-hero to solid once scrolled past it ── */
function initNavOverlay() {
  const nav = document.querySelector('.jgs-nav.nav-overlay');
  const hero = document.querySelector('.hero-full');
  if (!nav || !hero) return;
  function toggle() {
    const heroBottom = hero.getBoundingClientRect().bottom;
    const navHeight = nav.offsetHeight;
    if (heroBottom <= navHeight) nav.classList.add('solid');
    else nav.classList.remove('solid');
  }
  toggle();
  window.addEventListener('scroll', toggle, { passive: true });
}

/* ── ALUMNI CAROUSEL (fast sliding, peek-style) ── */
function initAlumniCarousel() {
  const viewport = document.getElementById('alumniViewport');
  const track = document.getElementById('alumniTrack');
  const prevBtn = document.getElementById('alumniPrev');
  const nextBtn = document.getElementById('alumniNext');
  if (!viewport || !track) return;
  const slides = Array.from(track.children);
  const slideWidth = 260;
  const gap = 24;
  let active = 0;

  function render() {
    slides.forEach((s, i) => s.classList.toggle('active', i === active));
    const vpWidth = viewport.clientWidth;
    const offset = vpWidth / 2 - (active * (slideWidth + gap) + slideWidth / 2);
    track.style.transform = `translateX(${offset}px)`;
  }
  prevBtn && prevBtn.addEventListener('click', () => { active = (active - 1 + slides.length) % slides.length; render(); });
  nextBtn && nextBtn.addEventListener('click', () => { active = (active + 1) % slides.length; render(); });
  window.addEventListener('resize', render);
  render();

  // auto-advance, fast
  setInterval(() => { active = (active + 1) % slides.length; render(); }, 2600);
}

/* ── SCROLL REVEAL ── */
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  els.forEach(el => obs.observe(el));
}

document.addEventListener('DOMContentLoaded', () => {
  initHeroSlider();
  initSpotlightArrows();
  initAlumniCards();
  initAlumniCarousel();
  initNavOverlay();
  initReveal();
});
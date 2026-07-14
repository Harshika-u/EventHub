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
  initReveal();
});
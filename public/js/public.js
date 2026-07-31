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
  const hero = document.querySelector('.hero-full, .spot-hero');
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

/* ── SPOTLIGHT HERO MARQUEE ──
   Builds the scrolling word strip in JS instead of hard-coding it in the HTML.
   Whatever the screen width, we keep appending copies of the word set until the
   track is at least twice as wide as its container, then duplicate that whole
   block once more. Animating translateX(-50%) on a track built this way always
   loops onto an identical copy of itself — no trailing gap once the words
   "run out", because they never run out before the loop point. */
function initMarquee() {
  const words = ["Innovation", "Integrity", "Service", "Scholarship", "Excellence", "Leadership"];
  document.querySelectorAll('.spot-marquee-track').forEach(track => {
    const container = track.closest('.spot-marquee') || track.parentElement;

    function appendWordSet() {
      words.forEach(w => {
        const span = document.createElement('span');
        span.textContent = w;
        track.appendChild(span);
      });
    }

    track.innerHTML = '';
    appendWordSet();

    // Keep adding sets until this single block covers at least twice the
    // visible width (a safe margin so it also works on very wide screens).
    let guard = 0;
    while (track.scrollWidth < container.clientWidth * 2 && guard < 25) {
      appendWordSet();
      guard++;
    }

    // Duplicate the whole block so translateX(-50%) lands on an identical copy.
    track.innerHTML += track.innerHTML;
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initHeroSlider();
  initSpotlightArrows();
  initAlumniCards();
  initAlumniCarousel();
  initNavOverlay();
  initReveal();
  initMarquee();
});

/* ══════════════════════════════════════════
   SPOTLIGHT / HALL OF FAME
   Live data — populated from the Firestore "spotlight" collection by the
   module script in spotlight.html, which sets window.__jgsHallOfFame and
   window.__jgsFeatured once the fetch resolves, then calls
   window.renderFeaturedSpotlight() and window.initHallOfFame() again.
   Categories are limited to: Academic Excellence, Sports, Cultural.
   ══════════════════════════════════════════ */
window.__jgsHallOfFame = window.__jgsHallOfFame || [];

/* Small helper — every piece of text below ultimately comes from admin-entered
   data, so anything going into innerHTML gets escaped. */
function escapeHtml(str) {
  return String(str == null ? '' : str).replace(/[&<>"']/g, m => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[m]));
}

/* Builds the avatar markup for a Hall of Fame item — a photo if one was
   uploaded, otherwise the initials. */
function hofAvatarHTML(item, extra) {
  if (item && item.image) {
    return `<img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name || '')}" style="width:100%;height:100%;object-fit:cover;border-radius:inherit;display:block;">`;
  }
  return `<span>${escapeHtml((item && item.initials) || '')}</span>${extra || ''}`;
}

/* ── HALL OF FAME: horizontal carousel with category select,
   arrow navigation, autoplay, and pause-on-hover/touch ── */
function initHallOfFame() {
  const viewport = document.getElementById('hofViewport');
  const track = document.getElementById('hofTrack');
  if (!track) return;

  const categorySelect = document.getElementById('hofCategorySelect');
  const prevBtn = document.getElementById('hofPrev');
  const nextBtn = document.getElementById('hofNext');

  const CLONE_COUNT = 4;     // leading cards cloned onto the end for a seamless loop
  const AUTOPLAY_MS = 3200;  // time between auto-advances

  let activeCategory = categorySelect ? categorySelect.value : 'all';
  let items = [];
  let index = 0;
  let cardStep = 0;
  let autoplayTimer = null;
  let isPaused = false;

  function getFiltered() {
    return (window.__jgsHallOfFame || []).filter(item => {
      return activeCategory === 'all' || item.category === activeCategory;
    });
  }

  function cardHTML(item) {
    const photoInner = item.image
      ? `<img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name || '')}">`
      : `<div class="hof-card-initials">${escapeHtml(item.initials || '')}</div>`;

    return `
      <div class="hof-card" data-id="${escapeHtml(item.id)}">
        <div class="hof-card-photo">
          ${photoInner}
          <div class="hof-card-photo-gradient"></div>
          ${item.badge ? `<span class="hof-card-badge">${escapeHtml(item.badge)}</span>` : ""}
          ${item.category ? `<span class="hof-card-category">${escapeHtml(item.category)}</span>` : ""}
          <div class="hof-card-text">
            <h3 class="hof-card-name">${escapeHtml(item.name)}</h3>
            ${item.meta ? `<span class="hof-card-meta">${escapeHtml(item.meta)}</span>` : ""}
            <span class="hof-card-readmore">Read More →</span>
          </div>
        </div>
      </div>`;
  }

  function attachCardEvents() {
    track.querySelectorAll('.hof-card').forEach(card => {
      card.addEventListener('click', () => {
        const item = (window.__jgsHallOfFame || []).find(i => String(i.id) === card.dataset.id);
        if (item) openHofModal(item);
      });
    });
  }

  function measureStep() {
    const first = track.querySelector('.hof-card');
    if (!first) { cardStep = 0; return; }
    const styles = getComputedStyle(track);
    const gap = parseFloat(styles.columnGap || styles.gap || '24');
    cardStep = first.getBoundingClientRect().width + gap;
  }

  function goTo(i, instant) {
    index = i;
    track.style.transition = instant ? 'none' : '';
    track.style.transform = `translateX(${-index * cardStep}px)`;
    if (instant) {
      void track.offsetWidth; // force reflow so the next move transitions normally
      track.style.transition = '';
    }
  }

  function render() {
    items = getFiltered();
    index = 0;

    if (!items.length) {
      track.innerHTML = `<p style="color:var(--slate-light);font-size:14px;">No achievements in this category yet.</p>`;
      track.style.transform = 'translateX(0)';
      if (prevBtn) prevBtn.disabled = true;
      if (nextBtn) nextBtn.disabled = true;
      return;
    }

    const clones = items.slice(0, Math.min(CLONE_COUNT, items.length));
    track.innerHTML = items.map(cardHTML).join('') + clones.map(cardHTML).join('');
    attachCardEvents();

    if (prevBtn) prevBtn.disabled = items.length <= 1;
    if (nextBtn) nextBtn.disabled = items.length <= 1;

    requestAnimationFrame(() => {
      measureStep();
      goTo(0, true);
    });
  }

  function next() {
    if (items.length <= 1) return;
    goTo(index + 1);
    if (index >= items.length) {
      setTimeout(() => goTo(0, true), 460);
    }
  }

  function prev() {
    if (items.length <= 1) return;
    if (index <= 0) {
      goTo(items.length, true);
      requestAnimationFrame(() => goTo(items.length - 1));
    } else {
      goTo(index - 1);
    }
  }

  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(() => { if (!isPaused) next(); }, AUTOPLAY_MS);
  }
  function stopAutoplay() {
    if (autoplayTimer) clearInterval(autoplayTimer);
  }

  categorySelect && categorySelect.addEventListener('change', () => {
    activeCategory = categorySelect.value;
    render();
  });

  prevBtn && prevBtn.addEventListener('click', prev);
  nextBtn && nextBtn.addEventListener('click', next);

  // Pause on hover for mouse users, and on touch for touchscreen devices.
  [viewport, track].forEach(el => {
    if (!el) return;
    el.addEventListener('mouseenter', () => { isPaused = true; });
    el.addEventListener('mouseleave', () => { isPaused = false; });
    el.addEventListener('touchstart', () => { isPaused = true; }, { passive: true });
    el.addEventListener('touchend', () => { isPaused = false; }, { passive: true });
  });

  window.addEventListener('resize', () => {
    measureStep();
    goTo(index, true);
  });

  render();
  startAutoplay();
}
window.initHallOfFame = initHallOfFame;

/* ── SHARED MODAL: used by both the Featured Spotlight "Read Story" button
   and Hall of Fame cards ── */
function openHofModal(item) {
  const overlay = document.getElementById('hofModalOverlay');
  if (!overlay || !item) return;

  document.getElementById('modalAvatar').innerHTML = hofAvatarHTML(item);
  document.getElementById('modalTag').textContent = item.category || '';
  document.getElementById('modalName').textContent = item.name || '';
  document.getElementById('modalMeta').textContent = item.meta || '';
  document.getElementById('modalLine').textContent = item.line || '';

  const bodyText = item.desc || item.body || '';
  document.getElementById('modalBody').innerHTML = bodyText
    .split('\n\n').filter(Boolean).map(p => `<p>${escapeHtml(p)}</p>`).join('');

  // Achievement Highlights are optional — hide the whole block if there are none.
  const highlightsWrap = document.querySelector('.hof-modal-highlights');
  const highlightsList = document.getElementById('modalHighlights');
  const highlights = item.highlights || [];
  if (highlights.length) {
    highlightsList.innerHTML = highlights.map(h => `<li>${escapeHtml(h)}</li>`).join('');
    if (highlightsWrap) highlightsWrap.style.display = '';
  } else {
    highlightsList.innerHTML = '';
    if (highlightsWrap) highlightsWrap.style.display = 'none';
  }

  overlay.classList.add('open');
}

function initHofModal() {
  const overlay = document.getElementById('hofModalOverlay');
  const closeBtn = document.getElementById('hofModalClose');
  if (!overlay) return;
  closeBtn.addEventListener('click', () => overlay.classList.remove('open'));
  overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.classList.remove('open'); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') overlay.classList.remove('open'); });
}

/* ── FEATURED SPOTLIGHT (hero banner) — populated from window.__jgsFeatured.
   The section stays hidden until a featured entry actually exists. ── */
function renderFeaturedSpotlight() {
  const section = document.getElementById('featuredSection');
  if (!section) return;

  const featured = window.__jgsFeatured;
  if (!featured) {
    section.style.display = 'none';
    return;
  }
  section.style.display = '';

  const avatarEl = document.getElementById('featuredAvatar');
  const initialsEl = document.getElementById('featuredInitials');
  const existingImg = avatarEl.querySelector('img');

  if (featured.image) {
    if (existingImg) {
      existingImg.src = featured.image;
      existingImg.alt = featured.name || '';
    } else {
      const img = document.createElement('img');
      img.src = featured.image;
      img.alt = featured.name || '';
      img.style.cssText = 'width:100%;height:100%;object-fit:cover;border-radius:inherit;display:block;';
      avatarEl.insertBefore(img, initialsEl);
    }
    if (initialsEl) initialsEl.style.display = 'none';
  } else {
    if (existingImg) existingImg.remove();
    if (initialsEl) {
      initialsEl.style.display = '';
      initialsEl.textContent = featured.initials || '';
    }
  }

  const badgeEl = document.getElementById('featuredBadge');
  if (badgeEl) badgeEl.textContent = featured.badge || '';

  document.getElementById('featuredTag').textContent = featured.category || '';
  document.getElementById('featuredName').textContent = featured.name || '';
  document.getElementById('featuredLine').textContent = featured.line || '';
  document.getElementById('featuredDesc').textContent = featured.desc || featured.body || '';

  const btn = document.getElementById('featuredReadStory');
  if (btn) {
    btn.onclick = () => openHofModal(featured);
  }
}
window.renderFeaturedSpotlight = renderFeaturedSpotlight;

document.addEventListener('DOMContentLoaded', () => {
  // Hide the featured banner until spotlight.html's Firestore fetch resolves
  // and calls renderFeaturedSpotlight() again with real data (or nothing, if
  // no entry is marked Featured).
  const section = document.getElementById('featuredSection');
  if (section) section.style.display = 'none';

  initHallOfFame();
  initHofModal();
});
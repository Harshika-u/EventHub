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
   Dummy data for now — wire to Firestore "spotlight" or
   "achievements" collection later, same as home.html's
   spotlight strip and countdown.
   Categories are limited to: Academic Excellence, Sports, Cultural.
   ══════════════════════════════════════════ */
window.__jgsHallOfFame = [
  { id: 1, initials: "PM", name: "Priya Menon", type: "student", meta: "Batch of 2023", line: "National Debate Champion",
    category: "Cultural",
    body: "Priya represented Ashford Hall at the National Inter-School Debate Championship, where she spoke on the ethics of artificial intelligence before a panel of sitting judges. Her final address was described by the moderating adjudicator as \u201cthe finest piece of student oratory in the competition's thirty-year history.\u201d\n\nShe now studies Law and returns each summer to coach the school's debate society.",
    highlights: ["National Debate Champion", "Best Speaker, 3 consecutive years"] },

  { id: 2, initials: "RK", name: "Rohan Kapoor", type: "student", meta: "Grade 12", line: "State Swimming Gold — 200m Freestyle",
    category: "Sports",
    body: "Rohan trains before dawn six days a week. His state gold in the 200m freestyle came with a new meet record, breaking a mark that had stood for eleven years.\n\nHe has been shortlisted for the national junior squad and balances his training with a place on the school's academic honour roll.",
    highlights: ["State record, 200m freestyle", "National junior squad shortlist"] },

  { id: 3, initials: "MK", name: "Dr. Meera Krishnan", type: "faculty", meta: "Faculty, Department of Physics", line: "National Award for Excellence in Teaching",
    category: "Academic Excellence",
    body: "Dr. Krishnan redesigned the senior physics lab around student-led inquiry, replacing prescribed experiments with open research questions. The approach has since been adopted by two neighbouring schools.\n\nShe was recognised with the National Award for Excellence in Teaching for her contribution to science pedagogy.",
    highlights: ["National Award for Excellence in Teaching", "Lab curriculum adopted by 2 partner schools"] },

  { id: 4, initials: "IV", name: "Ishaan Verma", type: "alumni", meta: "Batch of 2021", line: "Founder, EdTech Startup — $2M Seed Round",
    category: "Academic Excellence",
    body: "Ishaan founded his EdTech startup in his final year at Ashford Hall, building the first prototype in the school's computer lab. The company closed a $2M seed round and now serves classrooms across three states.\n\nHe credits the school's entrepreneurship elective for the original idea.",
    highlights: ["Founder & CEO, EdTech startup", "$2M seed round closed 2025"] },

  { id: 5, initials: "ST", name: "Sara Thomas", type: "alumni", meta: "Batch of 2020", line: "Rhodes Scholar, University of Oxford",
    category: "Academic Excellence",
    body: "Sara was named a Rhodes Scholar and is currently reading for a master's degree at the University of Oxford, focusing on international development economics.\n\nShe remains active in the school's alumni mentorship programme, advising current students on university applications.",
    highlights: ["Rhodes Scholarship, 2023", "MSc candidate, University of Oxford"] },

  { id: 6, initials: "KM", name: "Kabir Malhotra", type: "student", meta: "Grade 12", line: "Head Boy — Model UN Secretary-General",
    category: "Cultural",
    body: "As Head Boy, Kabir has led the student council through a full year of campus initiatives, and served as Secretary-General at the school's largest-ever Model UN conference, hosting delegates from twelve schools.\n\nHe plans to study international relations.",
    highlights: ["Head Boy, 2025\u201326", "Secretary-General, Ashford MUN"] },

  { id: 7, initials: "ED", name: "Mrs. Elena D'Souza", type: "faculty", meta: "Faculty, Department of English", line: "Published Novelist — National Book Prize Shortlist",
    category: "Cultural",
    body: "Mrs. D'Souza's debut novel was shortlisted for the National Book Prize this year, praised by critics for its portrayal of small-town adolescence.\n\nShe runs the school's creative writing circle, which has placed students in three national anthologies.",
    highlights: ["National Book Prize shortlist", "Creative writing circle: 3 national anthology placements"] },

  { id: 8, initials: "TM", name: "Mr. Thomas Mathew", type: "faculty", meta: "Faculty, Department of Mathematics", line: "30 Years of Distinguished Service",
    category: "Cultural",
    body: "Mr. Mathew marks three decades on the mathematics faculty this year, having taught nearly every student to pass through the senior wing since the school's early days.\n\nHis annual \u201cmath circle\u201d elective remains one of the most oversubscribed on campus.",
    highlights: ["30 years of service", "Math Circle: oversubscribed every year since 2011"] },
];

const JGS_FEATURED_SPOTLIGHT = {
  initials: "AS", name: "Aarav Sharma", meta: "Class of 2027", line: "National Science Olympiad Gold Medalist",
  category: "Academic Excellence",
  body: "From late nights in the school laboratory to the national podium, Aarav's journey is testament to curiosity disciplined by perseverance. His gold medal at the National Science Olympiad places him among the country's finest \u2014 and marks the latest in a growing line of school achievements earned through original, self-directed research.\n\nWhat distinguishes Aarav's achievement is not the medal itself, but what followed. He returned to Ashford Hall and founded the Junior Research Circle, a student-led society that now mentors dozens of younger students in scientific method and independent inquiry.",
  highlights: ["National Science Olympiad Gold Medalist", "Founder, Junior Research Circle"]
};

/* ── HALL OF FAME: horizontal carousel with filters, category select,
   arrow navigation, autoplay, and pause-on-hover/touch ── */
function initHallOfFame() {
  const viewport = document.getElementById('hofViewport');
  const track = document.getElementById('hofTrack');
  if (!track) return;

  const filterBtns = Array.from(document.querySelectorAll('.hof-filter'));
  const categorySelect = document.getElementById('hofCategorySelect');
  const prevBtn = document.getElementById('hofPrev');
  const nextBtn = document.getElementById('hofNext');

  const CLONE_COUNT = 4;     // leading cards cloned onto the end for a seamless loop
  const AUTOPLAY_MS = 3200;  // time between auto-advances

  let activeFilter = 'all';
  let activeCategory = 'all';
  let items = [];
  let index = 0;
  let cardStep = 0;
  let autoplayTimer = null;
  let isPaused = false;

  function getFiltered() {
    return window.__jgsHallOfFame.filter(item => {
      const typeMatch = activeFilter === 'all' || item.type === activeFilter;
      const catMatch = activeCategory === 'all' || item.category === activeCategory;
      return typeMatch && catMatch;
    });
  }

  function cardHTML(item) {
    return `
      <div class="hof-card" data-id="${item.id}">
        <div class="hof-card-avatar"><span>${item.initials}</span></div>
        <h3 class="hof-card-name">${item.name}</h3>
        <span class="hof-card-meta">${item.meta}</span>
        <p class="hof-card-line">${item.line}</p>
        <span class="hof-tag">${item.category}</span>
      </div>`;
  }

  function attachCardEvents() {
    track.querySelectorAll('.hof-card').forEach(card => {
      card.addEventListener('click', () => {
        const item = window.__jgsHallOfFame.find(i => i.id === Number(card.dataset.id));
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
      prevBtn.disabled = true;
      nextBtn.disabled = true;
      return;
    }

    const clones = items.slice(0, Math.min(CLONE_COUNT, items.length));
    track.innerHTML = items.map(cardHTML).join('') + clones.map(cardHTML).join('');
    attachCardEvents();

    prevBtn.disabled = items.length <= 1;
    nextBtn.disabled = items.length <= 1;

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

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.dataset.filter;
      render();
    });
  });

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

/* ── SHARED MODAL: used by both the Featured Spotlight "Read Story" button
   and Hall of Fame cards ── */
function openHofModal(item) {
  const overlay = document.getElementById('hofModalOverlay');
  if (!overlay) return;
  document.getElementById('modalAvatar').textContent = item.initials;
  document.getElementById('modalTag').textContent = item.category;
  document.getElementById('modalName').textContent = item.name;
  document.getElementById('modalMeta').textContent = item.meta;
  document.getElementById('modalLine').textContent = item.line;
  document.getElementById('modalBody').innerHTML = item.body
    .split('\n\n').map(p => `<p>${p}</p>`).join('');
  document.getElementById('modalHighlights').innerHTML = item.highlights
    .map(h => `<li>${h}</li>`).join('');
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

function initFeaturedSpotlight() {
  const btn = document.getElementById('featuredReadStory');
  if (!btn) return;
  btn.addEventListener('click', () => openHofModal({
    initials: JGS_FEATURED_SPOTLIGHT.initials,
    name: JGS_FEATURED_SPOTLIGHT.name,
    meta: JGS_FEATURED_SPOTLIGHT.meta,
    line: JGS_FEATURED_SPOTLIGHT.line,
    category: JGS_FEATURED_SPOTLIGHT.category,
    body: JGS_FEATURED_SPOTLIGHT.body,
    highlights: JGS_FEATURED_SPOTLIGHT.highlights
  }));
}

document.addEventListener('DOMContentLoaded', () => {
  initHallOfFame();
  initHofModal();
  initFeaturedSpotlight();
});
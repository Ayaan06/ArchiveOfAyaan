const root = document.documentElement;
const themeToggle = document.querySelector('[data-theme-toggle]');
const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.site-nav');
const themeKey = 'ayaan-theme-preference';

// Persisted theme helper ensures the UI survives refreshes and system changes.
const setTheme = (theme) => {
  const nextTheme = theme || 'dark';
  root.setAttribute('data-theme', nextTheme);
  themeToggle?.setAttribute('aria-pressed', String(nextTheme === 'dark'));
  if (themeToggle) {
    const label = nextTheme === 'dark' ? 'Dark' : 'Light';
    themeToggle.querySelector('.theme-text').textContent = label;
  }
  try {
    localStorage.setItem(themeKey, nextTheme);
  } catch (error) {
    console.warn('Unable to store theme preference', error);
  }
};

const storedTheme = (() => {
  try {
    return localStorage.getItem(themeKey);
  } catch (error) {
    return null;
  }
})();

if (storedTheme) {
  setTheme(storedTheme);
} else {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  setTheme(prefersDark ? 'dark' : 'light');
}

themeToggle?.addEventListener('click', () => {
  const current = root.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  setTheme(next);
});

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
  if (!localStorage.getItem(themeKey)) {
    setTheme(event.matches ? 'dark' : 'light');
  }
});

// Smooth scroll links target the scrollable main container so snapping stays consistent.
const handleAnchorClick = (event) => {
  const href = event.currentTarget.getAttribute('href');
  if (!href?.startsWith('#')) return;
  if (href === '#' || href.length === 1) return;
  const target = document.querySelector(href);
  if (!target) return;
  event.preventDefault();
  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  nav?.classList.remove('is-open');
  navToggle?.setAttribute('aria-expanded', 'false');
};

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', handleAnchorClick);
});

// Mobile navigation toggle.
navToggle?.addEventListener('click', () => {
  const isOpen = nav?.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', String(Boolean(isOpen)));
});

// IntersectionObserver reveals sections/cells as they slide into view.
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

// Highlight each snap section when centered to boost full-page feel.
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('panel-active');
      } else {
        entry.target.classList.remove('panel-active');
      }
    });
  },
  { threshold: 0.55 }
);

document.querySelectorAll('.snap-section').forEach((section) => sectionObserver.observe(section));

// Keep the footer year current.
const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// Show a real frame (e.g., 1s in) as the initial poster so users see the actual video content immediately.
const videosWithPreview = document.querySelectorAll('video[data-preview-seconds]');
videosWithPreview.forEach((video) => {
  const previewSeconds = Number(video.dataset.previewSeconds);
  if (!Number.isFinite(previewSeconds) || previewSeconds <= 0) return;

  const seekToPreview = () => {
    try {
      video.currentTime = previewSeconds;
    } catch (error) {
      // Ignore if the browser is still loading metadata; the handler will re-run once ready.
    }
  };

  if (video.readyState >= 1) {
    seekToPreview();
  } else {
    video.addEventListener('loadedmetadata', seekToPreview, { once: true });
  }
});

// Swipe-able project slider used on the archive page.
const sliderInstances = document.querySelectorAll('[data-slider]');
sliderInstances.forEach((slider) => {
  const track = slider.querySelector('[data-slider-track]');
  const prevBtn = slider.querySelector('[data-slider-prev]');
  const nextBtn = slider.querySelector('[data-slider-next]');
  if (!track) return;

  const cards = track.querySelectorAll('.more-project-card');
  if (!cards.length) return;

  const getStep = () => {
    const cardWidth = cards[0].getBoundingClientRect().width;
    const gapValue = parseFloat(window.getComputedStyle(track).columnGap || '24');
    return cardWidth + gapValue;
  };

  const scrollByStep = (direction) => {
    track.scrollBy({ left: direction * getStep(), behavior: 'smooth' });
  };

  const updateControls = () => {
    const maxScroll = track.scrollWidth - track.clientWidth;
    if (prevBtn) prevBtn.disabled = track.scrollLeft <= 5;
    if (nextBtn) nextBtn.disabled = track.scrollLeft >= maxScroll - 5;
  };

  prevBtn?.addEventListener('click', () => scrollByStep(-1));
  nextBtn?.addEventListener('click', () => scrollByStep(1));

  track.addEventListener('scroll', () => window.requestAnimationFrame(updateControls));
  track.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      scrollByStep(1);
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      scrollByStep(-1);
    }
  });

  updateControls();
});

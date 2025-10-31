// Simple interactions: mobile nav toggle, scroll reveal, year

(function () {
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('nav');
  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(open));
    });
    nav.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => {
        nav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      })
    );
  }

  // Reveal timeline cards on scroll
  const observer = new IntersectionObserver(
    entries => {
      for (const e of entries) {
        if (e.isIntersecting) e.target.classList.add('visible');
      }
    },
    { threshold: 0.15 }
  );
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // Current year in footer
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Interactable hero orb: tilt on pointer, glow follow, click pulse
  const orb = document.querySelector('.hero-orb');
  if (orb) {
    let raf = 0;
    const setCenter = () => {
      orb.style.setProperty('--px', '50%');
      orb.style.setProperty('--py', '50%');
      orb.style.transform = 'rotateX(0deg) rotateY(0deg)';
    };

    const onMove = (x, y) => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = orb.getBoundingClientRect();
        const nx = (x - r.left) / r.width; // 0..1
        const ny = (y - r.top) / r.height; // 0..1
        const px = Math.max(0, Math.min(1, nx));
        const py = Math.max(0, Math.min(1, ny));
        orb.style.setProperty('--px', (px * 100).toFixed(1) + '%');
        orb.style.setProperty('--py', (py * 100).toFixed(1) + '%');
        const rx = (0.5 - py) * 14; // tilt range
        const ry = (px - 0.5) * 18;
        orb.style.transform = `rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
      });
    };

    const pulse = () => {
      orb.classList.remove('pulse');
      // force reflow to restart animation
      void orb.offsetWidth;
      orb.classList.add('pulse');
      const ring = document.createElement('span');
      ring.className = 'ring';
      orb.appendChild(ring);
      ring.addEventListener('animationend', () => ring.remove());
    };

    // Pointer events
    orb.addEventListener('pointermove', (e) => onMove(e.clientX, e.clientY));
    orb.addEventListener('pointerenter', (e) => onMove(e.clientX, e.clientY));
    orb.addEventListener('pointerleave', () => setCenter());
    orb.addEventListener('click', pulse);

    // Keyboard accessibility
    orb.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        pulse();
      }
    });

    // Touch tap center pulse
    orb.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'touch') pulse();
    });
  }
})();

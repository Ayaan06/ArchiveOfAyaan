# ArchiveOfAyaan

Static portfolio for Ayaan Azfar. Showcases projects, write-ups, and contact info with a dark, scroll-snapped layout and matching detail pages.

## Quick start
- Open `index.html` in your browser to view the site.
- Optional: serve locally for clean relative paths (e.g., `python -m http.server 8000` then visit `http://localhost:8000`).

## What’s inside
- `index.html` — main landing page (hero, projects, certifications, experience, contact).
- `styles.css` — global styling, themes, scroll snap, cards.
- `script.js` — nav toggle, theme toggle, reveal animations.
- `assets/` — images, videos, icons, resume PDF.
- `projects/` — long-form write-ups (e.g., `campuschat.html`, `ai-tumor-detection.html`, hardware builds).

## Editing notes
- Update hero copy, skills, and CTA targets directly in `index.html`.
- Each project card links to a detail page in `projects/`; duplicate an existing file to add a new write-up.
- Keep media in `assets/images` and `assets/videos` for consistent paths.
- The site is static—no build step required. Just edit and refresh.

## Current feature highlights
- GryphChat (campus-wide messaging, NextAuth, Realtime + polling fallback)
- TumorAI (MRI classifier demo with Gradio)
- MLPicks (NBA prop intelligence engine)
- SolSync (Solana copy-trading bot)
- Hardware builds (6502 computer, VGA renderer)

## Contact
Questions or feedback? Use the links in the Contact section of `index.html` (email, GitHub, LinkedIn).

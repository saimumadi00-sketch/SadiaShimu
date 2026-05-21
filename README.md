# Mst. Sadia Afrin Shimu — Academic Portfolio

A clean, production-ready static portfolio website.

---

## File Structure

```
portfolio/
├── index.html          ← Main HTML file (all pages are single-page)
├── css/
│   └── main.css        ← All styles
├── js/
│   └── main.js         ← Navigation, animations, map
├── images/
│   ├── portrait.jpg    ← Professional portrait photo (add yours)
│   ├── gallery-1.jpg   ← Field/research photos (add 1–6)
│   ├── gallery-2.jpg
│   ├── gallery-3.jpg
│   ├── gallery-4.jpg
│   ├── gallery-5.jpg
│   ├── gallery-6.jpg
│   └── og-cover.jpg    ← Social media preview image (optional)
├── fonts/              ← (optional) Self-hosted fonts if needed
└── README.md
```

---

## How to Add Your Images

1. Place your **portrait** photo at `images/portrait.jpg`
   - Recommended: portrait crop, at least 840×1050px
2. Place **gallery/field photos** at `images/gallery-1.jpg` through `images/gallery-6.jpg`
   - Recommended: landscape, at least 900×600px
3. If images are missing, the site shows placeholder images automatically (no broken icons)

---

## How to Fill Placeholders

Search for `[` in `index.html` — every `[Add ...]` bracket is a content placeholder.
Key ones to fill:

| Placeholder | Where |
|---|---|
| `[Add thesis title]` | Education section, MSc card |
| `[Year]` graduation / study years | Education timeline |
| `[Add CGPA]` | BSc timeline card |
| `[College Name]` / `[School Name]` | HSC / SSC cards |
| `[Current Research Project Title]` | Research section |
| `[Conference Title]` | Publications section |
| `[Certificate Title]` | Skills / Certificates section |
| Gallery `[Caption]` | Gallery section |

---

## How to Deploy (Free Hosting Options)

### Option 1 — GitHub Pages (recommended, free)
1. Create a GitHub account at https://github.com
2. Create a new repository named `username.github.io`
3. Upload all files (keeping the folder structure)
4. Go to Settings → Pages → set source to `main` branch
5. Your site will be live at `https://username.github.io`

### Option 2 — Netlify (drag & drop, free)
1. Go to https://netlify.com and sign up
2. Drag your entire `portfolio/` folder onto the Netlify dashboard
3. Get a free `yourname.netlify.app` URL instantly

### Option 3 — Vercel (free)
1. Go to https://vercel.com
2. Import your GitHub repository or upload directly
3. Deploy in one click

---

## Technologies Used

- HTML5 (semantic, accessible)
- CSS3 (custom properties, grid, flexbox, animations)
- Vanilla JavaScript (no frameworks needed)
- Leaflet.js (map, loaded from CDN)
- Font Awesome 6 (icons, loaded from CDN)
- Google Fonts: Cormorant Garamond + DM Sans + DM Mono

No build tools, no npm, no dependencies to install.
Open `index.html` in any browser and it works.

---

## Customization

- **Colors**: Edit CSS variables at the top of `css/main.css` (the `:root` block)
- **Fonts**: Replace the Google Fonts link in `index.html` `<head>`
- **Map markers**: Edit the `locations` array in `js/main.js`
- **Sections**: Add or remove `<section>` blocks in `index.html`

---

© 2026 Mst. Sadia Afrin Shimu

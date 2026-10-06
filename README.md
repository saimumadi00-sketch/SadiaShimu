# Mst. Sadia Afrin Shimu — Portfolio

Static portfolio website hosted on Vercel.

**Live site:** https://sadia-shimu.vercel.app

## Structure

```
/
├── index.html          # Main portfolio page — edit content here
├── css/main.css        # All styles
├── js/main.js          # All scripts
├── images/             # Portrait and gallery photos
│   ├── portrait.jpg    # Profile photo
│   └── gallery/        # Gallery photo folders
├── certificates/       # Certificate images
├── cv.pdf              # Downloadable CV
├── favicon.svg/.ico    # Site icon
├── robots.txt
├── sitemap.xml
└── vercel.json         # Vercel deployment config
```

## Updating content

Edit `index.html` for portfolio content. Gallery albums, captions, and map markers live in `js/main.js`; album covers use photos from `images/gallery/`.

The theme button cycles System, Light, and Dark. System follows device settings; explicit choices are saved locally.

Citation totals come from Crossref for the three journal articles. An unavailable total displays a dash rather than a partial count.

Run regression checks with `node --test tests/regressions.test.cjs`.

## Deployment

Hosted on Vercel. Push to `master` → auto-deploys.

/* ============================================================
   MST. SADIA AFRIN SHIMU — ACADEMIC PORTFOLIO
   main.js — Navigation, scroll reveals, image fallbacks, Leaflet map
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {
  const galleryFallbackColors = ['e8dfc9', 'd8e2d4', 'cfd7c3', 'efe3c5', 'dde4d6', 'e5dcc5'];
  const staticMapMarkers = [
    { lat: 23.7337, lng: 90.3925, title: 'Jagannath University, Dhaka', desc: 'Home institution — BSc & MSc in Zoology' },
    { lat: 21.9497, lng: 89.1833, title: 'Sundarbans', desc: 'Mangrove biodiversity & field ecology research' },
    { lat: 22.8456, lng: 89.5403, title: 'Jessore / Southwest Bangladesh', desc: 'Primate survey and conservation outreach area' },
    { lat: 24.3745, lng: 88.6042, title: 'Rajshahi Division', desc: 'Biodiversity field documentation site' },
    { lat: 22.3569, lng: 91.7832, title: 'Chittagong Hill Tracts', desc: 'Forest primate habitat survey area' }
  ];

  /* ── NAVBAR SCROLL BEHAVIOR ────────────────────────────── */
  const staticGalleryAlbums = [
    {
      id: 'static-general',
      name: 'General',
      featured: true,
      cover_filename: 'gallery-1.jpg',
      photos: [
        { id: 'static-ph1', filename: 'gallery-1.jpg', caption: 'Field photo will be added soon.' },
        { id: 'static-ph2', filename: 'gallery-2.jpg', caption: 'Field photo will be added soon.' },
        { id: 'static-ph3', filename: 'gallery-3.jpg', caption: 'Field photo will be added soon.' },
        { id: 'static-ph4', filename: 'gallery-4.jpg', caption: 'Field photo will be added soon.' },
        { id: 'static-ph5', filename: 'gallery-5.jpg', caption: 'Field photo will be added soon.' },
        { id: 'static-ph6', filename: 'gallery-6.jpg', caption: 'Field photo will be added soon.' }
      ]
    }
  ];
  let galleryAlbums = staticGalleryAlbums;
  let activeAlbumIndex = 0;
  let activePhotoIndex = 0;
  let touchStartX = null;

  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', function () {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  /* ── HAMBURGER MENU ───────────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
      navLinks.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', navLinks.classList.contains('open'));
    });

    // Close menu when a link is clicked
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });

    // Close menu on outside click
    document.addEventListener('click', function (e) {
      if (!navbar.contains(e.target)) {
        navLinks.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ── SCROLL REVEAL ─────────────────────────────────────── */
  const revealElements = document.querySelectorAll('.reveal');

  // Kick off hero reveals immediately (already in view on load)
  function revealHero() {
    document.querySelectorAll('#hero .reveal').forEach(function (el) {
      el.classList.add('visible');
    });
  }

  const revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealElements.forEach(function (el) {
    // Skip hero elements — they're handled separately
    if (!el.closest('#hero')) {
      revealObserver.observe(el);
    }
  });

  // Short delay so the page is painted before hero animates
  setTimeout(revealHero, 80);

  /* ── ACTIVE NAV LINK HIGHLIGHT ─────────────────────────── */
  const sections = document.querySelectorAll('section[id], div[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');

  const sectionObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navAnchors.forEach(function (a) {
            a.classList.toggle('active', a.getAttribute('href') === '#' + id);
          });
        }
      });
    },
    { rootMargin: '-30% 0px -60% 0px' }
  );

  sections.forEach(function (s) { sectionObserver.observe(s); });

  /* ── IMAGE FALLBACKS ───────────────────────────────────── */
  const portrait = document.getElementById('portrait-img');
  if (portrait) {
    portrait.addEventListener('error', function () {
      portrait.onerror = null;
      portrait.src = 'https://placehold.co/840x1050/dde8dc/1e3d29?text=Sadia+Afrin+Shimu';
    });
  }

  function attachGalleryFallbacks(scope) {
    (scope || document).querySelectorAll('.gallery-item img, .gallery-album-cover img, .gallery-lightbox-image').forEach(function (img, i) {
      if (img.dataset.fallbackBound === 'true') return;
      img.dataset.fallbackBound = 'true';
      img.addEventListener('error', function () {
        img.onerror = null;
        img.src = 'https://placehold.co/900x600/' + galleryFallbackColors[i % galleryFallbackColors.length] + '/183326?text=Field+Photo';
      });
    });
  }

  attachGalleryFallbacks(document);

  function photoCountText(count) {
    return count + ' ' + (count === 1 ? 'photo' : 'photos');
  }

  function albumCover(album) {
    if (!album) return '';
    if (album.cover_filename) return album.cover_filename;
    if (Array.isArray(album.photos) && album.photos[0]) return album.photos[0].filename;
    return '';
  }

  function imageSrc(filename) {
    return filename ? '/images/' + encodeURIComponent(filename) : 'https://placehold.co/900x600/e8dfc9/183326?text=Field+Photo';
  }

  function bindGalleryAlbumCards(scope) {
    (scope || document).querySelectorAll('[data-gallery-album-index]').forEach(function (card) {
      if (card.dataset.albumBound === 'true') return;
      card.dataset.albumBound = 'true';
      card.addEventListener('click', function () {
        openGalleryLightbox(Number(card.dataset.galleryAlbumIndex) || 0, 0);
      });
    });
  }

  function ensureGalleryLightbox() {
    let lightbox = document.getElementById('gallery-lightbox');
    if (lightbox) return lightbox;

    lightbox = document.createElement('div');
    lightbox.id = 'gallery-lightbox';
    lightbox.className = 'gallery-lightbox';
    lightbox.setAttribute('aria-hidden', 'true');
    lightbox.innerHTML = '' +
      '<div class="gallery-lightbox-header">' +
        '<h3 class="gallery-lightbox-title"></h3>' +
        '<button class="gallery-lightbox-close" type="button" aria-label="Close gallery">&times;</button>' +
      '</div>' +
      '<div class="gallery-lightbox-body">' +
        '<button class="gallery-lightbox-arrow gallery-lightbox-prev" type="button" aria-label="Previous photo">&#8249;</button>' +
        '<img class="gallery-lightbox-image" alt="" />' +
        '<button class="gallery-lightbox-arrow gallery-lightbox-next" type="button" aria-label="Next photo">&#8250;</button>' +
      '</div>' +
      '<div class="gallery-lightbox-footer">' +
        '<p class="gallery-lightbox-caption"></p>' +
        '<p class="gallery-lightbox-counter"></p>' +
      '</div>';
    document.body.appendChild(lightbox);

    lightbox.querySelector('.gallery-lightbox-close').addEventListener('click', closeGalleryLightbox);
    lightbox.querySelector('.gallery-lightbox-prev').addEventListener('click', function () { moveGalleryPhoto(-1); });
    lightbox.querySelector('.gallery-lightbox-next').addEventListener('click', function () { moveGalleryPhoto(1); });
    lightbox.addEventListener('click', function (event) {
      if (event.target === lightbox) closeGalleryLightbox();
    });
    lightbox.addEventListener('touchstart', function (event) {
      touchStartX = event.touches && event.touches[0] ? event.touches[0].clientX : null;
    }, { passive: true });
    lightbox.addEventListener('touchend', function (event) {
      if (touchStartX === null || !event.changedTouches || !event.changedTouches[0]) return;
      const delta = event.changedTouches[0].clientX - touchStartX;
      touchStartX = null;
      if (Math.abs(delta) < 45) return;
      moveGalleryPhoto(delta < 0 ? 1 : -1);
    }, { passive: true });

    return lightbox;
  }

  function openGalleryLightbox(albumIndex, photoIndex) {
    const album = galleryAlbums[albumIndex];
    if (!album || !Array.isArray(album.photos) || album.photos.length === 0) return;

    activeAlbumIndex = albumIndex;
    activePhotoIndex = Math.max(0, Math.min(photoIndex, album.photos.length - 1));

    const lightbox = ensureGalleryLightbox();
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    updateGalleryLightbox();
  }

  function closeGalleryLightbox() {
    const lightbox = document.getElementById('gallery-lightbox');
    if (!lightbox) return;
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function moveGalleryPhoto(delta) {
    const album = galleryAlbums[activeAlbumIndex];
    if (!album || !Array.isArray(album.photos) || album.photos.length === 0) return;

    activePhotoIndex = (activePhotoIndex + delta + album.photos.length) % album.photos.length;
    updateGalleryLightbox();
  }

  function updateGalleryLightbox() {
    const lightbox = ensureGalleryLightbox();
    const album = galleryAlbums[activeAlbumIndex];
    const photo = album.photos[activePhotoIndex];
    const image = lightbox.querySelector('.gallery-lightbox-image');
    const caption = lightbox.querySelector('.gallery-lightbox-caption');

    lightbox.querySelector('.gallery-lightbox-title').textContent = album.name || 'Album';
    image.src = imageSrc(photo.filename);
    image.alt = photo.caption || album.name || 'Gallery photo';
    caption.textContent = photo.caption || '';
    caption.style.visibility = photo.caption ? 'visible' : 'hidden';
    lightbox.querySelector('.gallery-lightbox-counter').textContent = (activePhotoIndex + 1) + ' / ' + album.photos.length;
    attachGalleryFallbacks(lightbox);
  }

  document.addEventListener('keydown', function (event) {
    const lightbox = document.getElementById('gallery-lightbox');
    if (!lightbox || !lightbox.classList.contains('open')) return;

    if (event.key === 'Escape') closeGalleryLightbox();
    if (event.key === 'ArrowLeft') moveGalleryPhoto(-1);
    if (event.key === 'ArrowRight') moveGalleryPhoto(1);
  });

  bindGalleryAlbumCards(document);

  /* ── LEAFLET MAP ───────────────────────────────────────── */
  function initMap() {
    const mapEl = document.getElementById('map');

    if (!mapEl || window.portfolioMap || typeof L === 'undefined') {
      return;
    }

    const map = L.map('map', {
      center: [23.7, 90.4],
      zoom: 7,
      scrollWheelZoom: false,
      zoomControl: true
    });

    window.portfolioMap = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 18
    }).addTo(map);

    window.portfolioMarkerLayer = L.layerGroup().addTo(map);
    window.portfolioMarkerIcons = {
      forest: createMarkerIcon('#2d5a3d'),
      research: createMarkerIcon('#b8852a')
    };

    renderMapMarkers(staticMapMarkers);
  }

  function createMarkerIcon(color) {
    return L.divIcon({
      html: '<div style="width:14px;height:14px;border-radius:50%;background:' + color + ';border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3)"></div>',
      className: '',
      iconSize: [14, 14],
      iconAnchor: [7, 7],
      popupAnchor: [0, -10]
    });
  }

  function renderMapMarkers(markers) {
    if (!window.portfolioMap || !window.portfolioMarkerLayer || typeof L === 'undefined' || !Array.isArray(markers)) return;

    window.portfolioMarkerLayer.clearLayers();

    markers.forEach(function (marker, index) {
      const lat = Number(marker.lat);
      const lng = Number(marker.lng);
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

      const icon = index === 0
        ? window.portfolioMarkerIcons.forest
        : window.portfolioMarkerIcons.research;

      L.marker([lat, lng], { icon: icon })
        .addTo(window.portfolioMarkerLayer)
        .bindPopup(
          '<strong style="font-family:Georgia,serif;font-size:14px;color:#1e3d29">' + escapeHtml(marker.title) + '</strong>' +
          '<p style="font-size:12px;color:#6b7063;margin:4px 0 0">' + escapeHtml(marker.desc || marker.description) + '</p>',
          { maxWidth: 220 }
        );
    });
  }

  initMap();
  window.addEventListener('load', initMap);

  /* ── SMOOTH SCROLL OFFSET FOR FIXED NAVBAR ─────────────── */
  function bindSmoothScrollLinks(scope) {
    (scope || document).querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      if (anchor.dataset.smoothBound === 'true') return;
      anchor.dataset.smoothBound = 'true';
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (!href || href === '#') return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        const offset = 78; // navbar height
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      });
    });
  }

  bindSmoothScrollLinks(document);

  /* ── STATIC-SAFE RENDER HELPERS ────────────────────────── */
  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function renderConference(items, container) {
    if (!container || !Array.isArray(items)) return;

    container.innerHTML = items.map(function (item) {
      const line = [item.organizer, item.location, item.year].filter(Boolean).join(' · ');
      return '' +
        '<div class="conference-icon"><i class="fa-solid fa-chalkboard-user"></i></div>' +
        '<div>' +
          '<h4>' + escapeHtml(item.title) + '</h4>' +
          '<p>' + escapeHtml(line) + '</p>' +
          '<p><strong>Role:</strong> ' + escapeHtml(item.role) + ' &nbsp;|&nbsp; <strong>Topic:</strong> ' + escapeHtml(item.topic) + '</p>' +
        '</div>';
    }).join('');
  }

  async function cmsGet(path) {
    try {
      const res = await fetch('/api/content' + path);
      if (!res.ok) return null;
      return await res.json();
    } catch (error) {
      return null;
    }
  }

  function isExternalUrl(url) {
    return /^https?:\/\//i.test(String(url || ''));
  }

  function externalAttrs(url) {
    return isExternalUrl(url) ? ' target="_blank" rel="noopener noreferrer"' : '';
  }

  function iconForBadge(badge) {
    const value = String(badge || '');

    if (value.indexOf('MSc') !== -1) return 'fa-graduation-cap';
    if (value.indexOf('BSc') !== -1) return 'fa-microscope';
    if (value.indexOf('Higher') !== -1) return 'fa-school';

    return 'fa-book';
  }

  function renderHero(data) {
    if (!data) return;

    const eyebrow = document.querySelector('[data-cms="hero-eyebrow"]');
    const tagline = document.querySelector('[data-cms="hero-tagline"]');
    const stats = document.querySelector('[data-cms="hero-stats"]');

    if (eyebrow && data.eyebrow) {
      eyebrow.textContent = data.eyebrow;
    }

    if (tagline && data.tagline) {
      tagline.textContent = data.tagline;
    }

    if (stats && Array.isArray(data.stats) && data.stats.length > 0) {
      stats.innerHTML = data.stats.map(function (item, index) {
        const divider = index < data.stats.length - 1 ? '<div class="stat-divider"></div>' : '';
        return '' +
          '<div class="stat">' +
            '<span class="stat-num">' + escapeHtml(item.num) + '</span>' +
            '<span class="stat-label">' + escapeHtml(item.label) + '</span>' +
          '</div>' +
          divider;
      }).join('');
    }
  }

  function renderAbout(data) {
    if (!data) return;

    const bio = document.querySelector('[data-cms="about-bio"]');
    const details = document.querySelector('[data-cms="about-details"]');

    if (bio && Array.isArray(data.bio_paragraphs) && data.bio_paragraphs.length > 0) {
      bio.querySelectorAll(':scope > p').forEach(function (paragraph) {
        paragraph.remove();
      });

      const fragment = document.createDocumentFragment();
      data.bio_paragraphs.forEach(function (text, index) {
        const paragraph = document.createElement('p');
        if (index === 0) paragraph.className = 'about-lead';
        paragraph.textContent = text;
        fragment.appendChild(paragraph);
      });

      bio.insertBefore(fragment, bio.firstChild);
    }

    if (details && Array.isArray(data.details) && data.details.length > 0) {
      details.innerHTML = data.details.map(function (item) {
        return '' +
          '<div class="detail-row">' +
            '<span class="detail-label">' + escapeHtml(item.label) + '</span>' +
            '<span>' + escapeHtml(item.value) + '</span>' +
          '</div>';
      }).join('');
    }
  }

  function renderEducation(items) {
    const container = document.querySelector('[data-cms="education-list"]');
    if (!container || !Array.isArray(items) || items.length === 0) return;

    container.innerHTML = items.map(function (item) {
      const details = Array.isArray(item.details) ? item.details : [];
      const year = item.year ? ' &middot; ' + escapeHtml(item.year) : '';
      const meta = item.institution
        ? escapeHtml(item.institution) + year
        : escapeHtml(item.year);

      return '' +
        '<div class="timeline-item">' +
          '<div class="timeline-marker">' +
            '<i class="fa-solid ' + iconForBadge(item.badge) + '"></i>' +
          '</div>' +
          '<div class="timeline-card">' +
            '<p class="timeline-badge">' + escapeHtml(item.badge) + '</p>' +
            '<h3>' + escapeHtml(item.degree) + '</h3>' +
            '<p class="timeline-meta">' + meta + '</p>' +
            '<ul class="timeline-details">' +
              details.map(function (detail) {
                if (detail && typeof detail === 'object') {
                  return '<li><strong>' + escapeHtml(detail.label) + ':</strong> ' + escapeHtml(detail.value) + '</li>';
                }

                return '<li>' + escapeHtml(detail) + '</li>';
              }).join('') +
            '</ul>' +
          '</div>' +
        '</div>';
    }).join('');
  }

  function renderResearch(items) {
    const container = document.querySelector('[data-cms="research-grid"]');
    if (!container || !Array.isArray(items) || items.length === 0) return;

    container.innerHTML = items.map(function (item) {
      const tag = String(item.tag || '');
      const cardClass = item.featured ? 'research-card research-card--featured' : 'research-card';
      const tagClass = tag === 'Past'
        ? 'research-card-tag research-card-tag--past'
        : 'research-card-tag';
      const years = item.year_end === 'Present'
        ? escapeHtml(item.year_start) + ' &ndash; Present'
        : escapeHtml(item.year_start) + '&ndash;' + escapeHtml(item.year_end);

      return '' +
        '<article class="' + cardClass + '">' +
          '<div class="' + tagClass + '">' + escapeHtml(tag) + '</div>' +
          '<h3>' + escapeHtml(item.title) + '</h3>' +
          '<p>' + escapeHtml(item.description) + '</p>' +
          '<div class="research-meta">' +
            '<span><i class="fa-solid fa-location-dot"></i> ' + escapeHtml(item.location) + '</span>' +
            '<span><i class="fa-solid fa-calendar"></i> ' + years + '</span>' +
          '</div>' +
        '</article>';
    }).join('');
  }

  function renderPublications(items) {
    const container = document.querySelector('[data-cms="pub-list"]');
    if (!container || !Array.isArray(items) || items.length === 0) return;

    container.innerHTML = items.map(function (item) {
      const href = item.url || '#';

      return '' +
        '<a href="' + escapeHtml(href) + '" target="_blank" rel="noopener noreferrer" class="pub-item">' +
          '<div class="pub-number">' + escapeHtml(item.number) + '</div>' +
          '<div class="pub-body">' +
            '<h3>' + escapeHtml(item.title) + '</h3>' +
            '<p class="pub-meta">' +
              '<span class="pub-journal">' + escapeHtml(item.journal) + '</span> &middot; ' + escapeHtml(item.year) +
            '</p>' +
            '<p class="pub-type">' +
              '<i class="fa-solid fa-file-lines"></i> ' + escapeHtml(item.type) +
            '</p>' +
          '</div>' +
          '<div class="pub-arrow">' +
            '<i class="fa-solid fa-arrow-up-right-from-square"></i>' +
          '</div>' +
        '</a>';
    }).join('');
  }

  function renderFieldCards(items) {
    const container = document.querySelector('[data-cms="field-cards"]');
    if (!container || !Array.isArray(items) || items.length === 0) return;

    container.innerHTML = items.map(function (item) {
      return '' +
        '<div class="field-card">' +
          '<div class="field-icon">' +
            '<i class="fa-solid ' + escapeHtml(item.icon) + '"></i>' +
          '</div>' +
          '<h3>' + escapeHtml(item.title) + '</h3>' +
          '<p>' + escapeHtml(item.description) + '</p>' +
        '</div>';
    }).join('');
  }

  function renderSkills(data) {
    const container = document.querySelector('[data-cms="skills-groups"]');
    if (!container || !data || !Array.isArray(data.groups) || data.groups.length === 0) return;

    container.innerHTML = data.groups.map(function (group) {
      const items = Array.isArray(group.items) ? group.items : [];

      return '' +
        '<div class="skills-group">' +
          '<h3>' +
            '<i class="fa-solid ' + escapeHtml(group.icon) + '"></i> ' + escapeHtml(group.heading) +
          '</h3>' +
          '<ul>' +
            items.map(function (item) {
              return '<li>' + escapeHtml(item) + '</li>';
            }).join('') +
          '</ul>' +
        '</div>';
    }).join('');
  }

  function renderCertificates(items) {
    const container = document.querySelector('[data-cms="certificates-grid"]');
    if (!container || !Array.isArray(items) || items.length === 0) return;

    container.innerHTML = items.map(function (item) {
      const href = item.url || '#';
      const small = (item.issuer || '') + (item.issuer && item.year ? ' &middot; ' : '') + (item.year || '');

      return '' +
        '<a href="' + escapeHtml(href) + '" target="_blank" rel="noopener noreferrer" class="cert-card">' +
          '<i class="' + escapeHtml(item.icon) + '"></i>' +
          '<span>' + escapeHtml(item.title) + '</span>' +
          '<small>' + escapeHtml(small) + '</small>' +
        '</a>';
    }).join('');
  }

  function renderLeadership(items) {
    const container = document.querySelector('[data-cms="leadership-grid"]');
    if (!container || !Array.isArray(items) || items.length === 0) return;

    container.innerHTML = items.map(function (item) {
      return '' +
        '<div class="leadership-card">' +
          '<div class="leadership-icon">' +
            '<i class="fa-solid ' + escapeHtml(item.icon) + '"></i>' +
          '</div>' +
          '<h3>' + escapeHtml(item.title) + '</h3>' +
          '<p>' + escapeHtml(item.description) + '</p>' +
        '</div>';
    }).join('');
  }

  function renderGallery(albums) {
    const container = document.querySelector('[data-cms="gallery-grid"]');
    if (!container || !Array.isArray(albums) || albums.length === 0) return;

    galleryAlbums = albums.map(function (album) {
      const photos = Array.isArray(album.photos) ? album.photos : [];
      return {
        id: album.id,
        name: album.name || 'Album',
        cover_filename: albumCover(album),
        photos: photos
      };
    }).filter(function (album) {
      return album.photos.length > 0;
    });

    if (galleryAlbums.length === 0) return;

    container.innerHTML = galleryAlbums.map(function (album, index) {
      const cover = albumCover(album);
      const cardClass = 'gallery-album-card' + (index === 0 ? ' gallery-album-card--featured' : '');
      return '' +
        '<button class="' + cardClass + '" type="button" data-gallery-album-index="' + index + '">' +
          '<span class="gallery-album-cover">' +
            '<img src="' + imageSrc(cover) + '" alt="' + escapeHtml(album.name) + ' cover" loading="lazy" />' +
          '</span>' +
          '<span class="gallery-album-body">' +
            '<span class="gallery-album-title">' + escapeHtml(album.name) + '</span>' +
            '<span class="gallery-album-count">' + photoCountText(album.photos.length) + '</span>' +
          '</span>' +
        '</button>';
    }).join('');

    attachGalleryFallbacks(container);
    bindGalleryAlbumCards(container);
  }

  function renderContact(data) {
    if (!data) return;

    const title = document.querySelector('[data-cms="contact-title"]');
    const subtitle = document.querySelector('[data-cms="contact-subtitle"]');
    const items = document.querySelector('[data-cms="contact-items"]');

    if (title && data.title) {
      title.textContent = data.title;
    }

    if (subtitle && data.subtitle) {
      subtitle.textContent = data.subtitle;
    }

    if (items && Array.isArray(data.items) && data.items.length > 0) {
      items.innerHTML = data.items.map(function (item) {
        const href = item.url || '#';

        return '' +
          '<a href="' + escapeHtml(href) + '"' + externalAttrs(href) + ' class="contact-item">' +
            '<div class="contact-item-icon">' +
              '<i class="' + escapeHtml(item.icon) + '"></i>' +
            '</div>' +
            '<div>' +
              '<strong>' + escapeHtml(item.label) + '</strong>' +
              '<span>' + escapeHtml(item.value) + '</span>' +
            '</div>' +
          '</a>';
      }).join('');
    }
  }

  async function loadCmsContent() {
    const endpoints = [
      '/hero', '/about', '/education', '/research',
      '/publications', '/conference', '/field-cards',
      '/skills', '/certificates', '/leadership',
      '/albums', '/contact', '/map-markers'
    ];

    const results = await Promise.all(
      endpoints.map(function (ep) {
        return cmsGet(ep);
      })
    );

    const [
      hero, about, education, research,
      publications, conference, fieldCards,
      skills, certificates, leadership,
      albums, contact, mapMarkers
    ] = results;

    if (hero) renderHero(hero);
    if (about) renderAbout(about);
    if (education) renderEducation(education);
    if (research) renderResearch(research);
    if (publications) renderPublications(publications);
    if (conference) {
      renderConference(
        conference,
        document.querySelector('[data-cms="conference-list"]')
      );
    }
    if (fieldCards) renderFieldCards(fieldCards);
    if (skills) renderSkills(skills);
    if (certificates) renderCertificates(certificates);
    if (leadership) renderLeadership(leadership);
    if (albums) renderGallery(albums);
    if (contact) renderContact(contact);
    if (mapMarkers && window.portfolioMap) {
      renderMapMarkers(mapMarkers);
    } else if (mapMarkers) {
      window.addEventListener('load', function () {
        if (window.portfolioMap) renderMapMarkers(mapMarkers);
      });
    }
  }

  loadCmsContent();
});

/* ============================================================
   MST. SADIA AFRIN SHIMU — ACADEMIC PORTFOLIO
   main.js — Navigation, scroll reveals, Leaflet map, CMS rendering
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {
  const galleryFallbackColors = ['e8dfc9','d8e2d4','cfd7c3','efe3c5','dde4d6','e5dcc5'];

  const cmsTargets = {
    heroEyebrow: document.querySelector('[data-cms="hero-eyebrow"]'),
    heroTagline: document.querySelector('[data-cms="hero-tagline"]'),
    heroStats: document.querySelector('[data-cms="hero-stats"]'),
    aboutBio: document.querySelector('[data-cms="about-bio"]'),
    aboutDetails: document.querySelector('[data-cms="about-details"]'),
    educationList: document.querySelector('[data-cms="education-list"]'),
    researchGrid: document.querySelector('[data-cms="research-grid"]'),
    pubList: document.querySelector('[data-cms="pub-list"]'),
    conferenceList: document.querySelector('[data-cms="conference-list"]'),
    fieldCards: document.querySelector('[data-cms="field-cards"]'),
    skillsGroups: document.querySelector('[data-cms="skills-groups"]'),
    certificatesGrid: document.querySelector('[data-cms="certificates-grid"]'),
    leadershipGrid: document.querySelector('[data-cms="leadership-grid"]'),
    galleryGrid: document.querySelector('[data-cms="gallery-grid"]'),
    contactTitle: document.querySelector('[data-cms="contact-title"]'),
    contactSubtitle: document.querySelector('[data-cms="contact-subtitle"]'),
    contactItems: document.querySelector('[data-cms="contact-items"]')
  };

  const aboutLinksHtml = cmsTargets.aboutBio
    ? (cmsTargets.aboutBio.querySelector('.about-links') || {}).outerHTML || ''
    : '';

  /* ── NAVBAR SCROLL BEHAVIOR ────────────────────────────── */
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

  /* ── PORTRAIT FALLBACK ─────────────────────────────────── */
  const portrait = document.getElementById('portrait-img');
  if (portrait) {
    portrait.addEventListener('error', function () {
      portrait.src = 'https://placehold.co/840x1050/dde8dc/1e3d29?text=Portrait+Photo';
    });
  }

  /* ── GALLERY IMAGE FALLBACKS ───────────────────────────── */
  function attachGalleryFallbacks(scope) {
    (scope || document).querySelectorAll('.gallery-item img').forEach(function (img, i) {
      if (img.dataset.fallbackBound === 'true') return;
      img.dataset.fallbackBound = 'true';
      img.addEventListener('error', function () {
        img.onerror = null;
        img.src = 'https://placehold.co/900x600/' + galleryFallbackColors[i % galleryFallbackColors.length] + '/183326?text=Field+Photo';
      });
    });
  }

  attachGalleryFallbacks(document);

  /* ── LEAFLET MAP ───────────────────────────────────────── */
  const mapEl = document.getElementById('map');
  if (mapEl && typeof L !== 'undefined') {
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

    renderMapMarkers([
      { lat: 23.7337, lng: 90.3925, title: 'Jagannath University, Dhaka', desc: 'Home institution — BSc & MSc in Zoology' },
      { lat: 21.9497, lng: 89.1833, title: 'Sundarbans', desc: 'Mangrove biodiversity & field ecology research' },
      { lat: 22.8456, lng: 89.5403, title: 'Jessore / Southwest Bangladesh', desc: 'Primate survey and conservation outreach area' },
      { lat: 24.3745, lng: 88.6042, title: 'Rajshahi Division', desc: 'Biodiversity field documentation site' },
      { lat: 22.3569, lng: 91.7832, title: 'Chittagong Hill Tracts', desc: 'Forest primate habitat survey area' }
    ]);

  } else if (mapEl) {
    // Leaflet not available yet — retry once
    window.addEventListener('load', function () {
      if (typeof L !== 'undefined') {
        // Re-trigger the map section by reloading the page isn't ideal;
        // instead just show a fallback message
      }
    });
  }

  hydrateFromCms();

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

  /* ── CMS DATA LOADING ──────────────────────────────────── */
  function hydrateFromCms() {
    const requests = [
      ['hero', '/api/content/hero'],
      ['about', '/api/content/about'],
      ['education', '/api/content/education'],
      ['research', '/api/content/research'],
      ['publications', '/api/content/publications'],
      ['conference', '/api/content/conference'],
      ['field-cards', '/api/content/field-cards'],
      ['map-markers', '/api/content/map-markers'],
      ['skills', '/api/content/skills'],
      ['certificates', '/api/content/certificates'],
      ['leadership', '/api/content/leadership'],
      ['gallery', '/api/content/gallery'],
      ['contact', '/api/content/contact']
    ];

    Promise.allSettled(requests.map(function (entry) {
      return fetch(entry[1], { credentials: 'include' }).then(function (response) {
        if (!response.ok) throw new Error(entry[0] + ' request failed');
        return response.json();
      });
    })).then(function (results) {
      results.forEach(function (result, index) {
        if (result.status !== 'fulfilled') return;
        renderCmsSection(requests[index][0], result.value);
      });
      attachGalleryFallbacks(document);
      bindSmoothScrollLinks(document);
    }).catch(function () {
      // If the CMS is unreachable, keep the static HTML fallback untouched.
    });
  }

  function renderCmsSection(section, data) {
    try {
      if (section === 'hero') renderHero(data, cmsTargets);
      if (section === 'about') renderAbout(data, cmsTargets);
      if (section === 'education') renderEducation(data, cmsTargets.educationList);
      if (section === 'research') renderResearch(data, cmsTargets.researchGrid);
      if (section === 'publications') renderPublications(data, cmsTargets.pubList);
      if (section === 'conference') renderConference(data, cmsTargets.conferenceList);
      if (section === 'field-cards') renderFieldCards(data, cmsTargets.fieldCards);
      if (section === 'map-markers') renderMapMarkers(data);
      if (section === 'skills') renderSkills(data, cmsTargets.skillsGroups);
      if (section === 'certificates') renderCertificates(data, cmsTargets.certificatesGrid);
      if (section === 'leadership') renderLeadership(data, cmsTargets.leadershipGrid);
      if (section === 'gallery') renderGallery(data, cmsTargets.galleryGrid);
      if (section === 'contact') renderContact(data, cmsTargets);
    } catch (error) {
      // Keep the matching static section if a single renderer receives unexpected data.
    }
  }

  /* ── CMS RENDER HELPERS ────────────────────────────────── */
  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function text(value) {
    return value == null ? '' : String(value);
  }

  function iconClass(icon, fallback) {
    const value = text(icon).trim();
    if (!value) return fallback || 'fa-solid fa-leaf';
    if (value.indexOf('fa-solid') !== -1 || value.indexOf('fa-regular') !== -1 || value.indexOf('fa-brands') !== -1) {
      return value;
    }
    return (fallback && fallback.split(' ')[0] ? fallback.split(' ')[0] : 'fa-solid') + ' ' + value;
  }

  function linkAttrs(url) {
    const href = text(url) || '#';
    if (href.indexOf('http://') === 0 || href.indexOf('https://') === 0) {
      return ' target="_blank" rel="noopener"';
    }
    return '';
  }

  function yearRange(item) {
    const start = text(item.year_start).trim();
    const end = text(item.year_end).trim();
    if (start && end && start !== end) return start + ' – ' + end;
    if (start) return start;
    if (end) return end;
    return text(item.year);
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

  function renderHero(data, targets) {
    if (!data) return;

    if (targets.heroEyebrow && data.eyebrow != null) {
      targets.heroEyebrow.textContent = data.eyebrow;
    }

    if (targets.heroTagline && data.tagline != null) {
      targets.heroTagline.textContent = data.tagline;
    }

    if (targets.heroStats && Array.isArray(data.stats)) {
      targets.heroStats.innerHTML = data.stats.map(function (stat, index) {
        const statHtml =
          '<div class="stat">' +
            '<span class="stat-num">' + escapeHtml(stat.num) + '</span>' +
            '<span class="stat-label">' + escapeHtml(stat.label) + '</span>' +
          '</div>';
        return index < data.stats.length - 1 ? statHtml + '<div class="stat-divider"></div>' : statHtml;
      }).join('');
    }
  }

  function renderAbout(data, targets) {
    if (!data) return;

    if (targets.aboutBio && Array.isArray(data.bio_paragraphs)) {
      targets.aboutBio.innerHTML = data.bio_paragraphs.map(function (paragraph, index) {
        const className = index === 0 ? ' class="about-lead"' : '';
        return '<p' + className + '>' + escapeHtml(paragraph) + '</p>';
      }).join('') + aboutLinksHtml;
    }

    if (targets.aboutDetails && Array.isArray(data.details)) {
      targets.aboutDetails.innerHTML = data.details.map(function (detail) {
        return '<div class="detail-row"><span class="detail-label">' + escapeHtml(detail.label) + '</span><span>' + escapeHtml(detail.value) + '</span></div>';
      }).join('');
    }
  }

  function renderEducation(items, container) {
    if (!container || !Array.isArray(items)) return;
    const icons = ['fa-graduation-cap', 'fa-microscope', 'fa-school', 'fa-book'];

    container.innerHTML = items.map(function (item, index) {
      const meta = [item.institution, item.year].filter(Boolean).join(' · ');
      const details = Array.isArray(item.details) && item.details.length
        ? '<ul class="timeline-details">' + item.details.map(function (detail) {
            if (typeof detail === 'string') return '<li>' + escapeHtml(detail) + '</li>';
            const label = text(detail.label).trim();
            const value = text(detail.value || detail.text).trim();
            return '<li>' + (label ? '<strong>' + escapeHtml(label) + ':</strong> ' : '') + escapeHtml(value) + '</li>';
          }).join('') + '</ul>'
        : '';

      return '' +
        '<div class="timeline-item">' +
          '<div class="timeline-marker"><i class="fa-solid ' + icons[index % icons.length] + '"></i></div>' +
          '<div class="timeline-card">' +
            '<p class="timeline-badge">' + escapeHtml(item.badge) + '</p>' +
            '<h3>' + escapeHtml(item.degree) + '</h3>' +
            '<p class="timeline-meta">' + escapeHtml(meta) + '</p>' +
            details +
          '</div>' +
        '</div>';
    }).join('');
  }

  function renderResearch(items, container) {
    if (!container || !Array.isArray(items)) return;

    container.innerHTML = items.map(function (item) {
      const featured = Boolean(item.featured);
      const cardClass = featured ? 'research-card research-card--featured' : 'research-card';
      const tagClass = featured ? 'research-card-tag' : 'research-card-tag research-card-tag--past';
      return '' +
        '<article class="' + cardClass + '">' +
          '<div class="' + tagClass + '">' + escapeHtml(item.tag) + '</div>' +
          '<h3>' + escapeHtml(item.title) + '</h3>' +
          '<p>' + escapeHtml(item.description) + '</p>' +
          '<div class="research-meta">' +
            '<span><i class="fa-solid fa-location-dot"></i> ' + escapeHtml(item.location) + '</span>' +
            '<span><i class="fa-solid fa-calendar"></i> ' + escapeHtml(yearRange(item)) + '</span>' +
          '</div>' +
        '</article>';
    }).join('');
  }

  function renderPublications(items, container) {
    if (!container || !Array.isArray(items)) return;

    container.innerHTML = items.map(function (item, index) {
      const number = text(item.number) || String(index + 1).padStart(2, '0');
      const href = text(item.url) || '#';
      return '' +
        '<a href="' + escapeHtml(href) + '"' + linkAttrs(href) + ' class="pub-item">' +
          '<div class="pub-number">' + escapeHtml(number) + '</div>' +
          '<div class="pub-body">' +
            '<h3>' + escapeHtml(item.title) + '</h3>' +
            '<p class="pub-meta"><span class="pub-journal">' + escapeHtml(item.journal) + '</span> · ' + escapeHtml(item.year) + '</p>' +
            '<p class="pub-type"><i class="fa-solid fa-file-lines"></i> ' + escapeHtml(item.type) + '</p>' +
          '</div>' +
          '<div class="pub-arrow"><i class="fa-solid fa-arrow-up-right-from-square"></i></div>' +
        '</a>';
    }).join('');
  }

  function renderConference(items, container) {
    if (!container || !Array.isArray(items)) return;

    container.outerHTML = items.map(function (item) {
        const line = [item.organizer, item.location, item.year].filter(Boolean).join(' · ');
        return '' +
          '<div class="conference-card">' +
            '<div class="conference-icon"><i class="fa-solid fa-chalkboard-user"></i></div>' +
            '<div>' +
              '<h4>' + escapeHtml(item.title) + '</h4>' +
              '<p>' + escapeHtml(line) + '</p>' +
              '<p><strong>Role:</strong> ' + escapeHtml(item.role) + ' &nbsp;|&nbsp; <strong>Topic:</strong> ' + escapeHtml(item.topic) + '</p>' +
            '</div>' +
          '</div>';
      }).join('');
  }

  function renderFieldCards(items, container) {
    if (!container || !Array.isArray(items)) return;

    container.innerHTML = items.map(function (item) {
      return '' +
        '<div class="field-card">' +
          '<div class="field-icon"><i class="' + escapeHtml(iconClass(item.icon, 'fa-solid fa-leaf')) + '"></i></div>' +
          '<h3>' + escapeHtml(item.title) + '</h3>' +
          '<p>' + escapeHtml(item.description) + '</p>' +
        '</div>';
    }).join('');
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

  function renderSkills(data, container) {
    if (!container || !data || !Array.isArray(data.groups)) return;

    container.innerHTML = data.groups.map(function (group) {
      return '' +
        '<div class="skills-group">' +
          '<h3><i class="' + escapeHtml(iconClass(group.icon, 'fa-solid fa-leaf')) + '"></i> ' + escapeHtml(group.heading) + '</h3>' +
          '<ul>' +
            (Array.isArray(group.items) ? group.items.map(function (item) {
              return '<li>' + escapeHtml(item) + '</li>';
            }).join('') : '') +
          '</ul>' +
        '</div>';
    }).join('');
  }

  function renderCertificates(items, container) {
    if (!container || !Array.isArray(items)) return;

    container.innerHTML = items.map(function (item) {
      const href = text(item.url) || '#';
      const small = certificateSmallText(item);
      return '' +
        '<a href="' + escapeHtml(href) + '"' + linkAttrs(href) + ' class="cert-card">' +
          '<i class="' + escapeHtml(iconClass(item.icon, 'fa-solid fa-certificate')) + '"></i>' +
          '<span>' + escapeHtml(item.title) + '</span>' +
          '<small>' + escapeHtml(small) + '</small>' +
        '</a>';
    }).join('');
  }

  function certificateSmallText(item) {
    const issuer = text(item.issuer).trim();
    const year = text(item.year).trim();
    if (issuer || year) return [issuer, year].filter(Boolean).join(' · ');
    if (item.title === 'ORCID') return '0009-0002-6192-1703';
    if (item.title === 'ResearchGate') return 'Research profile & outputs';
    return text(item.url);
  }

  function renderLeadership(items, container) {
    if (!container || !Array.isArray(items)) return;

    container.innerHTML = items.map(function (item) {
      return '' +
        '<div class="leadership-card">' +
          '<div class="leadership-icon"><i class="' + escapeHtml(iconClass(item.icon, 'fa-solid fa-seedling')) + '"></i></div>' +
          '<h3>' + escapeHtml(item.title) + '</h3>' +
          '<p>' + escapeHtml(item.description) + '</p>' +
        '</div>';
    }).join('');
  }

  function renderGallery(items, container) {
    if (!container || !Array.isArray(items)) return;

    container.innerHTML = items.map(function (item, index) {
      const wideClass = index === 0 || index === 4 ? ' gallery-item--wide' : '';
      return '' +
        '<div class="gallery-item' + wideClass + '">' +
          '<img src="/images/' + escapeHtml(item.filename) + '" alt="' + escapeHtml(item.caption || 'Field work ' + (index + 1)) + '" loading="lazy" />' +
          '<span class="gallery-caption">' + escapeHtml(item.caption) + '</span>' +
        '</div>';
    }).join('');

    attachGalleryFallbacks(container);
  }

  function renderContact(data, targets) {
    if (!data) return;

    if (targets.contactTitle && data.title != null) {
      targets.contactTitle.textContent = data.title;
    }

    if (targets.contactSubtitle && data.subtitle != null) {
      targets.contactSubtitle.textContent = data.subtitle;
    }

    if (targets.contactItems && Array.isArray(data.items)) {
      targets.contactItems.innerHTML = data.items.map(function (item) {
        const href = text(item.url) || '#';
        return '' +
          '<a href="' + escapeHtml(href) + '"' + linkAttrs(href) + ' class="contact-item">' +
            '<div class="contact-item-icon"><i class="' + escapeHtml(iconClass(item.icon, 'fa-solid fa-envelope')) + '"></i></div>' +
            '<div><strong>' + escapeHtml(item.label) + '</strong><span>' + escapeHtml(item.value) + '</span></div>' +
          '</a>';
      }).join('');
    }
  }
});

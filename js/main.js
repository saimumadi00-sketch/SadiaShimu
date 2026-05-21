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
});

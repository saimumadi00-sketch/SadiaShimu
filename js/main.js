/* ============================================================
   MST. SADIA AFRIN SHIMU — ACADEMIC PORTFOLIO
   main.js — Navigation, scroll reveals, image fallbacks, Leaflet map
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ── PAGE LOADER ────────────────────────────────────────── */
  var loader = document.getElementById('page-loader');
  if (loader) {
    var minDisplay = 1800;
    var startTime = Date.now();
    function dismissLoader() {
      var elapsed = Date.now() - startTime;
      var remaining = Math.max(0, minDisplay - elapsed);
      setTimeout(function () {
        loader.classList.add('done');
        setTimeout(function () {
          loader.style.display = 'none';
        }, 650);
      }, remaining);
    }
    if (document.readyState === 'complete') {
      dismissLoader();
    } else {
      window.addEventListener('load', dismissLoader);
      setTimeout(dismissLoader, 3500);
    }
  }
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
      id: '77c9c32a-9931-4ad7-8117-d6c5690de401',
      name: 'General',
      featured: true,
      cover_filename: 'gallery-1.jpg',
      created_at: '2026-05-22T09:54:47.710Z',
      photos: [
        { id: 'gal1', filename: 'gallery-1.jpg', caption: '[Caption]' },
        { id: 'gal2', filename: 'gallery-2.jpg', caption: '[Caption]' },
        { id: 'gal3', filename: 'gallery-3.jpg', caption: '[Caption]' },
        { id: 'gal4', filename: 'gallery-4.jpg', caption: '[Caption]' },
        { id: 'gal5', filename: 'gallery-5.jpg', caption: '[Caption]' },
        { id: 'gal6', filename: 'gallery-6.jpg', caption: '[Caption]' }
      ]
    }
  ];
  let galleryAlbums = staticGalleryAlbums;
  let activeAlbumIndex = 0;
  let activePhotoIndex = 0;
  let touchStartX = null;
  let galleryPhotoEmbla = null;
  let galleryAlbumEmbla = null;
  let galleryFlatPhotos = [];

  const navbar = document.getElementById('navbar');

  (function initDarkMode() {
    var btn = document.getElementById('dark-toggle');
    if (!btn) return;

    function applyTheme(dark) {
      if (dark) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    }

    btn.addEventListener('click', function () {
      applyTheme(!document.documentElement.classList.contains('dark'));
    });
  })();

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
    (scope || document).querySelectorAll('.gallery-photo-image, .gallery-album-image, .gallery-lightbox-image').forEach(function (img, i) {
      if (img.dataset.fallbackBound === 'true') return;
      img.dataset.fallbackBound = 'true';
      img.addEventListener('error', function () {
        img.onerror = null;
        img.src = 'https://placehold.co/900x600/' + galleryFallbackColors[i % galleryFallbackColors.length] + '/183326?text=Field+Photo';
      });
    });
  }

  function imageSrc(filename) {
    if (!filename) return 'https://placehold.co/900x600/e8dfc9/183326?text=Field+Photo';
    return '/images/' + String(filename).split('/').map(encodeURIComponent).join('/');
  }

  function cleanGalleryCaption(caption) {
    const text = String(caption || '').trim();
    return text === '[Caption]' ? '' : text;
  }

  function galleryPhotoCount(album) {
    return Array.isArray(album.photos) ? album.photos.length : 0;
  }

  function formatPhotoCount(count) {
    return count + ' photo' + (count === 1 ? '' : 's');
  }

  function albumCover(album) {
    if (album.cover_filename) return album.cover_filename;
    if (Array.isArray(album.photos) && album.photos[0]) return album.photos[0].filename;
    return '';
  }

  function flattenGalleryPhotos() {
    const photos = [];

    galleryAlbums.forEach(function (album, albumIndex) {
      if (!Array.isArray(album.photos)) return;

      album.photos.forEach(function (photo, photoIndex) {
        photos.push({
          albumIndex: albumIndex,
          photoIndex: photoIndex,
          albumName: album.name || 'Album',
          filename: photo.filename,
          caption: cleanGalleryCaption(photo.caption)
        });
      });
    });

    return photos;
  }

  function bindGalleryAlbumCards(scope) {
    (scope || document).querySelectorAll('[data-gallery-album-index]:not([data-gallery-photo-index])').forEach(function (card) {
      if (card.dataset.albumBound === 'true') return;
      card.dataset.albumBound = 'true';
      card.addEventListener('click', function () {
        selectGalleryAlbum(Number(card.dataset.galleryAlbumIndex) || 0);
      });
    });
  }

  function bindGalleryPhotoCards(scope) {
    (scope || document).querySelectorAll('[data-gallery-photo-index]').forEach(function (card) {
      if (card.dataset.photoBound === 'true') return;
      card.dataset.photoBound = 'true';
      card.addEventListener('click', function () {
        openGalleryLightbox(
          Number(card.dataset.galleryAlbumIndex) || 0,
          Number(card.dataset.galleryPhotoIndex) || 0
        );
      });
    });
  }

  function renderGalleryCarousels() {
    const photoTrack = document.getElementById('gallery-photo-track');
    const albumTrack = document.getElementById('gallery-album-track');
    if (!photoTrack || !albumTrack) return;

    galleryFlatPhotos = flattenGalleryPhotos();

    photoTrack.innerHTML = galleryFlatPhotos.map(function (photo) {
      const label = photo.caption || photo.albumName + ' photo';
      return '' +
        '<button class="gallery-photo-slide embla__slide" type="button" data-gallery-album-index="' + photo.albumIndex + '" data-gallery-photo-index="' + photo.photoIndex + '" aria-label="Open ' + escapeHtml(label) + '">' +
          '<span class="gallery-photo-card">' +
            '<img class="gallery-photo-image" src="' + imageSrc(photo.filename) + '" alt="' + escapeHtml(label) + '" loading="lazy" />' +
            '<span class="gallery-photo-meta">' +
              '<span class="gallery-photo-album">' + escapeHtml(photo.albumName) + '</span>' +
              (photo.caption ? '<span class="gallery-photo-caption">' + escapeHtml(photo.caption) + '</span>' : '') +
            '</span>' +
          '</span>' +
        '</button>';
    }).join('');

    albumTrack.innerHTML = galleryAlbums.map(function (album, albumIndex) {
      const count = galleryPhotoCount(album);
      const name = album.name || 'Album';
      return '' +
        '<button class="gallery-album-slide embla__slide" type="button" data-gallery-album-index="' + albumIndex + '" aria-pressed="false">' +
          '<span class="gallery-album-thumb">' +
            '<img class="gallery-album-image" src="' + imageSrc(albumCover(album)) + '" alt="' + escapeHtml(name) + ' album cover" loading="lazy" />' +
          '</span>' +
          '<span class="gallery-album-info">' +
            '<span class="gallery-album-title">' + escapeHtml(name) + '</span>' +
            '<span class="gallery-album-count">' + escapeHtml(formatPhotoCount(count)) + '</span>' +
          '</span>' +
        '</button>';
    }).join('');

    bindGalleryPhotoCards(photoTrack);
    bindGalleryAlbumCards(albumTrack);
    attachGalleryFallbacks(document.getElementById('gallery'));
    initGalleryCarousels();
    updateSelectedGalleryAlbum(0);
  }

  function initGalleryCarousels() {
    if (typeof EmblaCarousel !== 'function') return;

    const photoViewport = document.querySelector('#gallery-photo-carousel .embla__viewport');
    const albumViewport = document.querySelector('#gallery-album-carousel .embla__viewport');

    if (photoViewport && !galleryPhotoEmbla && galleryFlatPhotos.length) {
      const photoPlugins = [];

      if (typeof EmblaCarouselAutoScroll === 'function' && galleryFlatPhotos.length > 1) {
        photoPlugins.push(EmblaCarouselAutoScroll({
          speed: 0.7,
          startDelay: 700,
          stopOnInteraction: false,
          stopOnMouseEnter: true,
          stopOnFocusIn: true
        }));
      }

      galleryPhotoEmbla = EmblaCarousel(photoViewport, {
        align: 'start',
        loop: galleryFlatPhotos.length > 2,
        dragFree: true,
        containScroll: false
      }, photoPlugins);

      galleryPhotoEmbla.on('select', syncSelectedGalleryAlbum);
      galleryPhotoEmbla.on('reInit', syncSelectedGalleryAlbum);
      syncSelectedGalleryAlbum();
    }

    if (albumViewport && !galleryAlbumEmbla) {
      galleryAlbumEmbla = EmblaCarousel(albumViewport, {
        align: 'start',
        dragFree: true,
        containScroll: 'trimSnaps'
      });

      bindAlbumCarouselControls();
    }
  }

  function bindAlbumCarouselControls() {
    const prev = document.getElementById('gallery-album-prev');
    const next = document.getElementById('gallery-album-next');
    if (!galleryAlbumEmbla || !prev || !next || prev.dataset.carouselBound === 'true') return;

    prev.dataset.carouselBound = 'true';
    next.dataset.carouselBound = 'true';

    function updateControls() {
      prev.disabled = !galleryAlbumEmbla.canScrollPrev();
      next.disabled = !galleryAlbumEmbla.canScrollNext();
    }

    prev.addEventListener('click', function () { galleryAlbumEmbla.scrollPrev(); });
    next.addEventListener('click', function () { galleryAlbumEmbla.scrollNext(); });
    galleryAlbumEmbla.on('select', updateControls);
    galleryAlbumEmbla.on('reInit', updateControls);
    updateControls();
  }

  function syncSelectedGalleryAlbum() {
    if (!galleryPhotoEmbla || !galleryFlatPhotos.length) return;
    const photo = galleryFlatPhotos[galleryPhotoEmbla.selectedScrollSnap()];
    if (photo) updateSelectedGalleryAlbum(photo.albumIndex);
  }

  function selectGalleryAlbum(albumIndex) {
    updateSelectedGalleryAlbum(albumIndex);

    const firstPhotoIndex = galleryFlatPhotos.findIndex(function (photo) {
      return photo.albumIndex === albumIndex;
    });

    if (firstPhotoIndex >= 0 && galleryPhotoEmbla) {
      galleryPhotoEmbla.scrollTo(firstPhotoIndex);
    }
  }

  function updateSelectedGalleryAlbum(albumIndex) {
    document.querySelectorAll('#gallery-album-track [data-gallery-album-index]').forEach(function (button) {
      const selected = Number(button.dataset.galleryAlbumIndex) === albumIndex;
      button.classList.toggle('is-selected', selected);
      button.setAttribute('aria-pressed', selected ? 'true' : 'false');
    });

    if (galleryAlbumEmbla) {
      galleryAlbumEmbla.scrollTo(albumIndex);
    }
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

  renderGalleryCarousels();

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

  /* ── READING PROGRESS BAR ───────────────────────────────── */
  var progressBar = document.createElement('div');
  progressBar.id = 'read-progress';
  document.body.appendChild(progressBar);

  /* ── BACK TO TOP BUTTON ─────────────────────────────────── */
  var backTop = document.createElement('button');
  backTop.id = 'back-top';
  backTop.setAttribute('aria-label', 'Back to top');
  backTop.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
  document.body.appendChild(backTop);
  backTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  window.addEventListener('scroll', function () {
    var scrollTop = window.scrollY || document.documentElement.scrollTop;
    var docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = pct + '%';
    if (scrollTop > 400) {
      backTop.classList.add('visible');
    } else {
      backTop.classList.remove('visible');
    }
  }, { passive: true });

  /* ── COUNTER ANIMATION ──────────────────────────────────── */
  var statNums = document.querySelectorAll('.stat-num');
  if (statNums.length) {
    var countered = false;
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !countered) {
          countered = true;
          statNums.forEach(function (el) {
            var raw = el.textContent.trim();
            var suffix = raw.replace(/[0-9]/g, '');
            var target = parseInt(raw.replace(/[^0-9]/g, ''), 10);
            if (isNaN(target)) return;
            var duration = 1400;
            var startTime = null;
            function step(ts) {
              if (!startTime) startTime = ts;
              var progress = Math.min((ts - startTime) / duration, 1);
              var ease = 1 - Math.pow(1 - progress, 3);
              el.textContent = Math.floor(ease * target) + suffix;
              if (progress < 1) requestAnimationFrame(step);
              else el.textContent = target + suffix;
            }
            requestAnimationFrame(step);
          });
          counterObserver.disconnect();
        }
      });
    }, { threshold: 0.5 });
    var statsEl = document.querySelector('.hero-stats');
    if (statsEl) counterObserver.observe(statsEl);
  }

  /* ── TYPED TEXT EFFECT ──────────────────────────────────── */
  (function initTyped() {
    var el = document.getElementById('hero-typed');
    if (!el) return;
    var roles = ['Zoologist', 'Field Researcher', 'Conservationist', 'Primatologist'];
    var roleIndex = 0;
    var charIndex = 0;
    var deleting = false;
    var pauseTimer = null;

    function type() {
      var current = roles[roleIndex];
      if (deleting) {
        charIndex--;
      } else {
        charIndex++;
      }
      el.textContent = current.slice(0, charIndex);
      var delay = deleting ? 60 : 100;
      if (!deleting && charIndex === current.length) {
        delay = 1800;
        deleting = true;
      } else if (deleting && charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        delay = 400;
      }
      pauseTimer = setTimeout(type, delay);
    }
    setTimeout(type, 1200);
  })();

  /* ── PUBLICATION YEAR FILTER ────────────────────────────── */
  (function initPubFilter() {
    var filterBtns = document.querySelectorAll('.pub-filter-btn');
    var pubItems = document.querySelectorAll('.pub-item[data-year]');
    if (!filterBtns.length) return;

    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var year = btn.getAttribute('data-year');
        pubItems.forEach(function (item) {
          if (year === 'all' || item.getAttribute('data-year') === year) {
            item.style.display = '';
            item.style.opacity = '0';
            item.style.transform = 'translateY(10px)';
            setTimeout(function () {
              item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
              item.style.opacity = '1';
              item.style.transform = 'translateY(0)';
            }, 10);
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  })();

  /* ── SMOOTH IMAGE REVEAL ────────────────────────────────── */
  (function initImgReveal() {
    var imgs = document.querySelectorAll('img.img-reveal');
    imgs.forEach(function (img) {
      img.style.opacity = '0';
      img.style.transition = 'opacity 0.6s ease';
      if (img.complete && img.naturalWidth) {
        img.style.opacity = '1';
      } else {
        img.addEventListener('load', function () {
          img.style.opacity = '1';
        });
      }
    });
  })();

  /* ── STATIC-SAFE RENDER HELPERS ────────────────────────── */
  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

});

/* ============================================================
   MST. SADIA AFRIN SHIMU — ACADEMIC PORTFOLIO
   main.js — Navigation, theme preferences, image fallbacks, Leaflet map
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  function scrollBehavior() { return motionPreference.matches ? 'auto' : 'smooth'; }
  const galleryFallbackColors = ['e8dfc9', 'd8e2d4', 'cfd7c3', 'efe3c5', 'dde4d6', 'e5dcc5'];
  const citationDoiList = [
    '10.1016/j.gecco.2026.e04072',
    '10.1163/14219980-bja10052',
    '10.1590/S1984-4689.v42.e24047'
  ];
  const staticMapMarkers = [
    { lat: 24.325059045496882, lng: 91.78712980408851, title: 'Jagannath University, Dhaka', desc: 'Home institution — BSc & MSc in Zoology' },
    { lat: 24.12465911660991, lng: 91.44455314640041, title: 'Sundarbans', desc: 'Mangrove biodiversity & field ecology research' },
    { lat: 23.098635522841708, lng: 91.87240259824227, title: 'Jessore / Southwest Bangladesh', desc: 'Primate survey and conservation outreach area' },
    { lat: 24.256927332126548, lng: 91.91332985981806, title: 'Rajshahi Division', desc: 'Biodiversity field documentation site' },
    { lat: 24.18899395891292, lng: 90.72972505222265, title: 'Chittagong Hill Tracts', desc: 'Forest primate habitat survey area' },
    { lat: 21.858937756871974, lng: 89.77017212647436, title: 'Field Location 6', desc: 'Field research location' },
    { lat: 22.469970072887563, lng: 92.23083391525459, title: 'Field Location 7', desc: 'Field research location' }
  ];

  /* ── NAVBAR SCROLL BEHAVIOR ────────────────────────────── */
  const staticGalleryAlbums = [
    {
      id: 'school-days',
      name: 'School Days',
      cover_filename: 'gallery/School Days/33160803-0524-47f9-b546-e401e11e4194.jpg',
      photos: [
        {
          id: 'school-days-1',
          filename: 'gallery/School Days/33160803-0524-47f9-b546-e401e11e4194.jpg',
          caption: 'Cambridge English Certificate Distribution Ceremony at Oxford International School'
        },
        {
          id: 'school-days-2',
          filename: 'gallery/School Days/9df92fc6-b8a3-42ed-bc20-747f949509e0.jpg',
          caption: 'With colleagues at the certificate distribution ceremony'
        },
        {
          id: 'school-days-3',
          filename: 'gallery/School Days/c14dc910-d31a-47cc-b908-e56c13b1066f.jpg',
          caption: 'School colleagues at Oxford International School'
        }
      ]
    },
    {
      id: 'fieldwork',
      name: 'Fieldwork',
      cover_filename: 'gallery/fieldwork/471190887_579555698136450_3964796315751664654_n.jpg',
      photos: [
        { id: 'fieldwork-1', filename: 'gallery/fieldwork/471190887_579555698136450_3964796315751664654_n.jpg', caption: 'Field research team in a forest habitat' },
        { id: 'fieldwork-2', filename: 'gallery/fieldwork/471455434_578863654872321_7998168355185712414_n.jpg', caption: 'Research team during a forest survey' },
        { id: 'fieldwork-3', filename: 'gallery/fieldwork/477715842_1030281329128968_3696121394535095277_n.jpg', caption: 'Community members and researchers at a field site' },
        { id: 'fieldwork-4', filename: 'gallery/fieldwork/480742873_625976420161044_8007520573794874075_n.jpg', caption: 'Collecting survey data during night fieldwork' },
        { id: 'fieldwork-5', filename: 'gallery/fieldwork/480767954_1043648221125612_5395975836019803450_n.jpg', caption: 'Plumploris Bangladesh Project field team' },
        { id: 'fieldwork-6', filename: 'gallery/fieldwork/481021032_629384809820205_7454318602968944811_n.jpg', caption: 'Recording field information with a local participant' },
        { id: 'fieldwork-7', filename: 'gallery/fieldwork/481300144_629980929760593_8855543893349181594_n.jpg', caption: 'Community engagement during fieldwork' },
        { id: 'fieldwork-8', filename: 'gallery/fieldwork/481336909_625976390161047_7629689505268399396_n.jpg', caption: 'Reviewing survey notes during a night assessment' },
        { id: 'fieldwork-9', filename: 'gallery/fieldwork/481337804_629384846486868_5247302954774525753_n.jpg', caption: 'Conservation outreach with local children' },
        { id: 'fieldwork-10', filename: 'gallery/fieldwork/481450003_629980976427255_2454263935057776895_n.jpg', caption: 'Plumploris Bangladesh Project team in the field' },
        { id: 'fieldwork-11', filename: 'gallery/fieldwork/481669987_1043646234459144_1447271907081972586_n.jpg', caption: 'Field researchers during a community survey' },
        { id: 'fieldwork-12', filename: 'gallery/fieldwork/481894933_629980966427256_7679441551025105185_n.jpg', caption: 'Plumploris Bangladesh Project group photo' },
        { id: 'fieldwork-13', filename: 'gallery/fieldwork/481994453_629977473094272_8081294090276819323_n.jpg', caption: 'Conservation awareness session with student posters' },
        { id: 'fieldwork-14', filename: 'gallery/fieldwork/482273740_636074969151189_2906079613753886082_n.jpg', caption: 'Community consultation during field research' },
        { id: 'fieldwork-15', filename: 'gallery/fieldwork/483101920_636074929151193_401811774325023624_n.jpg', caption: 'Outdoor conservation awareness activity' },
        { id: 'fieldwork-16', filename: 'gallery/fieldwork/493354144_1237194795076559_5292426569247668420_n.jpg', caption: 'Field team documenting local biodiversity' }
      ]
    },
    {
      id: 'club-works',
      name: 'Club Works',
      cover_filename: 'gallery/Club works/483506512_636662239092462_3426180495455708919_n.jpg',
      photos: [
        { id: 'club-works-1', filename: 'gallery/Club works/483506512_636662239092462_3426180495455708919_n.jpg', caption: 'Zoology club team at a biodiversity exhibition' },
        { id: 'club-works-2', filename: 'gallery/Club works/483509251_636662422425777_138279806094210950_n.jpg', caption: 'Visitors exploring the club exhibition' },
        { id: 'club-works-3', filename: 'gallery/Club works/483921508_636662019092484_1952603686340115779_n.jpg', caption: 'Club members at the biodiversity display' },
        { id: 'club-works-4', filename: 'gallery/Club works/484901875_639066385518714_7444917612082588859_n.jpg', caption: 'World Wildlife Day 2025 club activity' },
        { id: 'club-works-5', filename: 'gallery/Club works/485349485_641421615283191_3062818322886490691_n.jpg', caption: 'Club members at an academic event' }
      ]
    },
    {
      id: 'working-with-kids',
      name: 'Working with Kids',
      cover_filename: 'gallery/Working with kids/481257817_625627506862602_7356264248833204603_n.jpg',
      photos: [
        { id: 'working-with-kids-1', filename: 'gallery/Working with kids/481257817_625627506862602_7356264248833204603_n.jpg', caption: 'Conservation education session with students' },
        { id: 'working-with-kids-2', filename: 'gallery/Working with kids/482318347_625627246862628_1404960891638882727_n.jpg', caption: 'Outreach team during a school program' },
        { id: 'working-with-kids-3', filename: 'gallery/Working with kids/666255244_945262591565757_7678362277743571367_n.jpg', caption: 'Interactive conservation activity with children' },
        { id: 'working-with-kids-4', filename: 'gallery/Working with kids/666999714_945262858232397_859077247061779271_n.jpg', caption: 'Outdoor learning activity with schoolchildren' },
        { id: 'working-with-kids-5', filename: 'gallery/Working with kids/667665725_945263034899046_8904973512488973943_n.jpg', caption: 'Group photo after the conservation program' },
        { id: 'working-with-kids-6', filename: 'gallery/Working with kids/668138568_945263168232366_5209873077202316413_n.jpg', caption: 'Preparing educational materials for the event' },
        { id: 'working-with-kids-7', filename: 'gallery/Working with kids/668554493_945262781565738_3416827987365471380_n.jpg', caption: 'Students taking part in an outdoor activity' },
        { id: 'working-with-kids-8', filename: 'gallery/Working with kids/668814300_945262401565776_5080951708331844442_n.jpg', caption: 'Students and volunteers at the program venue' }
      ]
    }
  ];
  let galleryAlbums = staticGalleryAlbums;
  let selectedGalleryAlbumIndex = 0;
  let activeAlbumIndex = 0;
  let activePhotoIndex = 0;
  let touchStartX = null;
  let galleryTrigger = null;
  let galleryBackground = [];
  let previousBodyOverflow = '';
  let galleryPhotoEmbla = null;
  let galleryAlbumEmbla = null;
  let galleryFlatPhotos = [];

  const navbar = document.getElementById('navbar');

  function updateCitationCount(count) {
    document.querySelectorAll('[data-citation-count]').forEach(function (el) {
      el.textContent = count === null ? '\u2014' : count.toLocaleString();
      el.setAttribute('title', count === null ? 'Crossref citation count unavailable; please try again later' : 'Crossref citations across three journal articles');
    });
  }

  function fetchCitationCountForDoi(doi) {
    const url = 'https://api.crossref.org/works/' + encodeURIComponent(doi) + '?mailto=sadiaafrinshimu7%40gmail.com';

    return fetch(url, { cache: 'no-store', headers: { Accept: 'application/json' } })
      .then(function (response) {
        if (!response.ok) return null;
        return response.json();
      })
      .then(function (data) {
        const count = data && data.message ? Number(data.message['is-referenced-by-count']) : NaN;
        return Number.isFinite(count) ? count : null;
      })
      .catch(function () {
        return null;
      });
  }

  function initDynamicCitationCount() {
    if (typeof fetch !== 'function' || !document.querySelector('[data-citation-count]')) return;

    Promise.all(citationDoiList.map(fetchCitationCountForDoi)).then(function (counts) {
      if (!counts.every(function (count) { return Number.isFinite(count) && count >= 0; })) {
        updateCitationCount(null);
        return;
      }
      updateCitationCount(counts.reduce(function (sum, count) { return sum + count; }, 0));
    });
  }

  initDynamicCitationCount();

  (function initDarkMode() {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
    const modes = ['system', 'light', 'dark'];
    const button = document.getElementById('theme-toggle');
    const label = document.getElementById('theme-label');
    const icon = document.getElementById('theme-icon');
    let preference = 'system';
    try { preference = localStorage.getItem('portfolio-theme') || 'system'; } catch (e) {}
    if (!modes.includes(preference)) preference = 'system';
    function applyTheme() {
      const dark = preference === 'dark' || (preference === 'system' && systemTheme.matches);
      document.documentElement.classList.toggle('dark', dark);
      document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
      const name = preference[0].toUpperCase() + preference.slice(1);
      const next = modes[(modes.indexOf(preference) + 1) % modes.length];
      const description = 'Theme: ' + name + '. Switch to ' + next[0].toUpperCase() + next.slice(1);
      if (label) label.textContent = name;
      if (icon) icon.textContent = { system: '\u25d0', light: '\u2600', dark: '\u263e' }[preference];
      if (button) {
        button.setAttribute('aria-label', description);
        button.setAttribute('title', description);
      }
    }
    applyTheme();
    systemTheme.addEventListener('change', applyTheme);
    if (button) button.addEventListener('click', function () {
      preference = modes[(modes.indexOf(preference) + 1) % modes.length];
      try { localStorage.setItem('portfolio-theme', preference); } catch (e) {}
      applyTheme();
    });
    window.addEventListener('storage', function (event) {
      if (event.key !== 'portfolio-theme' && event.key !== null) return;
      preference = modes.includes(event.newValue) ? event.newValue : 'system';
      applyTheme();
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

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.focus();
      }
    });

    // Close menu on outside click
    document.addEventListener('click', function (e) {
      if (!navbar.contains(e.target)) {
        navLinks.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ── ACTIVE NAV LINK HIGHLIGHT ─────────────────────────── */
  const navAnchors = document.querySelectorAll('.nav-links a');
  const sections = Array.from(navAnchors)
    .map(function (anchor) {
      return document.querySelector(anchor.getAttribute('href'));
    })
    .filter(Boolean);

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
  function imageFallback(color, label) {
    return 'data:image/svg+xml,' + encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="900" height="600">' +
      '<rect width="100%" height="100%" fill="#' + color + '"/>' +
      '<text x="50%" y="50%" text-anchor="middle" fill="#183326" font-family="sans-serif" font-size="28">' + label + '</text></svg>'
    );
  }

  function bindImageFallback(img, fallback) {
    if (img.dataset.fallbackBound === 'true') return;
    img.dataset.fallbackBound = 'true';
    function useFallback() {
      // A failed embedded fallback must not start another request loop.
      if (String(img.getAttribute('src') || '').startsWith('data:')) return;
      img.src = fallback;
    }
    img.addEventListener('error', useFallback);
    if (img.complete && !img.naturalWidth) useFallback();
  }

  const portrait = document.getElementById('portrait-img');
  if (portrait) bindImageFallback(portrait, imageFallback('dde8dc', 'Sadia Afrin Shimu'));

  function attachGalleryFallbacks(scope) {
    (scope || document).querySelectorAll('.gallery-photo-image, .gallery-album-image, .gallery-lightbox-image').forEach(function (img, i) {
      bindImageFallback(img, imageFallback(galleryFallbackColors[i % galleryFallbackColors.length], 'Photo unavailable'));
    });
  }

  function imageSrc(filename) {
    if (!filename) return imageFallback('e8dfc9', 'Photo unavailable');
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
          Number(card.dataset.galleryPhotoIndex) || 0,
          card
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
        '<button class="gallery-album-slide embla__slide" type="button" data-gallery-album-index="' + albumIndex + '" aria-controls="gallery-photo-carousel" aria-pressed="false">' +
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
    bindAlbumCarouselControls();
    updateSelectedGalleryAlbum(0);
  }

  function initGalleryCarousels() {
    if (typeof EmblaCarousel !== 'function') return;

    const photoViewport = document.querySelector('#gallery-photo-carousel .embla__viewport');
    const albumViewport = document.querySelector('#gallery-album-carousel .embla__viewport');

    if (photoViewport && !galleryPhotoEmbla && galleryFlatPhotos.length) {
      const photoPlugins = [];

      if (!motionPreference.matches && typeof EmblaCarouselAutoScroll === 'function' && galleryFlatPhotos.length > 1) {
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
        duration: motionPreference.matches ? 0 : 25,
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
        duration: motionPreference.matches ? 0 : 25,
        dragFree: true,
        containScroll: 'trimSnaps'
      });

    }
  }

  function bindAlbumCarouselControls() {
    const prev = document.getElementById('gallery-album-prev');
    const next = document.getElementById('gallery-album-next');
    if (!prev || !next || prev.dataset.carouselBound === 'true') return;

    prev.dataset.carouselBound = 'true';
    next.dataset.carouselBound = 'true';

    prev.disabled = galleryAlbums.length < 2;
    next.disabled = galleryAlbums.length < 2;

    prev.addEventListener('click', function () {
      const previousIndex = (selectedGalleryAlbumIndex - 1 + galleryAlbums.length) % galleryAlbums.length;
      selectGalleryAlbum(previousIndex, false);
    });

    next.addEventListener('click', function () {
      const nextIndex = (selectedGalleryAlbumIndex + 1) % galleryAlbums.length;
      selectGalleryAlbum(nextIndex, false);
    });
  }

  function syncSelectedGalleryAlbum() {
    if (!galleryPhotoEmbla || !galleryFlatPhotos.length) return;
    const photo = galleryFlatPhotos[galleryPhotoEmbla.selectedScrollSnap()];
    if (photo) updateSelectedGalleryAlbum(photo.albumIndex);
  }

  function selectGalleryAlbum(albumIndex, scrollIntoView) {
    const firstPhotoIndex = galleryFlatPhotos.findIndex(function (photo) {
      return photo.albumIndex === albumIndex;
    });

    if (firstPhotoIndex < 0) return;

    if (galleryPhotoEmbla && typeof galleryPhotoEmbla.plugins === 'function') {
      const plugins = galleryPhotoEmbla.plugins();
      if (plugins.autoScroll && typeof plugins.autoScroll.stop === 'function') {
        plugins.autoScroll.stop();
      }
    }

    updateSelectedGalleryAlbum(albumIndex);

    if (galleryPhotoEmbla) {
      galleryPhotoEmbla.scrollTo(firstPhotoIndex, true);
    } else {
      const firstPhoto = document.querySelector(
        '#gallery-photo-track [data-gallery-album-index="' + albumIndex + '"][data-gallery-photo-index="0"]'
      );
      const viewport = firstPhoto && firstPhoto.closest('.embla__viewport');
      if (firstPhoto && viewport) {
        viewport.scrollTo({ left: firstPhoto.offsetLeft, behavior: scrollBehavior() });
      }
    }

    const photoCarousel = document.getElementById('gallery-photo-carousel');
    if (photoCarousel && scrollIntoView !== false) {
      const navOffset = (navbar ? navbar.offsetHeight : 0) + 20;
      const top = photoCarousel.getBoundingClientRect().top + window.pageYOffset - navOffset;
      window.scrollTo({ top: top, behavior: scrollBehavior() });
    }
  }

  function updateSelectedGalleryAlbum(albumIndex) {
    selectedGalleryAlbumIndex = albumIndex;

    document.querySelectorAll('#gallery-album-track [data-gallery-album-index]').forEach(function (button) {
      const selected = Number(button.dataset.galleryAlbumIndex) === albumIndex;
      button.classList.toggle('is-selected', selected);
      button.setAttribute('aria-pressed', selected ? 'true' : 'false');
    });

    if (galleryAlbumEmbla) {
      galleryAlbumEmbla.scrollTo(albumIndex, motionPreference.matches);
    }
  }

  function ensureGalleryLightbox() {
    let lightbox = document.getElementById('gallery-lightbox');
    if (lightbox) return lightbox;

    lightbox = document.createElement('div');
    lightbox.id = 'gallery-lightbox';
    lightbox.className = 'gallery-lightbox';
    lightbox.setAttribute('aria-hidden', 'true');
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.setAttribute('aria-labelledby', 'gallery-lightbox-title');
    lightbox.innerHTML = '' +
      '<div class="gallery-lightbox-header">' +
        '<h3 id="gallery-lightbox-title" class="gallery-lightbox-title"></h3>' +
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

  function openGalleryLightbox(albumIndex, photoIndex, trigger) {
    const album = galleryAlbums[albumIndex];
    if (!album || !Array.isArray(album.photos) || album.photos.length === 0) return;

    activeAlbumIndex = albumIndex;
    activePhotoIndex = Math.max(0, Math.min(photoIndex, album.photos.length - 1));

    const lightbox = ensureGalleryLightbox();
    if (!lightbox.classList.contains('open')) {
      galleryTrigger = trigger || document.activeElement;
      previousBodyOverflow = document.body.style.overflow;
      galleryBackground = Array.from(document.body.children).filter(function (el) { return el !== lightbox; })
        .map(function (el) { const state = { el: el, inert: el.inert }; el.inert = true; return state; });
    }
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    updateGalleryLightbox();
    lightbox.querySelector('.gallery-lightbox-close').focus();
  }

  function closeGalleryLightbox() {
    const lightbox = document.getElementById('gallery-lightbox');
    if (!lightbox) return;
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = previousBodyOverflow;
    galleryBackground.forEach(function (state) { state.el.inert = state.inert; });
    galleryBackground = [];
    if (galleryTrigger && galleryTrigger.isConnected) galleryTrigger.focus();
    galleryTrigger = null;
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

    if (event.key === 'Tab') {
      const controls = Array.from(lightbox.querySelectorAll('button'));
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault(); first.focus();
      }
    }
    if (event.key === 'Escape') { event.preventDefault(); closeGalleryLightbox(); }
    if (event.key === 'ArrowLeft') moveGalleryPhoto(-1);
    if (event.key === 'ArrowRight') moveGalleryPhoto(1);
  });

  renderGalleryCarousels();
  motionPreference.addEventListener('change', function () {
    if (!motionPreference.matches) return;
    if (galleryPhotoEmbla) {
      const plugin = galleryPhotoEmbla.plugins().autoScroll;
      if (plugin) plugin.stop();
      galleryPhotoEmbla.reInit({ duration: 0 }, []);
    }
    if (galleryAlbumEmbla) galleryAlbumEmbla.reInit({ duration: 0 });
  });

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
        window.scrollTo({ top: top, behavior: scrollBehavior() });
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
    window.scrollTo({ top: 0, behavior: scrollBehavior() });
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
  var statNums = document.querySelectorAll('.stat-num:not([data-citation-count])');
  if (statNums.length && !motionPreference.matches) {
    var countered = false;
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !countered) {
          countered = true;
          statNums.forEach(function (el) {
            if (motionPreference.matches) return;
            var raw = el.textContent.trim();
            var suffix = raw.replace(/[0-9]/g, '');
            var target = parseInt(raw.replace(/[^0-9]/g, ''), 10);
            if (isNaN(target)) return;
            var duration = 1400;
            var startTime = null;
            function step(ts) {
              if (motionPreference.matches) { el.textContent = target + suffix; return; }
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
    if (!el || motionPreference.matches) return;
    var roles = ['Zoologist', 'Field Researcher', 'Conservationist', 'Primatologist'];
    var roleIndex = 0;
    var charIndex = 0;
    var deleting = false;
    var pauseTimer = null;

    function type() {
      if (motionPreference.matches) { el.textContent = 'Zoology · Primatology · Conservation'; return; }
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

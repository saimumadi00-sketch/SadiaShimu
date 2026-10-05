const { test } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const source = fs.readFileSync(require('node:path').join(__dirname, '../js/main.js'), 'utf8');
function section(start, end) { return source.slice(source.indexOf(start), source.indexOf(end, source.indexOf(start))); }

test('citation updates stay consistent regardless of counter animation timing', async () => {
  for (const reduced of [false, true]) {
    const citations = [{ textContent: '8', setAttribute() {} }, { textContent: '8', setAttribute() {} }];
    const output = { textContent: '5' };
    const frames = [];
    const context = vm.createContext({
      document: { querySelector: () => citations[0], querySelectorAll: selector => selector === '[data-citation-count]' ? citations : selector === '.stat-num:not([data-citation-count])' ? [output] : [] },
      citationDoiList: ['a', 'b'], fetch: () => {}, motionPreference: { matches: reduced },
      fetchCitationCountForDoi: async () => 6,
      requestAnimationFrame: callback => frames.push(callback),
      IntersectionObserver: class { constructor(cb) { this.cb = cb; } observe() { this.cb([{ isIntersecting: true }]); } disconnect() {} }
    });
    vm.runInContext(section('  function updateCitationCount', '  function fetchCitationCountForDoi'), context);
    vm.runInContext('const initialCitationCount = currentCitationCount();', context);
    vm.runInContext(section('  function initDynamicCitationCount', '  (function initDarkMode'), context);
    vm.runInContext(section('  var statNums', '  /* ── TYPED TEXT EFFECT'), context);
    await new Promise(resolve => setImmediate(resolve));
    assert.deepEqual(citations.map(el => el.textContent), ['12', '12']);
    // Finish unrelated counters after the citation request has resolved.
    let time = 1;
    while (frames.length) { frames.shift()(time); time += 1500; }
    assert.deepEqual(citations.map(el => el.textContent), ['12', '12']);
    assert.equal(output.textContent, '5');
  }
});

test('failed images use an embedded fallback only once, including cached failures', () => {
  const context = vm.createContext({});
  vm.runInContext(section('  function imageFallback', '  const portrait ='), context);
  for (const cached of [false, true]) {
    let src = '/missing.jpg'; let writes = 0; let error;
    const img = { dataset: {}, complete: cached, naturalWidth: 0,
      getAttribute: () => src, addEventListener: (_, cb) => { error = cb; },
      get src() { return src; }, set src(value) { src = value; writes++; }
    };
    const fallback = context.imageFallback('e8dfc9', 'Photo unavailable');
    context.bindImageFallback(img, fallback);
    error(); error(); error();
    assert.equal(writes, 1);
    assert.ok(src.startsWith('data:image/svg+xml,'));
  }
});

test('gallery opening focuses controls and closing restores focus, inert states, and overflow', () => {
  const background = [{ inert: false }, { inert: true }];
  let focused;
  const trigger = { isConnected: true, focus() { focused = this; } };
  const close = { focus() { focused = this; } };
  const classes = new Set();
  const lightbox = { classList: { contains: c => classes.has(c), add: c => classes.add(c), remove: c => classes.delete(c) }, setAttribute() {}, querySelector: () => close };
  const document = { activeElement: trigger, body: { children: [...background, lightbox], style: { overflow: 'scroll' } }, getElementById: () => lightbox };
  const context = vm.createContext({ document, galleryAlbums: [{ photos: [{}, {}] }], activeAlbumIndex: 0, activePhotoIndex: 0,
    galleryTrigger: null, galleryBackground: [], previousBodyOverflow: '', ensureGalleryLightbox: () => lightbox, updateGalleryLightbox() {} });
  vm.runInContext(section('  function openGalleryLightbox', '  function moveGalleryPhoto'), context);
  context.openGalleryLightbox(0, 0);
  assert.equal(focused, close);
  assert.ok(background.every(el => el.inert));
  assert.equal(document.body.style.overflow, 'hidden');
  context.closeGalleryLightbox();
  assert.equal(focused, trigger);
  assert.deepEqual(background.map(el => el.inert), [false, true]);
  assert.equal(document.body.style.overflow, 'scroll');
});

test('gallery Tab wraps in both directions and Escape closes the dialog', () => {
  let focused, prevented = 0, closed = false, listener;
  const first = { focus() { focused = this; } };
  const last = { focus() { focused = this; } };
  const lightbox = { classList: { contains: () => true }, querySelectorAll: () => [first, {}, last] };
  const document = { activeElement: last, getElementById: () => lightbox, addEventListener: (_, cb) => listener = cb };
  const context = vm.createContext({ document, closeGalleryLightbox: () => closed = true, moveGalleryPhoto() {} });
  vm.runInContext(section("  document.addEventListener('keydown'", '  renderGalleryCarousels();'), context);
  listener({ key: 'Tab', shiftKey: false, preventDefault() { prevented++; } });
  assert.equal(focused, first);
  document.activeElement = first;
  listener({ key: 'Tab', shiftKey: true, preventDefault() { prevented++; } });
  assert.equal(focused, last);
  listener({ key: 'Escape', preventDefault() { prevented++; } });
  assert.equal(closed, true);
  assert.equal(prevented, 3);
});

test('reduced motion disables autoplay and animated carousel movement', () => {
  const calls = [];
  const context = vm.createContext({
    EmblaCarousel: (_, opts, plugins) => { calls.push({ opts, plugins }); return { on() {} }; },
    EmblaCarouselAutoScroll: () => { throw Error('Autoplay must not be initialized'); },
    motionPreference: { matches: true }, galleryPhotoEmbla: null, galleryAlbumEmbla: null,
    galleryFlatPhotos: [{}, {}, {}], document: { querySelector: () => ({}) }, syncSelectedGalleryAlbum() {}
  });
  vm.runInContext(section('  function initGalleryCarousels', '  function bindAlbumCarouselControls'), context);
  context.initGalleryCarousels();
  assert.equal(calls.length, 2);
  assert.equal(calls[0].plugins.length, 0);
  assert.ok(calls.every(call => call.opts.duration === 0));
});

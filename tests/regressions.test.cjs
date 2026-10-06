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
  vm.runInContext(section("  document.addEventListener('keydown', function (event) {\n    const lightbox", '  renderGalleryCarousels();'), context);
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

test('theme defaults to system, cycles explicit modes, persists, and restores system tracking', () => {
  for (const saved of [null, 'light', 'dark', 'invalid']) {
    const theme = { matches: true, addEventListener(_, cb) { this.change = cb; } };
    const classes = new Set(); const writes = []; const events = {};
    const button = { attributes: {}, setAttribute(k,v) { this.attributes[k]=v; }, addEventListener(_,cb) { this.click=cb; } };
    const label = {}; const icon = {};
    const document = { getElementById: id => ({ 'theme-toggle': button, 'theme-label': label, 'theme-icon': icon })[id], documentElement: { classList: { toggle(name,value) { value ? classes.add(name) : classes.delete(name); } }, style: {} } };
    const context = vm.createContext({ document, window: { matchMedia: () => theme, addEventListener: (name,cb) => events[name]=cb }, localStorage: { getItem: () => saved, setItem: (k,v) => writes.push([k,v]) } });
    vm.runInContext(section('  (function initDarkMode()', "  window.addEventListener('scroll'"), context);
    assert.equal(classes.has('dark'), saved !== 'light');
    events.storage({ key: 'portfolio-theme', newValue: 'system' });
    theme.matches=false; theme.change(); assert.equal(classes.has('dark'),false);
    theme.matches=true; theme.change(); assert.equal(classes.has('dark'),true);
    button.click(); assert.equal(label.textContent,'Light'); assert.equal(classes.has('dark'),false);
    theme.change(); assert.equal(classes.has('dark'),false);
    button.click(); assert.equal(label.textContent,'Dark');
    theme.matches=false; theme.change(); assert.equal(classes.has('dark'),true);
    button.click(); assert.equal(label.textContent,'Light'); assert.equal(classes.has('dark'),false);
    assert.deepEqual(writes.map(pair=>pair[1]), ['light','dark','system']);
    assert.match(button.attributes['aria-label'], /Theme: Light/);
    theme.matches=true; theme.change();
    assert.equal(label.textContent,'Dark');
    assert.ok(!button.attributes['aria-label'].includes('System'));
  }
});

test('theme remains usable when storage is unavailable', () => {
  let click; const classes=new Set();
  const context=vm.createContext({ document: { getElementById: id => id==='theme-toggle' ? { setAttribute() {}, addEventListener(_,cb) { click=cb; } } : null, documentElement: { classList: { toggle(k,v) { v ? classes.add(k) : classes.delete(k); } }, style: {} } }, window: { matchMedia: () => ({ matches: true, addEventListener() {} }), addEventListener() {} }, localStorage: { getItem() { throw Error('blocked'); }, setItem() { throw Error('blocked'); } } });
  vm.runInContext(section('  (function initDarkMode()', "  window.addEventListener('scroll'"), context);
  assert.ok(classes.has('dark')); click(); assert.ok(!classes.has('dark'));
});

test('citation totals accept zero and lower counts, and never show partial results', async () => {
  for (const counts of [[0,0], [1,2], [6,null], [null,null]]) {
    const output={ textContent: '8', setAttribute() {} }; let i=0;
    const context=vm.createContext({ document: { querySelector: () => output, querySelectorAll: () => [output] }, citationDoiList: ['a','b'], fetch() {}, fetchCitationCountForDoi: async () => counts[i++] });
    vm.runInContext(section('  function updateCitationCount', '  function fetchCitationCountForDoi'),context);
    vm.runInContext(section('  function initDynamicCitationCount','  (function initDarkMode'),context);
    await new Promise(resolve=>setImmediate(resolve));
    assert.equal(output.textContent, counts.includes(null) ? '\u2014' : String(counts[0]+counts[1]));
  }
});

test('Escape closes the navigation and restores focus to its toggle', () => {
  const classes=new Set(); const events={}; let focused=false; const attrs={};
  const hamburger={ addEventListener(_,cb) { this.click=cb; }, setAttribute(k,v) { attrs[k]=v; }, focus() { focused=true; } };
  const navLinks={ classList: { toggle(k) { classes.has(k) ? classes.delete(k) : classes.add(k); }, contains: k=>classes.has(k), remove: k=>classes.delete(k) }, querySelectorAll: () => [] };
  const context=vm.createContext({ document: { getElementById: id=>id==='hamburger' ? hamburger : navLinks, addEventListener: (name,cb)=>events[name]=cb }, navbar: { contains: () => true } });
  vm.runInContext(section('  const hamburger =','  const navAnchors ='),context);
  hamburger.click(); assert.ok(classes.has('open'));
  events.keydown({key:'Escape'}); assert.ok(!classes.has('open')); assert.equal(attrs['aria-expanded'],'false'); assert.ok(focused);
});

test('body, highlighted text, and filled buttons meet normal-text contrast in both themes', () => {
  const css = fs.readFileSync(require('node:path').join(__dirname, '../css/main.css'), 'utf8');
  function luminance(color) {
    const rgb = [1,3,5].map(i => parseInt(color.slice(i,i+2),16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);
    return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722;
  }
  function contrast(a,b) { const [lo,hi] = [luminance(a),luminance(b)].sort((a,b)=>a-b); return (hi+.05)/(lo+.05); }
  const light = css.match(/:root\s*\{([^}]+)\}/)[1];
  const dark = css.match(/html\.dark\s*\{([^}]+)\}/)[1];
  function tokens(block) { return Object.fromEntries([...block.matchAll(/(--[\w-]+):\s*([^;]+);/g)].map(m=>[m[1],m[2].trim()])); }
  for(const palette of [tokens(light),{...tokens(light),...tokens(dark)}]) {
    function value(key) { const s=palette[key]; return s.startsWith('var(')?value(s.slice(4,-1)):s; }
    for(const foreground of ['--text','--text-2','--text-muted','--accent']) {
      for(const background of ['--bg','--bg-alt','--surface']) assert.ok(contrast(value(foreground),value(background))>=4.5,`${foreground} on ${background}`);
    }
    assert.ok(contrast(value('--on-accent'),value('--accent'))>=4.5);
  }
});


test('initial theme prevents a flash and agrees with saved or system preferences', () => {
  const html=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
  const script=html.match(/<script>([\s\S]*?)<\/script>/)[1];
  for(const saved of [null,'system','light','dark','invalid']) for(const systemDark of [false,true]) {
    let applied; const root={ classList: { toggle(_,value) { applied=value; } }, style: {} };
    vm.runInNewContext(script,{ document: { documentElement: root }, window: { matchMedia: () => ({matches:systemDark}) }, localStorage: { getItem: () => saved } });
    const expected=saved==='dark' || (saved!=='light' && systemDark);
    assert.equal(applied,expected); assert.equal(root.style.colorScheme,expected?'dark':'light');
  }
});

test('footer uses theme surfaces and all social links have accessible names', () => {
  const path=require('node:path');
  const css=fs.readFileSync(path.join(__dirname,'../css/main.css'),'utf8');
  const footerRule=css.match(/#footer\s*\{([^}]+)\}/)[1];
  assert.match(footerRule,/background:\s*var\(--surface\)/);
  assert.match(footerRule,/color:\s*var\(--text\)/);
  const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
  const links=html.match(/<div class="footer-links">([\s\S]*?)<\/div>/)[1];
  const anchors=[...links.matchAll(/<a\b[^>]+>/g)];
  assert.equal(anchors.length,5);
  assert.ok(anchors.every(match=>/aria-label="[^"]+"/.test(match[0])));
});

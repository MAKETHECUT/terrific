// Immediately reset scroll position on page load to prevent accumulation
(function() {
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
})();

// Initialize favicon immediately when DOM is ready
(function initFaviconEarly() {
  if (document.head) {
    const head = document.head;
    const faviconSelectors = [
      'link[rel="icon"]',
      'link[rel="shortcut icon"]',
      'link[rel="apple-touch-icon"]',
      'link[rel="apple-touch-icon-precomposed"]',
      'link[rel="mask-icon"]',
      'link[href*="favicon"]',
      'link[href*="fav-icon"]'
    ];
    faviconSelectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(link => link.remove());
    });
    Array.from(head.querySelectorAll('link')).forEach(link => {
      const href = link.getAttribute('href') || '';
      const rel = link.getAttribute('rel') || '';
      if (href.includes('favicon') || href.includes('fav-icon') || 
          rel.includes('icon') || rel.includes('apple-touch')) {
        link.remove();
      }
    });
    const svgFavicon = document.createElement('link');
    svgFavicon.rel = 'icon';
    svgFavicon.type = 'image/svg+xml';
    svgFavicon.href = 'https://cdn.prod.website-files.com/6953a8efd7ae06cf48d7ccb7/6953bc7c4d2b0878086b9762_terrific-digital-symbol.svg';
    head.insertBefore(svgFavicon, head.firstChild);
    const pngFavicon32 = document.createElement('link');
    pngFavicon32.rel = 'icon';
    pngFavicon32.type = 'image/png';
    pngFavicon32.sizes = '32x32';
    pngFavicon32.href = 'https://cdn.prod.website-files.com/6953a8efd7ae06cf48d7ccb7/6953bc7bf09d4a3da3fe2729_fav-icon.png';
    head.insertBefore(pngFavicon32, head.firstChild);
    const pngFavicon16 = document.createElement('link');
    pngFavicon16.rel = 'icon';
    pngFavicon16.type = 'image/png';
    pngFavicon16.sizes = '16x16';
    pngFavicon16.href = 'https://cdn.prod.website-files.com/6953a8efd7ae06cf48d7ccb7/6953bc7bf09d4a3da3fe2729_fav-icon.png';
    head.insertBefore(pngFavicon16, head.firstChild);
    const appleTouchIcon = document.createElement('link');
    appleTouchIcon.rel = 'apple-touch-icon';
    appleTouchIcon.sizes = '180x180';
    appleTouchIcon.href = 'https://cdn.prod.website-files.com/6953a8efd7ae06cf48d7ccb7/6953bc7bf09d4a3da3fe2729_fav-icon.png';
    head.insertBefore(appleTouchIcon, head.firstChild);
    const maskIcon = document.createElement('link');
    maskIcon.rel = 'mask-icon';
    maskIcon.href = 'https://cdn.prod.website-files.com/6953a8efd7ae06cf48d7ccb7/6953bc7c4d2b0878086b9762_terrific-digital-symbol.svg';
    maskIcon.setAttribute('color', '#100F11');
    head.insertBefore(maskIcon, head.firstChild);
  } else if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFaviconEarly);
  }
})();

/* ==============================================
   CONFIGURATION - All Settings Here
============================================== */

const CONFIG = {
  easing: {
    cubicBezier: "cubic-bezier(0.1, 0.9, 0, 1)",
    duration: 0.7,
    gsapPreset: null
  },
  splitText: {
    stagger: 0.10,
    duration: 1,
    ease: "power4.out"
  },
  carousels: {
    testimonials: { stagger: 0.05, duration: 0.5, ease: "power2.out" },
    numbers: { stagger: 0.05, duration: 0.5, ease: "power2.out" }
  },
  teamSlider: {
    breakpoints: { mobile: 768, tablet: 1200 },
    visible: { mobile: 1, tablet: 2, desktop: 3 },
    gaps: { mobile: 20, desktop: 40 },
    swipeThreshold: 50
  },
  transition: {
    duration: 0.6,
    cubicBezier: "cubic-bezier(0.50, 0.20, 0, 1)",
    ease: null, 
    overlayOpacity: 0.6,
    currentPageY: -300,
    currentPageScale: 1.5, // Scale applied to current page during transition
    incomingPageStartY: 0,
    incomingPageEndY: 0,
    overlayZIndex: 50,
    containerZIndex: 100
  },
  visibility: {
    scrollDisableDuration: 50
  },
  cubeLogo: {
    maxRotation: 20,
    maxTilt: 5,
    moveStrength: 0.10,
    lerpFactor: 0.03,
    velocitySmoothing: 0.88,
    friction: 0.94,
    momentumStrength: 0.08
  },
  scrollReset: {
    navbarThreshold: 10,
    hideThreshold: 1080,
    scrollDiff: 10
  }
};

/* ==============================================
   Utility Functions
============================================== */

const resetScroll = () => {
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
};

const qs = (sel, el = document) => el.querySelector(sel);
const qsa = (sel, el = document) => el.querySelectorAll(sel);

const waitForImages = () => {
  return new Promise((resolve) => {
    const images = Array.from(document.querySelectorAll('img'));
    if (images.length === 0) {
      resolve();
      return;
    }
    let loaded = 0;
    let errored = 0;
    const total = images.length;
    let resolved = false;
    const checkComplete = () => {
      if (!resolved && loaded + errored === total) {
        resolved = true;
        resolve();
      }
    };
    images.forEach((img) => {
      if (img.complete && (img.naturalWidth > 0 || img.naturalHeight > 0)) {
        loaded++;
      } else if (img.complete) {
        errored++;
      } else {
        const onLoad = () => {
          loaded++;
          img.removeEventListener('load', onLoad);
          img.removeEventListener('error', onError);
          checkComplete();
        };
        const onError = () => {
          errored++;
          img.removeEventListener('load', onLoad);
          img.removeEventListener('error', onError);
          checkComplete();
        };
        img.addEventListener('load', onLoad);
        img.addEventListener('error', onError);
      }
    });
    checkComplete();
    setTimeout(() => {
      if (!resolved) {
        resolved = true;
        resolve();
      }
    }, 3000);
  });
};

/* ==============================================
   Favicon Injection
============================================== */

function initFavicon() {
  const head = document.head || document.getElementsByTagName('head')[0];
  if (!head) return;
  
  // Remove ALL existing favicon links (including webflow's and any other)
  const faviconSelectors = [
    'link[rel="icon"]',
    'link[rel="shortcut icon"]',
    'link[rel="apple-touch-icon"]',
    'link[rel="apple-touch-icon-precomposed"]',
    'link[rel="mask-icon"]',
    'link[href*="favicon"]',
    'link[href*="fav-icon"]'
  ];
  faviconSelectors.forEach(selector => {
    qsa(selector, head).forEach(link => link.remove());
  });
  
  // Also remove any existing favicon link by checking href
  Array.from(head.querySelectorAll('link')).forEach(link => {
    const href = link.getAttribute('href') || '';
    const rel = link.getAttribute('rel') || '';
    if (href.includes('favicon') || href.includes('fav-icon') || 
        rel.includes('icon') || rel.includes('apple-touch')) {
      link.remove();
    }
  });
  
  // SVG favicon (best for transparent background and scalable) - from Webflow CDN
  const svgFavicon = document.createElement('link');
  svgFavicon.rel = 'icon';
  svgFavicon.type = 'image/svg+xml';
  svgFavicon.href = 'https://cdn.prod.website-files.com/6953a8efd7ae06cf48d7ccb7/6953bc7c4d2b0878086b9762_terrific-digital-symbol.svg';
  head.insertBefore(svgFavicon, head.firstChild);
  
  // Standard PNG favicons (fallback for older browsers) - from Webflow CDN
  const pngFavicon32 = document.createElement('link');
  pngFavicon32.rel = 'icon';
  pngFavicon32.type = 'image/png';
  pngFavicon32.sizes = '32x32';
  pngFavicon32.href = 'https://cdn.prod.website-files.com/6953a8efd7ae06cf48d7ccb7/6953bc7bf09d4a3da3fe2729_fav-icon.png';
  head.insertBefore(pngFavicon32, head.firstChild);
  
  const pngFavicon16 = document.createElement('link');
  pngFavicon16.rel = 'icon';
  pngFavicon16.type = 'image/png';
  pngFavicon16.sizes = '16x16';
  pngFavicon16.href = 'https://cdn.prod.website-files.com/6953a8efd7ae06cf48d7ccb7/6953bc7bf09d4a3da3fe2729_fav-icon.png';
  head.insertBefore(pngFavicon16, head.firstChild);
  
  // Apple Touch Icon (for iOS devices) - from Webflow CDN
  const appleTouchIcon = document.createElement('link');
  appleTouchIcon.rel = 'apple-touch-icon';
  appleTouchIcon.sizes = '180x180';
  appleTouchIcon.href = 'https://cdn.prod.website-files.com/6953a8efd7ae06cf48d7ccb7/6953bc7bf09d4a3da3fe2729_fav-icon.png';
  head.insertBefore(appleTouchIcon, head.firstChild);
  
  // Safari Pinned Tab (mask icon - for transparent favicon with custom color) - from Webflow CDN
  const maskIcon = document.createElement('link');
  maskIcon.rel = 'mask-icon';
  maskIcon.href = 'https://cdn.prod.website-files.com/6953a8efd7ae06cf48d7ccb7/6953bc7c4d2b0878086b9762_terrific-digital-symbol.svg';
  maskIcon.setAttribute('color', '#100F11');
  head.insertBefore(maskIcon, head.firstChild);
  
  // Force browser to reload favicon by updating link
  const existingFaviconLink = head.querySelector('link[rel="icon"]');
  if (existingFaviconLink) {
    const newLink = existingFaviconLink.cloneNode(true);
    existingFaviconLink.parentNode.replaceChild(newLink, existingFaviconLink);
  }
}

// Cache for SVG content to avoid repeated fetches
const svgCache = new Map();

function convertLogoToInlineSVG() {
  const ps = [];
  const lc = qs(".logo");
  if (lc && !lc.querySelector("svg")) {
    const li = lc.querySelector("img");
    if (li) {
      const ll = li.closest("a"), sp = li.src;
      if (svgCache.has(sp)) {
        // Use cached SVG
        const cachedSvg = svgCache.get(sp).cloneNode(true);
        cachedSvg.querySelectorAll("path").forEach(pa => { pa.classList.add("logo-text"); pa.removeAttribute("fill"); });
        cachedSvg.style.maxWidth = "168px";
        cachedSvg.style.height = "auto";
        const nc = document.createElement("div");
        nc.className = "logo";
        ll ? (na = document.createElement("a"), na.href = ll.href, na.appendChild(cachedSvg), nc.appendChild(na)) : nc.appendChild(cachedSvg);
        if (lc.parentNode) lc.parentNode.replaceChild(nc, lc);
      } else {
        ps.push(fetch(sp).then(r => r.text()).then(st => {
          const dp = new DOMParser(), sd = dp.parseFromString(st, "image/svg+xml"), se = sd.querySelector("svg");
          if (se) {
            // Cache the SVG for future use
            svgCache.set(sp, se.cloneNode(true));
            se.querySelectorAll("path").forEach(pa => { pa.classList.add("logo-text"); pa.removeAttribute("fill"); });
            se.style.maxWidth = "168px";
            se.style.height = "auto";
            const nc = document.createElement("div");
            nc.className = "logo";
            ll ? (na = document.createElement("a"), na.href = ll.href, na.appendChild(se), nc.appendChild(na)) : nc.appendChild(se);
            if (lc.parentNode) lc.parentNode.replaceChild(nc, lc);
          }
        }).catch(() => {}));
      }
    }
  }
  const flc = qs(".footer-logo");
  if (flc && !flc.querySelector("svg")) {
    const fli = flc.querySelector("img");
    if (fli) {
      const fsp = fli.src;
      if (svgCache.has(fsp)) {
        // Use cached SVG
        const cachedSvg = svgCache.get(fsp).cloneNode(true);
        cachedSvg.querySelectorAll("path").forEach(pa => { pa.classList.add("logo-text"); pa.removeAttribute("fill"); });
        cachedSvg.style.width = fli.style.width || fli.getAttribute("width") || "100%";
        cachedSvg.style.height = "auto";
        fli.replaceWith(cachedSvg);
      } else {
        ps.push(fetch(fsp).then(r => r.text()).then(st => {
          const dp = new DOMParser(), sd = dp.parseFromString(st, "image/svg+xml"), se = sd.querySelector("svg");
          if (se) {
            // Cache the SVG for future use
            svgCache.set(fsp, se.cloneNode(true));
            se.querySelectorAll("path").forEach(pa => { pa.classList.add("logo-text"); pa.removeAttribute("fill"); });
            se.style.width = fli.style.width || fli.getAttribute("width") || "100%";
            se.style.height = "auto";
            fli.replaceWith(se);
          }
        }).catch(() => {}));
      }
    }
  }
  return Promise.all(ps);
}

function updateHeaderForDarkTheme() {
  const header = qs(".header");
  if (!header) return;
  header.classList.toggle("dark-theme", document.body.classList.contains("dark-mode"));
}

/* ==============================================
   Easing Configuration
============================================== */

const parseCubicBezier = (str) => {
  if (typeof str !== 'string') return null;
  const match = str.match(/cubic-bezier\s*\(\s*([^,]+)\s*,\s*([^,]+)\s*,\s*([^,]+)\s*,\s*([^)]+)\s*\)/);
  if (!match) return null;
  return { x1: parseFloat(match[1]), y1: parseFloat(match[2]), x2: parseFloat(match[3]), y2: parseFloat(match[4]) };
};

const createCubicBezierEase = (x1, y1, x2, y2) => {
  const bez = (t, p0, p1, p2, p3) => Math.pow(1 - t, 3) * p0 + 3 * Math.pow(1 - t, 2) * t * p1 + 3 * (1 - t) * Math.pow(t, 2) * p2 + Math.pow(t, 3) * p3;
  return t => {
    if (t === 0 || t === 1) return t;
    let t0 = 0, t1 = 1;
    for (let i = 0; i < 8; i++) {
      const tMid = (t0 + t1) / 2;
      bez(tMid, 0, x1, x2, 1) < t ? t0 = tMid : t1 = tMid;
    }
    return bez((t0 + t1) / 2, 0, y1, y2, 1);
  };
};

const getEasing = () => {
  if (CONFIG.easing.gsapPreset) return CONFIG.easing.gsapPreset;
  const bezierValues = parseCubicBezier(CONFIG.easing.cubicBezier);
  if (!bezierValues) return createCubicBezierEase(0.59, 0.15, 0, 0.99);
  return createCubicBezierEase(bezierValues.x1, bezierValues.y1, bezierValues.x2, bezierValues.y2);
};

window.EASING = {
  main: getEasing(),
  cssString: CONFIG.easing.gsapPreset ? null : CONFIG.easing.cubicBezier,
  duration: CONFIG.easing.duration
};

/* ==============================================
   Split Text Animation
============================================== */

const ANIMATED_ELEMENTS_SELECTOR = ".audit-list, h1, h2, h3, h4, h5, h6, p, .indicator, .text-link, .reveal-link";
const EXCLUDED_CONTAINERS = ['.testimonial-card', '.numbers-set'];
const HEADINGS_SCROLL_TRIGGER_CONFIG = { start: "top 90%", toggleActions: "play none none none" };

function animateSplitText(element, options = {}) {
  const { type = "lines", direction = "in", stagger = CONFIG.splitText.stagger, duration = CONFIG.splitText.duration, delay = 0.1, ease = CONFIG.splitText.ease, scrollTrigger = null, onComplete = null } = options;
  const isOut = direction === "out";
  if (isOut && element._splitTextInstance) {
    const split = element._splitTextInstance, target = type === "chars" ? split.chars : split.lines;
    if (!target || target.length === 0) return null;
    return gsap.to(target, { yPercent: -100, opacity: 0, stagger, clipPath: "inset(100% 0% 0% 0%)", duration, ease, delay, onComplete });
  }
  if (element._splitTextInstance && !isOut) { element._splitTextInstance.revert(); element._splitTextInstance = null; }
  gsap.set(element, { overflow: "visible", opacity: 1, visibility: "visible" });
  const split = new SplitText(element, { type, charsClass: "char", linesClass: "line", reduceWhiteSpace: false, autoSplit: true });
  element._splitTextInstance = split;
  const target = type === "chars" ? split.chars : split.lines;
  gsap.set(target, { clipPath: "inset(0% 0% 100% 0%)", yPercent: 100 });
  const tweenConfig = { yPercent: 0, stagger, clipPath: "inset(0% -20% 0% 0%)", duration, ease, delay, onComplete: () => onComplete?.() };
  if (scrollTrigger) tweenConfig.scrollTrigger = scrollTrigger;
  return gsap.to(target, tweenConfig);
}

function cleanupSplitText(elements) {
  const elementList = Array.isArray(elements) ? elements.map(e => e.el || e).filter(Boolean) : (typeof elements === 'string' ? qsa(elements) : qsa(ANIMATED_ELEMENTS_SELECTOR));
  elementList.forEach((element) => {
    if (element._opacityScrollTrigger) { element._opacityScrollTrigger.kill(); element._opacityScrollTrigger = null; }
    if (element._linesScrollTrigger) { element._linesScrollTrigger.kill(); element._linesScrollTrigger = null; }
    if (element._splitTextInstance) {
      if (element._splitTextInstance.lines) gsap.killTweensOf(element._splitTextInstance.lines);
      if (element._splitTextInstance.chars) gsap.killTweensOf(element._splitTextInstance.chars);
      element._splitTextInstance.revert();
      element._splitTextInstance = null;
    }
  });
}

function animateHeadings() {
  setTimeout(() => {
    qsa(ANIMATED_ELEMENTS_SELECTOR).forEach((element) => {
      if (EXCLUDED_CONTAINERS.some(sel => element.closest(sel))) return;
      const scrollTriggerConfig = { trigger: element, start: HEADINGS_SCROLL_TRIGGER_CONFIG.start, end: "bottom 100%", toggleActions: HEADINGS_SCROLL_TRIGGER_CONFIG.toggleActions };
      const linesTween = animateSplitText(element, { type: "lines", direction: "in", scrollTrigger: scrollTriggerConfig });
      if (linesTween?.scrollTrigger) element._linesScrollTrigger = linesTween.scrollTrigger;
    });
  }, 0);
}

/* ==============================================
   Reusable Carousel Animation System
============================================== */

function createCarouselAnimator(getAnimatedElements, settings) {
  const animateOut = (elements, callback) => {
    let completed = 0, total = elements.length, allStarted = false;
    const checkComplete = () => {
      if (completed === total && !allStarted) {
        allStarted = true;
        callback?.();
      }
    };
    elements.forEach(({ el, stagger = settings.stagger }) => {
      if (!el?._splitTextInstance) {
        completed++;
        checkComplete();
        return;
      }
      const anim = animateSplitText(el, { direction: "out", stagger, duration: settings.duration, ease: settings.ease, delay: 0, onComplete: () => { completed++; checkComplete(); } });
      if (!anim) { completed++; checkComplete(); }
    });
    if (!elements.some(({ el }) => el?._splitTextInstance) && callback) callback();
  };
  const animateIn = (elements) => {
    elements.forEach(({ el, stagger = settings.stagger }) => {
      if (el) animateSplitText(el, { direction: "in", stagger, duration: settings.duration, ease: settings.ease, delay: 0 });
    });
  };
  return { animateOut, animateIn };
}

/* ==============================================
   Testimonials Carousel
============================================== */

let tIdx = 0, tSwitching = false;
let testimonialHandlers = { prev: null, next: null, prevImg: null, nextImg: null };

function initTestimonials() {
  const testimonials = Array.from(qsa(".testimonial-card")).map((card, i) => {
    const q = s => card.querySelector(s), ind = q(".testimonial-indicator"), quote = q("h4"), desc = q("p"), name = q(".author-name"), title = q(".author-title");
    return (ind && quote && desc && name && title) ? { card, index: i, indicator: ind } : null;
  }).filter(Boolean);
  if (!testimonials.length) return;
  const totalCount = testimonials.length;
  const formatIndicator = (idx) => `${String(idx + 1).padStart(2, '0')} / ${String(totalCount).padStart(2, '0')}`;
  testimonials.forEach((t, i) => {
    if (t.indicator) t.indicator.textContent = formatIndicator(i);
  });
  const prev = document.getElementById("testimonial-prev"), next = document.getElementById("testimonial-next");
  if (!prev || !next) return;
  if (testimonialHandlers.prev) {
    prev.removeEventListener("click", testimonialHandlers.prev);
    next.removeEventListener("click", testimonialHandlers.next);
    const prevImg = prev.querySelector("img"), nextImg = next.querySelector("img");
    if (prevImg && testimonialHandlers.prevImg) prevImg.removeEventListener("click", testimonialHandlers.prevImg);
    if (nextImg && testimonialHandlers.nextImg) nextImg.removeEventListener("click", testimonialHandlers.nextImg);
  }
  tIdx = 0;
  tSwitching = false;
  const getEls = card => [".testimonial-indicator", ".testimonial-text h4", ".testimonial-text p", ".author-name", ".author-title"].map(sel => ({ el: card.querySelector(sel) }));
  const { animateOut, animateIn } = createCarouselAnimator(getEls, CONFIG.carousels.testimonials);
  const update = idx => {
    if (idx < 0 || idx >= testimonials.length || tSwitching || idx === tIdx) return;
    tSwitching = true;
    const curr = testimonials[tIdx].card, newCard = testimonials[idx].card, currEls = getEls(curr), newEls = getEls(newCard), hasSplit = currEls.some(({ el }) => el?._splitTextInstance);
    const newIndicator = newCard.querySelector(".testimonial-indicator");
    if (newIndicator) newIndicator.textContent = formatIndicator(idx);
    newCard.style.display = "flex";
    cleanupSplitText(currEls);
    if (hasSplit) { animateOut(currEls, () => { curr.style.display = "none"; cleanupSplitText(currEls); }); animateIn(newEls); } else animateIn(newEls);
    setTimeout(() => { curr.style.display = "none"; tSwitching = false; tIdx = idx; }, 50);
  };
  const handleClick = (e, fn) => { e.preventDefault(); e.stopPropagation(); if (!tSwitching) fn(); };
  const nextFn = () => update((tIdx + 1) % testimonials.length);
  const prevFn = () => update((tIdx - 1 + testimonials.length) % testimonials.length);
  testimonialHandlers.prev = (e) => handleClick(e, prevFn);
  testimonialHandlers.next = (e) => handleClick(e, nextFn);
  prev.addEventListener("click", testimonialHandlers.prev);
  next.addEventListener("click", testimonialHandlers.next);
  const prevImg = prev.querySelector("img"), nextImg = next.querySelector("img");
  if (prevImg) { prevImg.style.pointerEvents = "auto"; testimonialHandlers.prevImg = (e) => handleClick(e, prevFn); prevImg.addEventListener("click", testimonialHandlers.prevImg); }
  if (nextImg) { nextImg.style.pointerEvents = "auto"; testimonialHandlers.nextImg = (e) => handleClick(e, nextFn); nextImg.addEventListener("click", testimonialHandlers.nextImg); }
  testimonials.forEach((t, i) => t.card.style.display = i === 0 ? "flex" : "none");
  const firstEls = getEls(testimonials[0].card);
  cleanupSplitText(firstEls);
  animateIn(firstEls);
}

/* ==============================================
   Numbers Carousel 
============================================== */

function initNumbersCarousel() {
  const carousel = qs('.numbers-carousel');
  const sets = carousel ? Array.from(carousel.querySelectorAll('.numbers-set')) : [];
  const prev = qs('.numbers-arrow-prev');
  const next = qs('.numbers-arrow-next');
  
  if (!sets.length || !prev || !next) return;
  
  let currentIndex = 0;
  let isTransitioning = false;
  
  const getElements = (set) => {
    const logo = set.querySelector('.numbers-logo img');
    const stats = [...set.querySelectorAll('.numbers-value'), ...set.querySelectorAll('.numbers-label')];
    const elements = logo ? [{ el: logo, stagger: 0 }, ...stats.map((el, i) => ({ el, stagger: CONFIG.carousels.numbers.stagger * (i + 1) }))] : stats.map((el, i) => ({ el, stagger: CONFIG.carousels.numbers.stagger * i }));
    return elements;
  };
  
  const { animateOut, animateIn } = createCarouselAnimator(getElements, CONFIG.carousels.numbers);
  
  const showSet = (index) => {
    if (index < 0 || index >= sets.length || isTransitioning || index === currentIndex) return;
    
    isTransitioning = true;
    const currentSet = sets[currentIndex];
    const newSet = sets[index];
    const currentEls = getElements(currentSet);
    const newEls = getElements(newSet);
    const hasSplit = currentEls.some(({ el }) => el?._splitTextInstance);
    
    newSet.classList.add('active');
    newSet.style.position = 'relative';
    
    cleanupSplitText(currentEls);
    
    if (hasSplit) {
      animateOut(currentEls, () => {
        currentSet.classList.remove('active');
        currentSet.style.position = 'absolute';
        cleanupSplitText(currentEls);
      });
      animateIn(newEls);
    } else {
      animateIn(newEls);
    }
    
    setTimeout(() => {
      currentSet.classList.remove('active');
      currentSet.style.position = 'absolute';
      isTransitioning = false;
      currentIndex = index;
    }, 50);
  };
  
  const handleClick = (e, direction) => {
    e.preventDefault();
    e.stopPropagation();
    if (isTransitioning) return;
    
    if (direction === 'next') {
      showSet((currentIndex + 1) % sets.length);
    } else {
      showSet((currentIndex - 1 + sets.length) % sets.length);
    }
  };
  
  prev.addEventListener('click', (e) => handleClick(e, 'prev'));
  next.addEventListener('click', (e) => handleClick(e, 'next'));
  
  const prevImg = prev.querySelector('img');
  const nextImg = next.querySelector('img');
  if (prevImg) prevImg.addEventListener('click', (e) => handleClick(e, 'prev'));
  if (nextImg) nextImg.addEventListener('click', (e) => handleClick(e, 'next'));
  
  if (sets.length) {
    sets[0].classList.add('active');
    sets[0].style.position = 'relative';
    const firstEls = getElements(sets[0]);
    cleanupSplitText(firstEls);
    animateIn(firstEls);
  }
}

/* ==============================================
   Team Slider
============================================== */

function initTeamSlider() {
  const track = qs('.team-slider-track'), left = qs('.team-arrow-left'), right = qs('.team-arrow-right');
  if (!track || !left || !right) return;
  const members = track.querySelectorAll('.team-member'), total = members.length;
  let idx = 0, tSX = 0, tSY = 0, tEX = 0, tEY = 0;
  const getVisible = () => {
    const width = window.innerWidth;
    if (width <= CONFIG.teamSlider.breakpoints.mobile) return CONFIG.teamSlider.visible.mobile;
    if (width <= CONFIG.teamSlider.breakpoints.tablet) return CONFIG.teamSlider.visible.tablet;
    return CONFIG.teamSlider.visible.desktop;
  };
  const getGap = () => window.innerWidth <= CONFIG.teamSlider.breakpoints.mobile ? CONFIG.teamSlider.gaps.mobile : CONFIG.teamSlider.gaps.desktop;
  const update = () => {
    const visible = getVisible(), maxIdx = Math.max(0, total - visible);
    if (idx > maxIdx) idx = maxIdx;
    track.style.transform = `translateX(-${idx * (members[0].offsetWidth + getGap())}px)`;
    left.disabled = idx === 0;
    right.disabled = idx >= maxIdx;
  };
  left.addEventListener('click', () => { if (idx > 0) { idx--; update(); } });
  right.addEventListener('click', () => { const visible = getVisible(), maxIdx = Math.max(0, total - visible); if (idx < maxIdx) { idx++; update(); } });
  track.addEventListener('touchstart', (e) => { tSX = e.changedTouches[0].screenX; tSY = e.changedTouches[0].screenY; }, { passive: true });
  track.addEventListener('touchend', (e) => {
    tEX = e.changedTouches[0].screenX; tEY = e.changedTouches[0].screenY;
    const dX = tEX - tSX, dY = tEY - tSY, aX = Math.abs(dX), aY = Math.abs(dY);
    if (aX > aY && aX > CONFIG.teamSlider.swipeThreshold) {
      const visible = getVisible(), maxIdx = Math.max(0, total - visible);
      if (dX > 0 && idx > 0) { idx--; update(); } else if (dX < 0 && idx < maxIdx) { idx++; update(); }
    }
  }, { passive: true });
  update();
  window.addEventListener('resize', update);
}

/* ==============================================
   Road Progress Bar 
============================================== */

function initRoadProgressBar() {
  const c = qs('.road-container'), d = qsa('.road-progress-dot'), i = qs('.road-progress-indicator'), b = qs('.road-progress-bar');
  if (!d.length || !c || !i || !b) return;
  const h = 80, w = 20, getPos = () => Array.from(d).map(dot => { const r = dot.getBoundingClientRect(), br = b.getBoundingClientRect(); return r.top - br.top + r.height / 2; });
  let pos = getPos();
  window.addEventListener('resize', () => pos = getPos());
  gsap.set(i, { position: 'absolute', left: '50%', top: 0, xPercent: -50, width: w, height: 0 });
  ScrollTrigger.create({
    trigger: c, start: "top 50%", end: "bottom 50%", scrub: 1,
    onUpdate: (s) => {
      const p = s.progress, ht = p <= 0.03 ? h * (p / 0.03) : p >= 0.97 ? h * (1 - (p - 0.97) / 0.03) : h, ch = ht, mt = b.offsetHeight - ch, tp = p * mt, ic = tp + ch / 2, li = d.length - 1;
      gsap.set(i, { top: tp, height: ht, xPercent: -50 });
      d.forEach((dot, idx) => dot.classList.toggle('active', idx === li ? (p >= 0.95 || ic >= pos[idx]) : ic >= pos[idx]));
    }
  });
}

/* ==============================================
   Cube Animations - Per Section Cubes
============================================== */

function initCubeAnimations() {
  if (typeof gsap === 'undefined') return;
  const ih = window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/');
  if (!ih) return;
  const pw = qs('.page-wrapper');
  if (!pw) return;
  qsa('.cube-container-section').forEach(cc => {
    const c3 = cc.querySelector('.cube-3d');
    if (c3 && c3._rotationAnimation) c3._rotationAnimation.kill();
    if (c3 && c3._parallaxScrollTrigger) { c3._parallaxScrollTrigger.kill(); c3._parallaxScrollTrigger = null; }
    cc.remove();
  });
  const ss = Array.from(qsa('section')).filter(s => {
    const ish = s.classList.contains('hero');
    const isf = s.classList.contains('footer') || s.querySelector('.footer-badges') !== null;
    const hbc = s.querySelector('.big-cta') !== null;
    const hf = s.querySelector('.frame') !== null;
    const hrc = s.querySelector('.road-container') !== null;
    return !ish && !isf && !hbc && (hf || hrc);
  });
  if (ss.length === 0) return;
  const gcc = (vn) => getComputedStyle(document.documentElement).getPropertyValue(vn).trim();
  const htr = (h) => { const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(h); return r ? { r: parseInt(r[1], 16), g: parseInt(r[2], 16), b: parseInt(r[3], 16) } : null; };
  const pc = (h, wp) => { const rgb = htr(h); if (!rgb) return h; const R = Math.round(rgb.r * (1 - wp / 100) + 255 * (wp / 100)); const G = Math.round(rgb.g * (1 - wp / 100) + 255 * (wp / 100)); const B = Math.round(rgb.b * (1 - wp / 100) + 255 * (wp / 100)); return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1); };
  const cn = ['orange', 'purple', 'green', 'blue', 'pink', 'turquoise', 'peach'];
  ss.forEach((s, i) => {
    const ir = i % 2 === 1;
    const sc = ir ? 'cube-side-right' : 'cube-side-left';
    const cname = cn[i % cn.length];
    const bc = gcc(`--${cname}`) || '#E06C54';
    const cc = document.createElement('div');
    cc.className = `cube-container-section ${sc}`;
    cc.style.position = 'absolute';
    cc.style.top = `${s.offsetTop}px`;
    cc.style.pointerEvents = 'none';
    const c3 = document.createElement('div');
    c3.className = 'cube-3d';
    ['front', 'back', 'right', 'left', 'top', 'bottom'].forEach(f => {
      const fd = document.createElement('div');
      fd.className = `cube-face cube-${f}`;
      if (f === 'front' || f === 'back') fd.style.background = bc;
      else if (f === 'right' || f === 'left') fd.style.background = pc(bc, 25);
      else fd.style.background = pc(bc, 35);
      c3.appendChild(fd);
    });
    const sh = document.createElement('div');
    sh.className = 'cube-shadow';
    const rgb = htr(bc);
    if (rgb) sh.style.setProperty('--shadow-gradient', `radial-gradient(ellipse, rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.5) 0%, rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0) 70%)`);
    else sh.style.setProperty('--shadow-gradient', 'radial-gradient(ellipse, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0) 70%)');
    cc.appendChild(c3);
    cc.appendChild(sh);
    pw.appendChild(cc);
    const ra = gsap.to(c3, { rotationY: '+=360', rotationX: '+=180', duration: 20, ease: 'none', repeat: -1, force3D: true });
    c3._rotationAnimation = ra;
    gsap.set(cc, { y: -100 });
    const pt = gsap.to(cc, { y: 50, ease: 'none', scrollTrigger: { trigger: s, start: 'top bottom', end: 'bottom top', scrub: 1, invalidateOnRefresh: true } });
    c3._parallaxScrollTrigger = pt.scrollTrigger;
  });
  requestAnimationFrame(() => {
    ss.forEach((s, i) => {
      const cc = pw.querySelectorAll('.cube-container-section')[i];
      if (cc) cc.style.top = `${s.offsetTop}px`;
    });
  });
}

/* ==============================================
   Visibility Animation
============================================== */

function initVisibilityAnimation() {
  if (window.lenisInstance) window.lenisInstance.stop();
  const obo = document.body.style.overflow, oho = document.documentElement.style.overflow, obh = document.body.style.height, ohh = document.documentElement.style.height;
  document.body.style.overflow = 'hidden';
  document.body.style.height = '100vh';
  document.documentElement.style.overflow = 'hidden';
  document.documentElement.style.height = '100vh';
  const ps = (e) => { e.preventDefault(); e.stopPropagation(); return false; };
  const se = ['wheel', 'touchmove', 'scroll', 'mousewheel', 'DOMMouseScroll'];
  se.forEach(et => { window.addEventListener(et, ps, { passive: false, capture: true }); document.addEventListener(et, ps, { passive: false, capture: true }); });
  const res = () => {
    se.forEach(et => { window.removeEventListener(et, ps, { capture: true }); document.removeEventListener(et, ps, { capture: true }); });
    document.body.style.overflow = obo;
    document.body.style.height = obh;
    document.documentElement.style.overflow = oho;
    document.documentElement.style.height = ohh;
    if (window.lenisInstance) { window.lenisInstance.start(); window.lenisInstance.scrollTo(0, { immediate: true }); }
    resetScroll();
  };
  // Show content immediately, unlock scroll after short delay
  gsap.set("section, .hero, footer", { opacity: 1, visibility: "visible" });
  gsap.to("section, .hero, footer", { opacity: 1, visibility: "visible", duration: window.EASING.duration, ease: window.EASING.main, delay: 0 });
  setTimeout(res, CONFIG.visibility.scrollDisableDuration);
  const pw = qs(".page-wrapper:not(.transition-container .page-wrapper)");
  if (pw) {
    const has = Array.from(pw.querySelectorAll(".hero, section"));
    const iev = (el) => { if (!el) return false; const r = el.getBoundingClientRect(); return r.bottom > 0 && r.right > 0 && r.left < window.innerWidth && r.top < window.innerHeight && r.top < r.bottom && r.left < r.right; };
    const ve = has.filter(iev);
    if (ve.length) {
      const iy = window.innerHeight;
      gsap.set(ve, { y: iy, scale: 1.3, transformOrigin: "50% 0%", force3D: true, willChange: 'transform' });
      ScrollTrigger.refresh();
      gsap.to(ve, { y: 0, duration: 1, scale: 1, ease: window.EASING.main, delay: 0, immediateRender: false, force3D: true, transformOrigin: "50% 0%", onUpdate: () => ScrollTrigger.refresh() });
    }
  }
}

/* ==============================================
   3D Cube Logo
============================================== */

let globalMouseHandler = null;

function init3DCubeLogo() {
  const c = qs('.logo-cube');
  if (!c || typeof gsap === 'undefined') return;
  if (globalMouseHandler) {
    document.removeEventListener('mousemove', globalMouseHandler);
    globalMouseHandler = null;
  }
  if (c._mouseMoveRAF) {
    cancelAnimationFrame(c._mouseMoveRAF);
    c._mouseMoveRAF = null;
  }
  c.innerHTML = '';
  const cfg = [{ color: 'purple', column: 2, row: 1 }, { color: 'red', column: 1, row: 2 }, { color: 'orange', column: 2, row: 2 }, { color: 'green', column: 3, row: 2 }, { color: 'teal', column: 2, row: 3 }, { color: 'navy', column: 2, row: 4 }, { color: 'pink', column: 3, row: 4 }];
  const g = document.createElement('div');
  g.className = 'logo-grid';
  cfg.forEach((cf) => {
    const s = document.createElement('div');
    s.className = `square square--${cf.color}`;
    s.style.gridColumn = cf.column;
    s.style.gridRow = cf.row;
    ['front', 'back', 'right', 'left', 'top', 'bottom'].forEach((f) => {
      const fe = document.createElement('div');
      fe.className = `square__face square__face--${f}`;
      s.appendChild(fe);
    });
    g.appendChild(s);
  });
  c.appendChild(g);
  const sh = document.createElement('div');
  sh.className = 'logo-cube-shadow';
  c.appendChild(sh);
  const r = c.getBoundingClientRect();
  const icx = r.left + r.width / 2;
  const icy = r.top + r.height / 2;
  let mx = window.innerWidth / 2, my = window.innerHeight / 2, lmx = mx, lmy = my, mvx = 0, mvy = 0, lmt = Date.now();
  let grx = 0, gry = 0, gpx = 0, gpy = 0, raf = null, lt = performance.now();
  const hm = (e) => { mx = e.clientX; my = e.clientY; };
  globalMouseHandler = hm;
  document.addEventListener('mousemove', globalMouseHandler);
  function ucp(ct) {
    const dt = ct - lt;
    lt = ct;
    const nt = Date.now();
    const mdt = nt - lmt;
    if (mdt > 0) {
      const mdx = mx - lmx;
      const mdy = my - lmy;
      const vx = (mdx / mdt) * 1000;
      const vy = (mdy / mdt) * 1000;
      mvx = mvx * CONFIG.cubeLogo.velocitySmoothing + vx * (1 - CONFIG.cubeLogo.velocitySmoothing);
      mvy = mvy * CONFIG.cubeLogo.velocitySmoothing + vy * (1 - CONFIG.cubeLogo.velocitySmoothing);
      lmx = mx;
      lmy = my;
      lmt = nt;
    }
    mvx *= CONFIG.cubeLogo.friction;
    mvy *= CONFIG.cubeLogo.friction;
    const nmx = (mx / window.innerWidth) * 2 - 1;
    const nmy = (my / window.innerHeight) * 2 - 1;
    const mry = nmx * CONFIG.cubeLogo.maxRotation;
    const mrx = -nmy * CONFIG.cubeLogo.maxRotation;
    const mmy = (mvx / window.innerWidth) * CONFIG.cubeLogo.maxRotation * CONFIG.cubeLogo.momentumStrength;
    const mmx = -(mvy / window.innerHeight) * CONFIG.cubeLogo.maxRotation * CONFIG.cubeLogo.momentumStrength;
    const frx = mrx + mmx;
    const fry = mry + mmy;
    const mox = mx - icx;
    const moy = my - icy;
    const tpx = mox * CONFIG.cubeLogo.moveStrength;
    const tpy = moy * CONFIG.cubeLogo.moveStrength;
    const dtn = Math.min(dt / 16, 2);
    const al = 1 - Math.pow(1 - CONFIG.cubeLogo.lerpFactor, dtn);
    const eoc = (t) => 1 - Math.pow(1 - t, 3);
    const el = eoc(al);
    grx += (frx - grx) * el;
    gry += (fry - gry) * el;
    gpx += (tpx - gpx) * el;
    gpy += (tpy - gpy) * el;
    gsap.set(g, { x: gpx, y: gpy, rotationX: grx, rotationY: gry, rotationZ: 0, force3D: true, transformOrigin: "center center" });
    gsap.set(sh, { x: gpx, y: gpy, force3D: true, transformOrigin: "center center" });
    raf = requestAnimationFrame(ucp);
    c._mouseMoveRAF = raf;
  }
  const sq = g.querySelectorAll('.square');
  gsap.set(g, { rotationZ: 0, force3D: true, transformOrigin: "center center" });
  gsap.set(sh, { x: 0, y: 0, force3D: true, transformOrigin: "center center" });
  sq.forEach((s, i) => {
    gsap.set(s, { scale: 1, rotationX: 360, rotationY: 360, rotationZ: 0, z: 0, opacity: 1 });
    gsap.to(s, { scale: 1, rotationX: 0, rotationY: 0, duration: 1.2, delay: 0.5 + i * 0.1, ease: 'elastic.out(0.5, 5)' });
  });
  gsap.delayedCall(2, () => {
    raf = requestAnimationFrame(ucp);
    c._mouseMoveRAF = raf;
  });
}

/* ==============================================
   Cleanup all previous sessions
============================================== */

function cleanupAllSessions() {
  ScrollTrigger.getAll().forEach(st => st.kill());
  gsap.killTweensOf("*");
  gsap.globalTimeline.clear();
  cleanupSplitText();
  const prev = document.getElementById("testimonial-prev");
  const next = document.getElementById("testimonial-next");
  if (prev && testimonialHandlers.prev) {
    prev.removeEventListener("click", testimonialHandlers.prev);
    next?.removeEventListener("click", testimonialHandlers.next);
    const prevImg = prev.querySelector("img");
    const nextImg = next?.querySelector("img");
    if (prevImg && testimonialHandlers.prevImg) prevImg.removeEventListener("click", testimonialHandlers.prevImg);
    if (nextImg && testimonialHandlers.nextImg) nextImg.removeEventListener("click", testimonialHandlers.nextImg);
    testimonialHandlers = { prev: null, next: null, prevImg: null, nextImg: null };
  }
  const numPrev = qs('.numbers-arrow-prev');
  const numNext = qs('.numbers-arrow-next');
  if (numPrev && numNext) {
    const numPrevClone = numPrev.cloneNode(true);
    const numNextClone = numNext.cloneNode(true);
    numPrev.parentNode?.replaceChild(numPrevClone, numPrev);
    numNext.parentNode?.replaceChild(numNextClone, numNext);
  }
  const track = qs('.team-slider-track');
  const teamLeft = qs('.team-arrow-left');
  const teamRight = qs('.team-arrow-right');
  if (track) {
    const trackClone = track.cloneNode(true);
    track.parentNode?.replaceChild(trackClone, track);
  }
  if (teamLeft && teamRight) {
    const teamLeftClone = teamLeft.cloneNode(true);
    const teamRightClone = teamRight.cloneNode(true);
    teamLeft.parentNode?.replaceChild(teamLeftClone, teamLeft);
    teamRight.parentNode?.replaceChild(teamRightClone, teamRight);
  }
  qsa('.cube-container-section').forEach(cc => {
    const c3 = cc.querySelector('.cube-3d');
    if (c3 && c3._rotationAnimation) c3._rotationAnimation.kill();
    if (c3 && c3._parallaxScrollTrigger) { c3._parallaxScrollTrigger.kill(); c3._parallaxScrollTrigger = null; }
    cc.remove();
  });
  const logoCube = qs('.logo-cube');
  if (logoCube) {
    if (logoCube._mouseMoveRAF) {
      cancelAnimationFrame(logoCube._mouseMoveRAF);
      logoCube._mouseMoveRAF = null;
    }
    if (globalMouseHandler) {
      document.removeEventListener('mousemove', globalMouseHandler);
      globalMouseHandler = null;
    }
  }
  tIdx = 0;
  tSwitching = false;
  if (navbarScrollRAF) {
    cancelAnimationFrame(navbarScrollRAF);
    navbarScrollRAF = null;
  }
}

/* ==============================================
   Reinitialize all page functions
============================================== */

async function reinitializePageFunctions(skipVisibilityAnimation = false) {
  cleanupAllSessions();
  initFavicon();
  // Convert logos asynchronously without blocking
  convertLogoToInlineSVG().catch(() => {});
  autoAssignSectionClasses();
  
  // Wait for all images to load before initializing scroll triggers
  await waitForImages();
  
  // Wait additional frame to ensure layout is stable
  await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  
  ScrollTrigger.refresh();
  animateHeadings();
  requestAnimationFrame(() => ScrollTrigger.refresh());
  initTestimonials();
  initNumbersCarousel();
  initTeamSlider();
  initAuditFormCheckmarks();
  initRoadProgressBar();
  initCubeAnimations();
  init3DCubeLogo();
  initScrollToTopButton();
  initFAQAccordion();
  initCodeCopyButtons();
  initNavbarScroll();
  initFrameCorners();
  if (!skipVisibilityAnimation) {
    initVisibilityAnimation();
  }
}

window.reinitializePageFunctions = reinitializePageFunctions;
window.cleanupAllSessions = cleanupAllSessions;

/* ==============================================
   Page Transition
============================================== */

const T = CONFIG.transition;
let lU = "", iT = false, aT = null;
const sC = `position:fixed;top:0;left:0;width:100%;height:100%;z-index:${T.containerZIndex};clip-path:inset(100% 0 0 0)`;
const sO = `position:fixed;top:0;left:0;width:100%;height:100%;background:black;opacity:0;z-index:${T.overlayZIndex};pointer-events:auto`;
const getTransitionEasing = () => {
  // If explicit GSAP ease string is provided, use it
  if (T.ease) return T.ease;
  
  // Otherwise, use transition-specific cubic bezier or fall back to general easing
  const bezierString = T.cubicBezier || CONFIG.easing.cubicBezier;
  const bezierValues = parseCubicBezier(bezierString);
  if (bezierValues) {
    return createCubicBezierEase(bezierValues.x1, bezierValues.y1, bezierValues.x2, bezierValues.y2);
  }
  
  // Fallback to window.EASING.main
  return window.EASING.main;
};

const getTransitionAnims = () => {
  const ease = getTransitionEasing();
  return {
    aO: { opacity: T.overlayOpacity, duration: T.duration, ease: ease },
    aC: { y: T.currentPageY, scale: T.currentPageScale, duration: T.duration, ease: ease },
    aP: { clipPath: "inset(0% 0 0 0)", duration: T.duration, ease: ease },
    aI: { y: T.incomingPageEndY, duration: T.duration, ease: ease }
  };
};

const pageCache = new Map();
const prefetchPage = async (url) => {
  if (pageCache.has(url)) return;
  try {
    const html = await (await fetch(url)).text();
    const d = new DOMParser().parseFromString(html, "text/html");
    pageCache.set(url, { html, doc: d });
  } catch (e) {}
};

function cleanupTransition(resetTransitionFlag = false) {
  if (aT) { aT.kill(); aT = null; }
  qsa('.transition-container').forEach(c => {
    c.querySelectorAll('.page-wrapper').forEach(w => gsap.killTweensOf(w));
    gsap.killTweensOf(c);
    c.remove();
  });
  qsa('.transition-overlay').forEach(o => {
    gsap.killTweensOf(o);
    o.remove();
  });
  const pw = qs(".page-wrapper:not(.transition-container .page-wrapper)");
  if (pw) {
    gsap.killTweensOf(pw);
    gsap.set(pw, { y: 0, scale: 1, transformOrigin: "50% 50%", clearProps: "all" });
  }
  if (document.body.style.pointerEvents === "none") document.body.style.pointerEvents = "";
  if (resetTransitionFlag) iT = false;
}

function forceStyleRecalc(element) {
  if (!element) return;
  void element.offsetHeight;
  requestAnimationFrame(() => { void element.offsetHeight; });
}

async function pageTransition(url) {
  if (iT) return;
  iT = true;
  cleanupTransition();
  if (lenisInstance) lenisInstance.stop();
  let o = null, tc = null;
  const safetyTimeout = setTimeout(() => {
    if (iT) {
      cleanupTransition(true);
      document.body.style.pointerEvents = "";
      if (lenisInstance) lenisInstance.start();
    }
  }, 10000);
  try {
    let urlObj, hash, urlWithoutHash;
    try {
      urlObj = new URL(url, window.location.origin);
      hash = urlObj.hash;
      urlWithoutHash = urlObj.pathname + urlObj.search;
    } catch (e) {
      const hashMatch = url.match(/#(.+)$/);
      hash = hashMatch ? `#${hashMatch[1]}` : '';
      urlWithoutHash = url.split('#')[0];
      urlObj = { hash };
    }
    const cp = qs(".page-wrapper:not(.transition-container .page-wrapper)");
    if (cp) {
      const r = cp.getBoundingClientRect(), cx = window.innerWidth / 2, cy = window.innerHeight / 2;
      const ox = ((cx - r.left) / r.width) * 100, oy = ((cy - r.top) / r.height) * 100;
      gsap.set(cp, { transformOrigin: `${ox}% ${oy}%` });
    }
    o = document.createElement("div");
    o.className = "transition-overlay";
    o.style.cssText = sO;
    document.body.appendChild(o);
    const anims = getTransitionAnims();
    const loadPage = async () => {
      let d, npw;
      if (pageCache.has(urlWithoutHash)) {
        const cached = pageCache.get(urlWithoutHash);
        d = cached.doc;
        npw = d.querySelector(".page-wrapper");
      } else {
        const html = await (await fetch(urlWithoutHash)).text();
        d = new DOMParser().parseFromString(html, "text/html");
        pageCache.set(urlWithoutHash, { html, doc: d });
        npw = d.querySelector(".page-wrapper");
      }
      if (!npw) throw new Error("No page wrapper found");
      const bodyClasses = Array.from(d.body.classList).filter(c => c === "light-mode" || c === "dark-mode");
      return { doc: d, pageWrapper: npw, bodyMode: bodyClasses[0] || null };
    };
    // Start animation immediately, don't wait for page load
    gsap.to(o, anims.aO);
    gsap.to(".page-wrapper:not(.transition-container .page-wrapper)", anims.aC);
    
    // Start loading page in parallel
    const pageDataPromise = loadPage();
    
    // Create transition container immediately
    const currentBg = document.body.classList.contains("dark-mode") ? "var(--black)" : "var(--white)";
    tc = document.createElement("div");
    tc.className = "transition-container";
    tc.style.cssText = sC;
    tc.style.setProperty("background", currentBg, "important");
    const nw = document.createElement("div");
    nw.className = "page-wrapper";
    nw.style.setProperty("background", currentBg, "important");
    tc.appendChild(nw);
    document.body.appendChild(tc);
    forceStyleRecalc(tc);
    
    // Start incoming page animation immediately, don't wait for content
    gsap.set(nw, { y: T.incomingPageStartY, opacity: 0 });
    const containerAnim = gsap.to(tc, anims.aP);
    const pageAnim = gsap.to(nw, { ...anims.aI, opacity: 1 });
    
    // Wait for page data in parallel with animation
    const pageData = await pageDataPromise;
    
    // Update content as soon as it's loaded (may happen during animation)
    const bodyMode = pageData.bodyMode;
    const bg = bodyMode === "dark-mode" ? "var(--black)" : "var(--white)";
    if (bodyMode) tc.classList.add(bodyMode);
    tc.style.setProperty("background", bg, "important");
    nw.innerHTML = pageData.pageWrapper.innerHTML;
    nw.style.setProperty("background", bg, "important");
    forceStyleRecalc(nw);
    
    // Wait for animations to complete
    await Promise.all([containerAnim, pageAnim]);
    
    // Update page content immediately after transition
    if (bodyMode) {
      document.body.classList.remove("light-mode", "dark-mode");
      document.body.classList.add(bodyMode);
    }
    updateHeaderForDarkTheme();
    
    // Clean up all Webflow data attributes before updating with new page
    const currentHtmlElement = document.documentElement;
    const currentBody = document.body;
    Array.from(currentHtmlElement.attributes).forEach(attr => {
      if (attr.name.startsWith('data-wf-')) {
        currentHtmlElement.removeAttribute(attr.name);
      }
    });
    Array.from(currentBody.attributes).forEach(attr => {
      if (attr.name.startsWith('data-wf-')) {
        currentBody.removeAttribute(attr.name);
      }
    });
    
    // Update with new page's Webflow data attributes and other data attributes
    const newHtmlElement = pageData.doc.documentElement;
    const newBody = pageData.doc.body;
    Array.from(newHtmlElement.attributes).forEach(attr => {
      if (attr.name.startsWith('data-')) {
        currentHtmlElement.setAttribute(attr.name, attr.value);
      }
    });
    Array.from(newBody.attributes).forEach(attr => {
      if (attr.name.startsWith('data-') || attr.name === 'class') {
        currentBody.setAttribute(attr.name, attr.value);
      }
    });
    
    const cw = qs(".page-wrapper:not(.transition-container .page-wrapper)");
    if (cw && pageData.pageWrapper) {
      cw.innerHTML = pageData.pageWrapper.innerHTML;
      forceStyleRecalc(cw);
      await new Promise(r => requestAnimationFrame(r));
      gsap.set(cw, { y: 0, scale: 1, opacity: 1, transformOrigin: "50% 50%", clearProps: "all" });
    }
    
    clearTimeout(safetyTimeout);
    cleanupTransition(true);
    document.title = pageData.doc.title;
    gsap.set("section, .hero, footer", { opacity: 1, visibility: "visible", clearProps: "opacity,visibility" });
    resetScroll();
    if (lenisInstance) lenisInstance.start();
    cleanupAllSessions();
    if (window.reinitializePageFunctions) await window.reinitializePageFunctions();
    initPageTransitions();
    
    // After reinitialize, scroll to section if there's a hash
    if (hash) {
      const targetHash = hash && hash.startsWith('#') ? hash : hash ? `#${hash}` : '';
      if (targetHash) {
        setTimeout(() => {
          const targetElement = document.querySelector(targetHash);
          if (targetElement) {
            const rect = targetElement.getBoundingClientRect();
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const elementTop = rect.top + scrollTop;
            
            if (lenisInstance) {
              lenisInstance.scrollTo(elementTop, { 
                duration: window.EASING.duration * 2, 
                easing: window.EASING.main,
                immediate: false
              });
            } else {
              window.scrollTo({ top: elementTop, behavior: 'smooth' });
            }
          }
        }, 400);
      }
    }
  } catch (e) {
    clearTimeout(safetyTimeout);
    cleanupTransition(true);
    document.body.style.pointerEvents = "";
    if (lenisInstance) lenisInstance.start();
    window.location.href = url;
  }
}

function navigateWithAnimation(e, l) {
  if (iT) { e.preventDefault(); return; }
  const le = l || this, u = le.getAttribute("href");
  if (!u || le.getAttribute("target") === "_blank" || u.startsWith("mailto:") || u.startsWith("tel:")) return;
  if (u === "#" || u === window.location.pathname + window.location.search) {
    e.preventDefault();
    if (lenisInstance) {
      lenisInstance.scrollTo(0, { 
        duration: window.EASING.duration * 2, 
        easing: window.EASING.main,
        immediate: false
      });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    return;
  }
  
  // Normalize URLs that point to homepage (index.html) with hash
  let normalizedUrl = u;
  const hashMatch = u.match(/#(.+)$/);
  const hash = hashMatch ? `#${hashMatch[1]}` : '';
  const pathWithoutHash = u.split('#')[0];
  
  // Check if current page is homepage
  const isCurrentHomepage = window.location.pathname.endsWith('index.html') || 
                            window.location.pathname === '/' || 
                            window.location.pathname.endsWith('/');
  
  // Check if this is a link to index.html (homepage)
  const isHomepageLink = pathWithoutHash === 'index.html' || 
                         pathWithoutHash === '/index.html' || 
                         pathWithoutHash === './index.html' ||
                         pathWithoutHash === '' ||
                         pathWithoutHash === '/';
  
  // If link starts with # only (hash-only link) and we're not on homepage, redirect to homepage
  if (u.startsWith('#') && !isCurrentHomepage && hash) {
    normalizedUrl = '/index.html' + hash;
  } else if (isHomepageLink && hash) {
    // Normalize to /index.html#hash
    normalizedUrl = '/index.html' + hash;
  }
  
  let urlObj, isSamePage;
  try {
    urlObj = new URL(normalizedUrl, window.location.origin);
    isSamePage = urlObj.pathname === window.location.pathname;
  } catch (e) {
    const normalizedPath = pathWithoutHash.replace(/^\.\//, '').replace(/^\/+/, '');
    const currentPath = window.location.pathname.replace(/\/$/, '') || '/';
    isSamePage = normalizedPath === '' || normalizedPath === currentPath.split('/').pop() || pathWithoutHash === currentPath || (isHomepageLink && (currentPath === '/index.html' || currentPath === '/'));
  }
  
  // Check if normalized URL points to homepage
  const normalizedPointsToHomepage = normalizedUrl.startsWith('/index.html') || normalizedUrl.startsWith('/#') || normalizedUrl === '/';
  
  // If we're on homepage and link is to homepage with hash, just scroll - no page transition
  if (isCurrentHomepage && isHomepageLink && hash) {
    e.preventDefault();
    const targetElement = document.querySelector(hash);
    if (targetElement) {
      // Wait for layout to stabilize
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          ScrollTrigger.refresh();
          // Get the exact top position of the section
          const rect = targetElement.getBoundingClientRect();
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          const elementTop = rect.top + scrollTop;
          
          if (lenisInstance) {
            lenisInstance.scrollTo(elementTop, { 
              duration: window.EASING.duration * 2, 
              easing: window.EASING.main,
              immediate: false
            });
          } else {
            window.scrollTo({ top: elementTop, behavior: 'smooth' });
          }
        });
      });
    }
    history.pushState({}, "", normalizedUrl);
    return;
  }
  
  if (isSamePage && hash) {
    e.preventDefault();
    const targetElement = document.querySelector(hash);
    if (targetElement) {
      // Wait for layout to stabilize
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          ScrollTrigger.refresh();
          // Get the exact top position of the section
          const rect = targetElement.getBoundingClientRect();
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          const elementTop = rect.top + scrollTop;
          
          if (lenisInstance) {
            lenisInstance.scrollTo(elementTop, { 
              duration: window.EASING.duration * 2, 
              easing: window.EASING.main,
              immediate: false
            });
          } else {
            window.scrollTo({ top: elementTop, behavior: 'smooth' });
          }
        });
      });
    }
    history.pushState({}, "", normalizedUrl);
    return;
  }
  
  // If it's a homepage link with hash but not same page, normalize URL for transition
  if (normalizedPointsToHomepage && hash) {
    e.preventDefault();
    if (normalizedUrl.includes("=") || normalizedUrl.includes("?") || normalizedUrl === lU) return;
    lU = normalizedUrl;
    setTimeout(() => { lU = ""; }, 500);
    history.pushState({}, "", normalizedUrl);
    pageTransition(normalizedUrl);
    return;
  }
  
  e.preventDefault();
  if (normalizedUrl.includes("=") || normalizedUrl.includes("?") || normalizedUrl === lU) return;
  lU = normalizedUrl;
  setTimeout(() => { lU = ""; }, 500);
  history.pushState({}, "", normalizedUrl);
  pageTransition(normalizedUrl);
}

function handleLinkClick(e) {
  if (iT) { e.preventDefault(); e.stopPropagation(); return false; }
  const l = e.target.closest("a") || (e.target.closest("button")?.hasAttribute("href") ? e.target.closest("button") : null);
  if (!l) return;
  const n = qs(".header");
  if (n) {
    n.classList.remove("scroll-deep");
    if (window.navbarControl) {
      window.navbarControl.setPreventScrollDeep(true);
      setTimeout(() => { if (window.navbarControl) window.navbarControl.setPreventScrollDeep(false); }, 1000);
    }
  }
  navigateWithAnimation(e, l);
}

function handleLinkHover(e) {
  const l = e.target.closest("a");
  if (!l) return;
  const u = l.getAttribute("href");
  if (!u || l.getAttribute("target") === "_blank" || u.startsWith("mailto:") || u.startsWith("tel:") || u === "#" || u.includes("=") || u.includes("?")) return;
  prefetchPage(u);
}

function initPageTransitions() {
  document.removeEventListener("click", handleLinkClick);
  document.addEventListener("click", handleLinkClick);
  document.removeEventListener("mouseenter", handleLinkHover, true);
  document.addEventListener("mouseenter", handleLinkHover, true);
  
  // Prefetch all internal links on page load for faster transitions
  const prefetchAllLinks = () => {
    const links = document.querySelectorAll('a[href]');
    links.forEach(link => {
      const href = link.getAttribute('href');
      if (href && !href.startsWith('#') && !href.startsWith('mailto:') && !href.startsWith('tel:') && 
          !link.getAttribute('target') && !href.includes('=') && !href.includes('?')) {
        // Prefetch in background with low priority
        prefetchPage(href).catch(() => {});
      }
    });
  };
  
  // Use requestIdleCallback if available, otherwise use setTimeout
  if (typeof requestIdleCallback !== 'undefined') {
    requestIdleCallback(prefetchAllLinks, { timeout: 2000 });
  } else {
    setTimeout(prefetchAllLinks, 2000);
  }
}

/* ==============================================
   Audit Form Checkmarks
============================================== */

function initAuditFormCheckmarks() {
  const form = qs('.audit-form form');
  if (!form) return;
  const updateCheckmark = (input) => {
    const wrapper = input.closest('.input-wrapper');
    if (!wrapper) return;
    const checkmark = wrapper.querySelector('.checkmark');
    if (!checkmark) return;
    if (input.value && input.value.trim() !== '') {
      wrapper.classList.add('filled');
    } else {
      wrapper.classList.remove('filled');
    }
  };
  const inputs = form.querySelectorAll('input');
  inputs.forEach(input => {
    updateCheckmark(input);
    if (input.id === 'fullname') {
      input.addEventListener('input', (e) => {
        const cursorPosition = e.target.selectionStart;
        const words = e.target.value.split(' ');
        const capitalizedWords = words.map(word => {
          if (word.length === 0) return word;
          return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        });
        const newValue = capitalizedWords.join(' ');
        e.target.value = newValue;
        e.target.setSelectionRange(cursorPosition, cursorPosition);
        updateCheckmark(input);
      });
    } else {
      input.addEventListener('input', () => {
        updateCheckmark(input);
      });
    }
    input.addEventListener('blur', () => {
      updateCheckmark(input);
    });
  });
  const selects = form.querySelectorAll('select');
  selects.forEach(select => {
    updateCheckmark(select);
    select.addEventListener('change', () => {
      updateCheckmark(select);
    });
  });
}

/* ==============================================
   Frame Corners Initialization
============================================== */

function initFrameCorners() {
  const frames = qsa('.frame');
  frames.forEach(function (frame) {
    if (!frame.querySelector('.frame-corner-bottom-left')) {
      const cornerLeft = document.createElement('span');
      cornerLeft.className = 'frame-corner-bottom-left';
      frame.insertBefore(cornerLeft, frame.firstChild);
      const cornerRight = document.createElement('span');
      cornerRight.className = 'frame-corner-bottom-right';
      frame.insertBefore(cornerRight, frame.firstChild);
    }
  });
}

/* ==============================================
   Header Animation Initialization
============================================== */

function initHeaderAnimation() {
  const logoEl = qs(".logo");
  const navEl = qs(".nav");
  const headerButtons = qsa(".header button");
  const headerElements = [logoEl, navEl, ...headerButtons].filter(Boolean);
  headerElements.forEach(el => {
    el.style.transition = "none";
    gsap.set(el, { clearProps: "all" });
  });
  gsap.set(headerElements, { opacity: 1, visibility: "hidden" });
  const tl = gsap.timeline();
  const animProps = { duration: window.EASING.duration, ease: window.EASING.main };
  tl.to(".header", { opacity: 1, top: 0, visibility: "visible", ...animProps }, 0);
  tl.to(headerElements, { opacity: 1, visibility: "visible", ...animProps }, 0);
}

/* ==============================================
   Burger Menu Initialization
============================================== */

let burgerMenuInitialized = false;

function initBurgerMenu() {
  if (burgerMenuInitialized) return;
  burgerMenuInitialized = true;
  
  const burgerMenu = qs(".burger-menu");
  const header = qs(".header");
  if (burgerMenu && header) {
    burgerMenu.addEventListener("click", function () {
      header.classList.toggle("open");
    });
    const mobileMenuLinks = qsa(".nav.links .links-container a, .mobile-only.extra-menu-links button");
    mobileMenuLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        header.classList.remove("open");
      });
    });
  }
}

/* ==============================================
   Navbar Scroll Initialization
============================================== */

let navbarScrollRAF = null;
let lastScrollTop = 0;
let preventScrollDeep = false;

function initNavbarScroll() {
  const nav = qs(".header");
  if (!nav) return;
  
  // Cancel existing RAF if any
  if (navbarScrollRAF) {
    cancelAnimationFrame(navbarScrollRAF);
    navbarScrollRAF = null;
  }
  
  lastScrollTop = 0;
  preventScrollDeep = false;
  
  function updateNavbar() {
    const st = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
    if (!preventScrollDeep) {
      if (st > CONFIG.scrollReset.navbarThreshold) nav.classList.add("scroll-deep");
      else nav.classList.remove("scroll-deep");
    }
    if (Math.abs(st - lastScrollTop) > CONFIG.scrollReset.scrollDiff) {
      if (st > lastScrollTop && st > CONFIG.scrollReset.hideThreshold) nav.classList.add("hidden");
      else if (st < lastScrollTop) nav.classList.remove("hidden");
      lastScrollTop = st;
    }
  }
  
  function checkScroll() {
    updateNavbar();
    navbarScrollRAF = requestAnimationFrame(checkScroll);
  }
  
  checkScroll();
  window.navbarControl = { nav, setPreventScrollDeep: (val) => { preventScrollDeep = val; } };
}

/* ==============================================
   Grid Overlay Toggle Initialization
============================================== */

let gridOverlayToggleInitialized = false;

function initGridOverlayToggle() {
  if (gridOverlayToggleInitialized) return;
  gridOverlayToggleInitialized = true;
  
  document.addEventListener("keydown", function (event) {
    if (event.shiftKey && event.key === "G") {
      const gridOverlay = qs(".grid-overlay");
      if (gridOverlay) {
        gridOverlay.remove();
      } else {
        const overlay = document.createElement("div");
        overlay.className = "grid-overlay";
        for (let i = 0; i < 12; i++) {
          const column = document.createElement("div");
          overlay.appendChild(column);
        }
        document.body.appendChild(overlay);
      }
    }
  });
}

/* ==============================================
   Resize Handler Initialization
============================================== */

let resizeTimeout;
let previousWidth = window.innerWidth;
let resizeHandlerInitialized = false;

function initResizeHandler() {
  if (resizeHandlerInitialized) return;
  resizeHandlerInitialized = true;
  
  window.addEventListener("resize", () => {
    const currentWidth = window.innerWidth;
    if (currentWidth === previousWidth) return;
    previousWidth = currentWidth;
    const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(async () => {
      await reinitializePageFunctions(true);
      requestAnimationFrame(() => {
        window.scrollTo(0, scrollY);
        if (lenisInstance) {
          lenisInstance.scrollTo(scrollY, { immediate: true });
        }
        ScrollTrigger.refresh();
      });
    }, 100);
  });
}

/* ==============================================
   Main Initialization - window.onload
============================================== */

window.onload = async function () {
  resetScroll();
  gsap.registerPlugin(SplitText, ScrollTrigger);
  initFavicon();
  autoAssignSectionClasses();
  // Convert logos asynchronously without blocking page load
  convertLogoToInlineSVG().catch(() => {});
  initHeaderAnimation();
  
  // Wait for all images to load before initializing scroll triggers
  await waitForImages();
  
  // Wait additional frame to ensure layout is stable
  await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  
  resetScroll();
  animateHeadings();
  ScrollTrigger.refresh();
  
  initTestimonials();
  initNumbersCarousel();
  initTeamSlider();
  initScrollToTopButton();
  initAuditFormCheckmarks();
  initFAQAccordion();
  initCodeCopyButtons();
  initBurgerMenu();
  initNavbarScroll();
  initGridOverlayToggle();
  initRoadProgressBar();
  initCubeAnimations();
  initVisibilityAnimation();
  initFrameCorners();
  initResizeHandler();
};

/* ==============================================
   Lenis Smooth Scrolling
============================================== */

let lenisInstance = null;
window.addEventListener("load", () => {
  resetScroll();
  lenisInstance = new Lenis({ duration: 1, orientation: "vertical", smoothWheel: true, smoothTouch: false, touchMultiplier: 1.5, easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)), useOverscroll: true, useControls: true, useAnchor: true, useRaf: true, infinite: false });
  const isScrollLocked = document.body.style.overflow === 'hidden' || document.documentElement.style.overflow === 'hidden';
  if (isScrollLocked) lenisInstance.stop();
  lenisInstance.scrollTo(0, { immediate: true });
  function raf(time) { lenisInstance.raf(time); requestAnimationFrame(raf); }
  requestAnimationFrame(raf);
  lenisInstance.on('scroll', ScrollTrigger.update);
  window.lenisInstance = lenisInstance;
  ScrollTrigger.refresh();
  if (!isScrollLocked) {
    setTimeout(() => {
      resetScroll();
      lenisInstance.scrollTo(0, { immediate: true });
      ScrollTrigger.refresh();
    }, 100);
  }
});

/* ==============================================
   Automatic Section Class Management
============================================== */

function autoAssignSectionClasses() {
  const isLightMode = document.body.classList.contains("light-mode");
  const sections = qsa('.page-wrapper > section');
  sections.forEach((section, index) => {
    if (isLightMode) {
      section.classList.remove('white', 'grey');
      if (index % 2 === 0) {
        section.classList.add('white');
      } else {
        section.classList.add('grey');
      }
    }
  });
}

autoAssignSectionClasses();
new MutationObserver(() => {
  autoAssignSectionClasses();
  updateHeaderForDarkTheme();
}).observe(document.body, { attributes: true, attributeFilter: ['id'] });

updateHeaderForDarkTheme();
initFavicon();
initPageTransitions();
window.addEventListener("popstate", () => { if (!iT) pageTransition(document.location.pathname); });

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init3DCubeLogo);
} else {
  init3DCubeLogo();
}

/* ==============================================
   Scroll to Top Button
============================================== */

function initScrollToTopButton() {
  const scrollToTopBtn = qs('.scroll-to-top');
  if (scrollToTopBtn) {
    scrollToTopBtn.replaceWith(scrollToTopBtn.cloneNode(true));
    const newScrollToTopBtn = qs('.scroll-to-top');
    newScrollToTopBtn.addEventListener('click', function (e) {
      e.preventDefault();
      if (typeof lenisInstance !== "undefined" && lenisInstance) {
        lenisInstance.scrollTo(0, { 
          duration: window.EASING.duration * 2, 
          easing: window.EASING.main,
          immediate: false
        });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }
}

/* ==============================================
   Code Copy Buttons
============================================== */

function initCodeCopyButtons() {
  const copyButtons = qsa('.code-copy-btn');
  if (!copyButtons.length) return;
  
  copyButtons.forEach(button => {
    // Remove existing event listeners by cloning
    const newButton = button.cloneNode(true);
    button.parentNode.replaceChild(newButton, button);
    
    newButton.addEventListener('click', function() {
      const codeBlock = newButton.closest('.article-code-block');
      if (!codeBlock) return;
      
      const code = codeBlock.querySelector('code');
      if (!code) return;
      
      const text = code.textContent || code.innerText;
      
      navigator.clipboard.writeText(text).then(function() {
        newButton.textContent = 'Copied!';
        newButton.classList.add('copied');
        
        setTimeout(function() {
          newButton.textContent = 'Copy To Clipboard';
          newButton.classList.remove('copied');
        }, 2000);
      }).catch(function(err) {
        // Silent fail - clipboard API might not be available
      });
    });
  });
}

/* ==============================================
   FAQ Accordion
============================================== */

function initFAQAccordion() {
  const faqItems = qsa('.faq-item');
  if (!faqItems.length) return;
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!question || !answer) return;
    
    // Remove existing event listeners by cloning
    const newQuestion = question.cloneNode(true);
    question.parentNode.replaceChild(newQuestion, question);
    const newItem = newQuestion.closest('.faq-item');
    const newAnswer = newItem.querySelector('.faq-answer');
    
    newQuestion.addEventListener('click', function() {
      const isOpen = newItem.classList.contains('active');
      
      // Close all other items
      faqItems.forEach(otherItem => {
        if (otherItem !== newItem) {
          const otherAnswer = otherItem.querySelector('.faq-answer');
          otherItem.classList.remove('active');
          if (typeof gsap !== 'undefined') {
            gsap.to(otherAnswer, {
              height: 0,
              opacity: 0,
              duration: 0.3,
              ease: 'power2.out'
            });
          }
        }
      });
      
      // Toggle current item
      if (isOpen) {
        newItem.classList.remove('active');
        if (typeof gsap !== 'undefined') {
          gsap.to(newAnswer, {
            height: 0,
            opacity: 0,
            duration: 0.3,
            ease: 'power2.out'
          });
        }
      } else {
        newItem.classList.add('active');
        if (typeof gsap !== 'undefined') {
          gsap.set(newAnswer, { height: 'auto', opacity: 0 });
          const height = newAnswer.offsetHeight;
          gsap.set(newAnswer, { height: 0, opacity: 0 });
          gsap.to(newAnswer, {
            height: height,
            opacity: 1,
            duration: 0.3,
            ease: 'power2.out'
          });
        }
      }
    });
  });
}

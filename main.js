/* === ФІНАЛЬНИЙ "РОЗУМНИЙ" main.js === */

/* --- ФУНКЦІЯ КЕРУВАННЯ ПРЕЛОАДЕРОМ (ОНОВЛЕНО) --- */

// Створюємо глобальну змінну для управління прелоадером
const preloaderTimeline = gsap.timeline({ paused: true });

const initPreloaderAnimation = () => {
  const preloaderBar = document.querySelector('.loader-line, #preloader-bar');
  const preloaderText = document.querySelector('.loader-text, #preloader-text');

  if (!preloaderBar || !preloaderText) return;

  // Створюємо анімацію в GSAP
  preloaderTimeline
    // 1. Анімація появи тексту
    .fromTo(preloaderText,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, 0)

    // 2. Анімація лінії прогресу
    .to(preloaderBar, {
      width: '100%',
      duration: 2.0,
      ease: 'power2.inOut'
    }, 0.2)

    .play();
};

const preloaderHide = () => {
  const preloader = document.querySelector('.brand-preloader, .preloader, #preloader');
  if (preloader) {
    preloaderTimeline.progress(1);

    setTimeout(() => {
      preloader.classList.add('preloader-hidden');

      setTimeout(() => {
        preloader.style.display = 'none';
      }, 800);
    }, 400);
  }
};

// Запускаємо анімацію прелоадера одразу
document.addEventListener("DOMContentLoaded", initPreloaderAnimation);

// Приховуємо прелоадер ЛИШЕ коли всі ресурси завантажені
if (document.readyState === 'complete') {
  preloaderHide();
} else {
  window.addEventListener("load", preloaderHide);
}

/* --- ЛОГІКА МОБІЛЬНОГО МЕНЮ (ЦЕНТРАЛІЗОВАНО) --- */
document.addEventListener("DOMContentLoaded", () => {
  const menuBtn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const menuLinks = document.querySelectorAll('.mobile-menu-link');
  const navBar = document.querySelector('.brand-nav');
  let lastScrollY = window.scrollY;

  // 1. Smart Scroll (Ховає/Показує меню при скролі)
  if (navBar) {
    window.addEventListener('scroll', () => {
      // Якщо меню відкрите - не ховаємо шапку
      if (mobileMenu && mobileMenu.classList.contains('active')) return;

      if (window.scrollY > lastScrollY && window.scrollY > 100) {
        navBar.classList.add('nav-hidden');
      } else {
        navBar.classList.remove('nav-hidden');
      }
      lastScrollY = window.scrollY;
    }, { passive: true });
  }

  if (menuBtn && mobileMenu) {
    const toggleMenu = (forceClose = false) => {
      if (forceClose) {
        menuBtn.classList.remove('active');
        mobileMenu.classList.remove('active');
      } else {
        menuBtn.classList.toggle('active');
        mobileMenu.classList.toggle('active');
      }

      const isActive = mobileMenu.classList.contains('active');
      document.body.style.overflow = isActive ? 'hidden' : '';

      // Control Lenis
      if (window.lenis) {
        if (isActive) window.lenis.stop();
        else window.lenis.start();
      }

      // Анімація елементів меню
      if (isActive) {
        gsap.fromTo(menuLinks,
          { opacity: 0, x: -30, skewX: -5 },
          {
            opacity: 1,
            x: 0,
            skewX: -5,
            duration: 0.5,
            stagger: 0.1,
            ease: "power2.out",
            overwrite: true
          }
        );

        // Оновлюємо текст кнопки на "ЗАКРИТИ" (через переклади або дефолт)
        if (typeof translations !== 'undefined') {
          const lang = localStorage.getItem('selectedLanguage') || 'uk';
          menuBtn.textContent = translations[lang]?.menu_close || (lang === 'en' ? 'CLOSE' : 'ЗАКРИТИ');
        }
      } else {
        gsap.to(menuLinks, { opacity: 0, x: -20, duration: 0.3, overwrite: true });

        // Повертаємо текст "МЕНЮ"
        if (typeof translations !== 'undefined') {
          const lang = localStorage.getItem('selectedLanguage') || 'uk';
          menuBtn.textContent = translations[lang]?.menu_toggle || (lang === 'en' ? 'MENU' : 'МЕНЮ');
        }
      }
    };

    menuBtn.addEventListener('click', (e) => {
      e.preventDefault();
      toggleMenu();
    });

    menuLinks.forEach(link => {
      link.addEventListener('click', () => toggleMenu(true));
    });

    // Закриття при кліку на оверлей
    mobileMenu.addEventListener('click', (e) => {
      if (e.target === mobileMenu) toggleMenu(true);
    });
  }
});

/* --- MAGNETIC BUTTONS LOGIC --- */
const initMagneticButtons = () => {
  const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
  if (isTouch) return;

  // Селектори для кнопок, які будуть "магнітними"
  const magneticElements = document.querySelectorAll('.menu-items a, .btn-nav, .btn-primary, .big-btn, .mobile-toggle');

  magneticElements.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      // Рухаємо кнопку за курсором (на 30% відстані)
      gsap.to(el, {
        x: x * 0.3,
        y: y * 0.3,
        duration: 0.4,
        ease: "power2.out"
      });
    });

    el.addEventListener('mouseleave', () => {
      // Повертаємо в початковий стан
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: "elastic.out(1, 0.3)"
      });
    });
  });
};

/* --- SHUTTER TRANSITION LOGIC --- */
const initShutterTransition = () => {
  const shutter = document.querySelector('.shutter-transition');
  if (!shutter) return;

  // Handle all internal links
  document.addEventListener('click', (e) => {
    // 1. Skip if already handled by Lightbox
    if (e.defaultPrevented) return;

    // 2. Skip if target is an image related element
    if (e.target.closest('.bg-img, .artifact-img, .achievement-img, .coach-img, img, .life-card')) {
      return;
    }

    const link = e.target.closest('a');
    if (!link || !link.href) return;

    const url = new URL(link.href);
    const isInternal = url.origin === window.location.origin;
    const isSamePage = url.pathname === window.location.pathname;
    const isAnchor = link.getAttribute('href').startsWith('#');

    // Add exclusion for external links and special protocols
    const isSpecial = link.href.startsWith('mailto:') || link.href.startsWith('tel:');

    if (isInternal && !isSamePage && !isAnchor && !link.target && !isSpecial) {
      e.preventDefault();
      shutter.classList.add('active');

      const delay = window.matchMedia("(max-width: 768px)").matches ? 500 : 700;
      setTimeout(() => {
        window.location.href = link.href;
      }, delay);
    }
  });
};

// === ОСНОВНИЙ КОД САЙТУ ===
window.addEventListener("load", () => {

  // --- IMPORTANT: Define Lightbox FIRST so its listeners are registered before Shutter ---

  // Create Lightbox element if it doesn't exist
  if (!document.querySelector('.lightbox-overlay')) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox-overlay';
    lightbox.id = 'globalLightbox';
    lightbox.innerHTML = `
      <div class="lightbox-close">&times;</div>
      <div class="lightbox-loader"></div>
      <img src="" alt="Enlarged view" class="lightbox-img">
    `;
    document.body.appendChild(lightbox);
  }

  const lightbox = document.getElementById('globalLightbox');
  const lightboxImg = lightbox.querySelector('.lightbox-img');
  const lightboxClose = lightbox.querySelector('.lightbox-close');

  const openLightbox = (src) => {
    if (!src) return;
    lightboxImg.src = src;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (window.lenis) window.lenis.stop();
  };

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    if (window.lenis) window.lenis.start();
    setTimeout(() => { lightboxImg.src = ''; }, 400);
  };

  // Centralized click handler for images/artifacts
  // This listener is registered on 'document' BEFORE the shutter's 'document' listener
  document.addEventListener('click', (e) => {
    const target = e.target;
    let imageSrc = null;

    // A. Regular Image tags within specific containers
    if (target.tagName === 'IMG') {
      const isGalleryImg = target.closest('.chronicle-container') ||
        target.closest('.artifacts-grid') ||
        target.closest('.life-grid') ||
        target.closest('.gallery-marquee-brand') ||
        target.closest('.needs-visual') ||
        target.closest('.achievement-card');

      if (isGalleryImg) {
        imageSrc = target.src;
      }
    }

    // B. Elements with background images (.bg-img, .artifact-img, etc.)
    const bgElement = target.closest('.bg-img, .artifact-img, .achievement-img, .coach-img');
    if (bgElement && !imageSrc) {
      const style = window.getComputedStyle(bgElement);
      const bg = style.backgroundImage;
      if (bg && bg !== 'none') {
        imageSrc = bg.replace(/url\(['"]?(.*?)['"]?\)/i, '$1');
      }
    }

    // C. Special case: life-card contains img
    if (!imageSrc && (target.classList.contains('life-card') || target.closest('.life-card'))) {
      const img = (target.classList.contains('life-card') ? target : target.closest('.life-card')).querySelector('img');
      if (img) imageSrc = img.src;
    }

    if (imageSrc) {
      // PREVENT SHUTTER FROM RUNNING
      e.preventDefault();
      e.stopImmediatePropagation();
      openLightbox(imageSrc);
    }
  }, true); // Use capture phase to be extra safe

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // --- NOW INITIALIZE SHUTTER AND OTHERS ---

  // Initialize Shutter
  initShutterTransition();

  // Initialize Magnetic Buttons
  initMagneticButtons();

  const shutter = document.querySelector('.shutter-transition');

  if (shutter) {
    // Reveal page with shutter opening after a short delay
    setTimeout(() => {
      shutter.classList.remove('active');
    }, 400);

    // Прибираємо прелоадер швидше, якщо є затвор, щоб не було "подвійного завантаження"
    const preloader = document.querySelector('.brand-preloader');
    if (preloader) {
      preloader.style.display = 'none';
    }
  }

  // === 0. SMOOTH SCROLL (LENIS) ===
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
  });

  // Sync Lenis with ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  // Global access (optional)
  window.lenis = lenis;

  // Реєструємо плагіни GSAP один раз
  gsap.registerPlugin(ScrollTrigger);

  // === 1. ЛОГІКА ДЛЯ ГОЛОВНОЇ СТОРІНКИ (index.html) ===
  const fullpageElement = document.getElementById("fullpage");

  // Цей код запуститься, ТІЛЬКИ ЯКЩО він на index.html
  if (fullpageElement) {
    // Визначаємо чи це мобільний пристрій
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const speedMultiplier = isMobile ? 0.6 : 1; // На мобільних анімації на 40% швидші

    // --- Функція для анімації літер ---
    const splitHeadingIntoLetters = (heading) => {
      const rawLines = heading.dataset.lines
        ? heading.dataset.lines.split("|").map((line) => line.trim())
        : [heading.textContent.trim()];
      heading.innerHTML = "";
      rawLines.forEach((line) => {
        const lineSpan = document.createElement("span");
        lineSpan.classList.add("heading-line");
        Array.from(line).forEach((char) => {
          const letterSpan = document.createElement("span");
          letterSpan.classList.add("heading-letter");
          letterSpan.textContent = char === " " ? "\u00A0" : char;
          lineSpan.appendChild(letterSpan);
        });
        heading.appendChild(lineSpan);
      });
    };

    const ensureHeadingLetters = (selector) => {
      const heading = document.querySelector(selector);
      if (!heading) return [];
      if (!heading.dataset.prepared) {
        splitHeadingIntoLetters(heading);
        heading.dataset.prepared = "true";
      }
      return heading.querySelectorAll(".heading-letter");
    };

    const addLetterReveal = (timeline, selector, options = {}) => {
      const letters = ensureHeadingLetters(selector);
      if (!letters.length) return;
      timeline.fromTo(
        letters,
        { opacity: 0, y: options.fromY ?? 24 },
        {
          opacity: 1,
          y: 0,
          duration: (options.duration || 0.45) * speedMultiplier,
          ease: options.ease || "power2.out",
          stagger: (options.stagger || 0.015) * speedMultiplier,
          immediateRender: false,
        },
        options.position ?? 0
      );
    };

    // --- Анімації секцій ---
    // Секція 1
    const sec1_anim = gsap.timeline({ paused: true })
      .to(".hero-video", { opacity: 1, duration: 1.0 * speedMultiplier, ease: "power1.out", force3D: true })
      .fromTo(".hero-text", { opacity: 0, y: 20, force3D: true }, { opacity: 1, y: 0, duration: 0.8 * speedMultiplier, ease: "power1.out", force3D: true }, "-=0.5")
      .fromTo(".hero-text p", { opacity: 0 }, { opacity: 1, duration: 0.7 * speedMultiplier, ease: "power1.out" }, "-=0.5")
      .fromTo(".hero-buttons", { opacity: 0, y: 20, force3D: true }, { opacity: 1, y: 0, duration: 0.7 * speedMultiplier, ease: "power1.out", force3D: true }, "-=0.4");
    addLetterReveal(sec1_anim, ".hero-text h1", { duration: 0.7, fromY: 16, position: "-=0.5" });

    // Секція 2
    const sec2_anim = gsap.timeline({ paused: true });
    addLetterReveal(sec2_anim, "#sec2 .text-left h1", { position: 0.3 });
    sec2_anim
      .fromTo("#sec2 .section-subtitle", { opacity: 0, y: 20, force3D: true }, { opacity: 1, y: 0, duration: 0.6 * speedMultiplier, ease: "power1.out", force3D: true }, ">")
      .fromTo("#sec2 .btn", { opacity: 0, y: 16, force3D: true }, { opacity: 1, y: 0, duration: 0.6 * speedMultiplier, ease: "power1.out", force3D: true }, ">")
      .fromTo("#sec2 .media-frame", { opacity: 0, y: 60, rotate: 3, force3D: true }, { opacity: 1, y: 0, rotate: 0, duration: 0.9 * speedMultiplier, ease: "power1.out", force3D: true }, 0.2);

    // Секція 3
    const sec3_anim = gsap.timeline({ paused: true });
    addLetterReveal(sec3_anim, "#sec3 .text-left h1", { position: 0.2 });
    sec3_anim
      .fromTo("#sec3 .section-subtitle", { opacity: 0, y: 20, force3D: true }, { opacity: 1, y: 0, duration: 0.6 * speedMultiplier, ease: "power1.out", force3D: true }, ">")
      .fromTo("#sec3 .btn", { opacity: 0, y: 16, force3D: true }, { opacity: 1, y: 0, duration: 0.6 * speedMultiplier, ease: "power1.out", force3D: true }, ">")
      .fromTo("#sec3 .media-frame", { opacity: 0, x: 60, scale: 0.95, force3D: true }, { opacity: 1, x: 0, scale: 1, duration: 0.8 * speedMultiplier, ease: "power1.out", force3D: true }, 0.2);

    // Секція 4
    const sec4_anim = gsap.timeline({ paused: true });
    addLetterReveal(sec4_anim, "#sec4 .text-left h1", { position: 0.2 });
    sec4_anim
      .fromTo("#sec4 .section-subtitle", { opacity: 0, y: 20, force3D: true }, { opacity: 1, y: 0, duration: 0.6 * speedMultiplier, ease: "power1.out", force3D: true }, ">")
      .fromTo("#sec4 .btn", { opacity: 0, y: 16, force3D: true }, { opacity: 1, y: 0, duration: 0.6 * speedMultiplier, ease: "power1.out", force3D: true }, ">")
      .fromTo("#sec4 .media-frame", { opacity: 0, scale: 0.85, filter: "blur(8px)", force3D: true }, { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.9 * speedMultiplier, ease: "power1.out", force3D: true }, 0.2);

    // --- Об'єкти анімацій ---
    const timelines = {
      page1: sec1_anim,
      page2: sec2_anim,
      page3: sec3_anim,
      page4: sec4_anim,
    };

    // --- Керування кнопками ---
    const hallButton = document.getElementById("btn-hall");
    const schoolButton = document.getElementById("btn-school");
    if (hallButton) {
      hallButton.addEventListener("click", (event) => {
        event.preventDefault();
        $.fn.fullpage.moveTo("page2");
      });
    }
    if (schoolButton) {
      schoolButton.addEventListener("click", (event) => {
        event.preventDefault();
        $.fn.fullpage.moveTo("page3");
      });
    }

    // Переходи між сторінками
    document.querySelectorAll(".page-transition-link").forEach((link) => {
      link.addEventListener("click", (event) => {
        const href = link.getAttribute("href");
        if (!href) return;
        event.preventDefault();
        document.body.classList.add("page-leave");
        setTimeout(() => {
          window.location.href = href;
        }, 500);
      });
    });

    // Переміщення кнопок на мобільних
    const relocateButtons = () => {
      const isMobile = window.matchMedia("(max-width: 768px)").matches;
      document.querySelectorAll("[data-desktop-parent]").forEach((button) => {
        const desktopParent = document.querySelector(button.dataset.desktopParent || "");
        const mobileSlot = document.querySelector(button.dataset.mobileSlot || "");
        if (isMobile) {
          if (mobileSlot && !mobileSlot.contains(button)) {
            mobileSlot.appendChild(button);
          }
        } else if (desktopParent && !desktopParent.contains(button)) {
          desktopParent.appendChild(button);
        }
      });
    };

    relocateButtons();
    window.addEventListener("resize", () => {
      clearTimeout(window.relocateTimeout);
      window.relocateTimeout = setTimeout(relocateButtons, 200);
    });

    // --- Ініціалізація fullPage.js (захист від повторного ініту) ---
    if (!document.body.dataset.fullpageInit && !$("#fullpage").hasClass("fullpage-wrapper")) {
      document.body.dataset.fullpageInit = "1";
      $("#fullpage").fullpage({
        autoScrolling: true,
        scrollingSpeed: isMobile ? 600 : 900,
        controlArrows: true,
        navigation: true,
        navigationPosition: "right",
        anchors: ["page1", "page2", "page3", "page4"],
        // Вимкнути fullPage.js на мобільних пристроях (менше 768px)
        // Це дозволить звичайний скрол без проблем з адресним рядком
        responsiveWidth: 768,
        responsiveHeight: 0, // Не вимкати за висотою
        afterLoad(anchorLink, index) {
          const tl = timelines[anchorLink];
          if (tl) tl.restart();

          // Залишаємо кнопки завжди білими
          const fpNav = document.getElementById('fp-nav');
          if (fpNav) {
            fpNav.classList.remove('fp-nav-dark');
          }
        },
        onLeave(index, nextIndex, direction) {
          const key = `page${index}`;
          const tl = timelines[key];
          if (tl) tl.reverse().pause();
        },
      });
    }
  } // <-- Кінець блоку if (fullpageElement)

  // === 3. INTERACTIVE UI EFFECTS (Weightless UI) ===

  // Create Cursor Glow element if it doesn't exist
  if (!document.querySelector('.cursor-glow')) {
    const glow = document.createElement('div');
    glow.className = 'cursor-glow';
    document.body.appendChild(glow);
  }

  const cursorGlow = document.querySelector('.cursor-glow');

  // Mouse move listener for Glow and Tilt
  document.addEventListener('mousemove', (e) => {
    if (window.matchMedia("(max-width: 1024px)").matches) return; // Вимикаємо на планшетах та мобільних
    // 1. Glow Follow
    gsap.to(cursorGlow, {
      x: e.clientX,
      y: e.clientY,
      xPercent: -50,
      yPercent: -50,
      duration: 0.8,
      ease: 'power2.out',
      overwrite: 'auto'
    });

    // 2. 3D Tilt for Grid Items (index.html)
    const tiltItems = document.querySelectorAll('.grid-item, .social-card, .chapter-block');
    tiltItems.forEach(item => {
      const rect = item.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const isInside = x > 0 && x < rect.width && y > 0 && y < rect.height;

      if (isInside) {
        const xPercent = (x / rect.width - 0.5) * 20; // Max 10 deg
        const yPercent = (y / rect.height - 0.5) * -20; // Max 10 deg

        gsap.to(item, {
          rotateY: xPercent,
          rotateX: yPercent,
          transformPerspective: 1000,
          duration: 0.4,
          ease: 'power2.out'
        });
      } else {
        gsap.to(item, {
          rotateY: 0,
          rotateX: 0,
          duration: 0.5,
          ease: 'power2.out'
        });
      }
    });
  });

  // Lightbox logic was moved to the top of the load listener for event ordering
});

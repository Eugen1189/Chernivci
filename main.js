/* === ФІНАЛЬНИЙ "РОЗУМНИЙ" main.js === */

/* --- ФУНКЦІЯ КЕРУВАННЯ ПРЕЛОАДЕРОМ (ОНОВЛЕНО) --- */

// Створюємо глобальну змінну для управління прелоадером
const preloaderTimeline = gsap.timeline({ paused: true });

const initPreloaderAnimation = () => {
    const preloaderBar = document.getElementById('preloader-bar');
    const preloaderText = document.getElementById('preloader-text');

    if (!preloaderBar || !preloaderText) return;

    // Створюємо анімацію в GSAP
    preloaderTimeline
        // 1. Анімація появи тексту (з хвилею)
        .fromTo(preloaderText, 
            { opacity: 0, scale: 0.8 }, 
            { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.2)' }, 0)
        
        // 2. Анімація лінії прогресу (збільшено час)
        .to(preloaderBar, {
            width: '100%',
            duration: 2.8, // Збільшено час завантаження до 2.8 секунди
            ease: 'power2.inOut'
        }, 0.3) // Починаємо через 0.3с після тексту
        
        // Запускаємо анімацію
        .play();
};

const preloaderHide = () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        // Завершуємо GSAP-анімацію, якщо вона ще не закінчилася
        preloaderTimeline.progress(1); 
        
        // Збільшено затримку перед зникненням (для кращого ефекту)
        setTimeout(() => {
            preloader.classList.add('preloader-hidden');
            
            // Повністю видаляємо прелоадер з DOM після анімації
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 600);
        }, 600); // Збільшено затримку для кращого візуального ефекту
    }
};

// Запускаємо анімацію прелоадера одразу
document.addEventListener("DOMContentLoaded", initPreloaderAnimation);

// Приховуємо прелоадер ЛИШЕ коли всі ресурси завантажені
window.addEventListener("load", preloaderHide);

/* --- ЛОГІКА ГАМБУРГЕР МЕНЮ --- */
document.addEventListener("DOMContentLoaded", () => {
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuClose = document.getElementById('menu-close');
    const menuLinks = document.querySelectorAll('.mobile-menu-list a');

    if (hamburger && mobileMenu) {
        // Відкрити меню
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Закрити меню через кнопку X
        if (menuClose) {
            menuClose.addEventListener('click', () => {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        }

        // Закрити меню при кліку на посилання
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Закрити меню при кліку поза ним
        document.addEventListener('click', (e) => {
            if (!mobileMenu.contains(e.target) && !hamburger.contains(e.target) && mobileMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
});

// === ОСНОВНИЙ КОД САЙТУ ===
window.addEventListener("load", () => {
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

  // === 2. ЛОГІКА ДЛЯ СТОРІНКИ ІСТОРІЇ (istoriya.html) ===
  const timelineItems = document.querySelectorAll(".timeline-item");

  // Цей код запуститься, ТІЛЬКИ ЯКЩО він на istoriya.html
  if (timelineItems.length > 0) {
    timelineItems.forEach((item) => {
      gsap.fromTo(
        item,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          ease: "power2.out",
          duration: 1,
          scrollTrigger: {
            trigger: item,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    });
  } // <-- Кінець блоку if (timelineItems)
});

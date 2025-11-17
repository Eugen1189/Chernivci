/* === ФІНАЛЬНИЙ "РОЗУМНИЙ" main.js === */

window.addEventListener("load", () => {
  // Реєструємо плагіни GSAP один раз
  gsap.registerPlugin(ScrollTrigger);

  // === 1. ЛОГІКА ДЛЯ ГОЛОВНОЇ СТОРІНКИ (index.html) ===
  const fullpageElement = document.getElementById("fullpage");

  // Цей код запуститься, ТІЛЬКИ ЯКЩО він на index.html
  if (fullpageElement) {
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
          duration: options.duration || 0.45,
          ease: options.ease || "power2.out",
          stagger: options.stagger || 0.015,
          immediateRender: false,
        },
        options.position ?? 0
      );
    };

    // --- Анімації секцій ---
    // Секція 1
    const sec1_anim = gsap.timeline({ paused: true })
      .to(".hero-video", { opacity: 1, duration: 1.2, ease: "power2.out" })
      .fromTo(".hero-text", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1.0, ease: "power2.out" }, "-=0.6")
      // Переконаймось, що опис під заголовком видно
      .fromTo(".hero-text p", { opacity: 0 }, { opacity: 1, duration: 0.8, ease: "power2.out" }, "-=0.6")
      .fromTo(".hero-buttons", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.9, ease: "power2.out" }, "-=0.5");
    addLetterReveal(sec1_anim, ".hero-text h1", { duration: 0.9, fromY: 18, position: "-=0.6" });

    // Секція 2
    const sec2_anim = gsap.timeline({ paused: true });
    addLetterReveal(sec2_anim, "#sec2 .text-left h1", { position: 0.5 });
    sec2_anim
      .fromTo("#sec2 .text-left p", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, ">")
      .fromTo("#sec2 .btn", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, ">")
      .fromTo("#sec2 .media-frame", { opacity: 0, y: 100, rotate: 5 }, { opacity: 1, y: 0, rotate: 0, duration: 1.2, ease: "power3.out" }, 0.2);

    // Секція 3
    const sec3_anim = gsap.timeline({ paused: true });
    addLetterReveal(sec3_anim, "#sec3 .text-left h1", { position: 0.2 });
    sec3_anim
      .fromTo("#sec3 .text-left p", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, ">")
      .fromTo("#sec3 .btn", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, ">")
      .fromTo("#sec3 .media-frame", { opacity: 0, x: 100, scale: 0.9 }, { opacity: 1, x: 0, scale: 1, duration: 1.1, ease: "power3.out" }, 0.2);

    // Секція 4
    const sec4_anim = gsap.timeline({ paused: true });
    addLetterReveal(sec4_anim, "#sec4 .text-left h1", { position: 0.2 });
    sec4_anim
      .fromTo("#sec4 .text-left p", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, ">")
      .fromTo("#sec4 .btn", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, ">")
      .fromTo("#sec4 .media-frame", { opacity: 0, scale: 0.8, filter: "blur(10px)" }, { opacity: 1, scale: 1, filter: "blur(0px)", duration: 1.2, ease: "power3.out" }, 0.2);

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

    // --- Ініціалізація fullPage.js (захист від повторного ініту) ---
    if (!document.body.dataset.fullpageInit && !$("#fullpage").hasClass("fullpage-wrapper")) {
      document.body.dataset.fullpageInit = "1";
      $("#fullpage").fullpage({
        autoScrolling: true,
        scrollingSpeed: 900,
        controlArrows: true,
        navigation: true,
        navigationPosition: "right",
        anchors: ["page1", "page2", "page3", "page4"],
        afterLoad(anchorLink) {
          const tl = timelines[anchorLink];
          if (tl) tl.restart();
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
    gsap.registerPlugin(ScrollTrigger);
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
/* === ФІНАЛЬНИЙ "РОЗУМНИЙ" main.js === */

window.addEventListener("load", () => {
  // Реєструємо плагіни GSAP один раз
  gsap.registerPlugin(ScrollTrigger);

  // === 1. ЛОГІКА ДЛЯ ГОЛОВНОЇ СТОРІНКИ (index.html) ===
  const fullpageElement = document.getElementById("fullpage");

  // Цей код запуститься, ТІЛЬКИ ЯКЩО він на index.html
  if (fullpageElement) {
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
          duration: options.duration || 0.45,
          ease: options.ease || "power2.out",
          stagger: options.stagger || 0.015,
          immediateRender: false,
        },
        options.position ?? 0
      );
    };

    // Утіліти для безпечних анімацій (щоб не було попереджень, коли селектори відсутні)
    const hasEl = (selector) => !!document.querySelector(selector);
    const fromToIf = (tl, selector, fromVars, toVars, position) => {
      if (hasEl(selector)) tl.fromTo(selector, fromVars, toVars, position);
      return tl;
    };

    // --- Анімації секцій ---
    // Секція 1
    const sec1_anim = gsap.timeline({ paused: true })
      .to(".hero-video", { opacity: 1, duration: 1.2, ease: "power2.out" })
      .fromTo(".hero-text", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1.0, ease: "power2.out" }, "-=0.6")
      // Переконаймось, що опис під заголовком видно
      .fromTo(".hero-text p", { opacity: 0 }, { opacity: 1, duration: 0.8, ease: "power2.out" }, "-=0.6")
      .fromTo(".hero-buttons", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.9, ease: "power2.out" }, "-=0.5");
    addLetterReveal(sec1_anim, ".hero-text h1", { duration: 0.9, fromY: 18, position: "-=0.6" });

    // Секція 2
    const sec2_anim = gsap.timeline({ paused: true });
    addLetterReveal(sec2_anim, "#sec2 .text-left h1", { position: 0.5 });
    sec2_anim
      .fromTo("#sec2 .text-left p", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, ">")
      .fromTo("#sec2 .btn", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, ">")
      .fromTo("#sec2 .media-frame", { opacity: 0, y: 100, rotate: 5 }, { opacity: 1, y: 0, rotate: 0, duration: 1.2, ease: "power3.out" }, 0.2);

    // Секція 3
    const sec3_anim = gsap.timeline({ paused: true });
    addLetterReveal(sec3_anim, "#sec3 .text-left h1", { position: 0.2 });
    sec3_anim
      .fromTo("#sec3 .text-left p", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, ">")
      .fromTo("#sec3 .btn", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, ">")
      .fromTo("#sec3 .media-frame", { opacity: 0, x: 100, scale: 0.9 }, { opacity: 1, x: 0, scale: 1, duration: 1.1, ease: "power3.out" }, 0.2);

    // Секція 4
    const sec4_anim = gsap.timeline({ paused: true });
    addLetterReveal(sec4_anim, "#sec4 .text-left h1", { position: 0.2 });
    sec4_anim
      .fromTo("#sec4 .text-left p", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, ">")
      .fromTo("#sec4 .btn", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, ">")
      .fromTo("#sec4 .media-frame", { opacity: 0, scale: 0.8, filter: "blur(10px)" }, { opacity: 1, scale: 1, filter: "blur(0px)", duration: 1.2, ease: "power3.out" }, 0.2);

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

    // --- Ініціалізація fullPage.js ---
    if (!document.body.dataset.fullpageInit && !$("#fullpage").hasClass("fullpage-wrapper")) {
      document.body.dataset.fullpageInit = "1";
      $("#fullpage").fullpage({
      autoScrolling: true,
      scrollingSpeed: 900,
      controlArrows: true,
      navigation: true,
      navigationPosition: "right",
      anchors: ["page1", "page2", "page3", "page4"],
      afterLoad(anchorLink) {
        const tl = timelines[anchorLink];
        if (tl) tl.restart();
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
    gsap.registerPlugin(ScrollTrigger);
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
/* === НОВИЙ, "РОЗУМНИЙ" main.js (ЗАМІНІТЬ ВСЕ) === */

window.addEventListener("load", () => {
  // Реєструємо плагіни GSAP один раз на початку
  gsap.registerPlugin(ScrollTrigger);

  // === 1. ЛОГІКА ДЛЯ ГОЛОВНОЇ СТОРІНКИ (index.html) ===
  const fullpageElement = document.getElementById("fullpage");

  // Цей код запуститься, ТІЛЬКИ ЯКЩО він на index.html
  if (fullpageElement) {
    const preset = (selector, vars) => {
      const targets = document.querySelectorAll(selector);
      if (!targets.length) return;
      gsap.set(targets, vars);
    };

    // Initial presets (hero)
    preset(".hero-video", { opacity: 0 });
    preset(".hero-text", { opacity: 0, y: 30 });
    preset(".hero-buttons", { opacity: 0, y: 30 });
    // Ensure the hero paragraph (with strong heading inside) is hidden until reveal
    preset(".hero-text p", { opacity: 0 });

    // Section config (використовується для підготовки параграфів та ресетів)
    const sectionsConfig = [
      { base: "#sec2" },
      { base: "#sec3" },
      { base: "#sec4" },
    ];
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
          duration: options.duration || 0.45,
          ease: options.ease || "power2.out",
          stagger: options.stagger || 0.015,
          immediateRender: false,
        },
        options.position ?? 0
      );
    };

    // --- Анімації для fullPage ---
    const sec1_anim = gsap
      .timeline({ paused: true })
      .to(".hero-video", { opacity: 1, duration: 1.2, ease: "power2.out" })
      .fromTo(".hero-text", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, "-=0.6")
      // Reveal paragraph (heading + text) at the same time
      .fromTo(".hero-text p", { opacity: 0 }, { opacity: 1, duration: 0.8, ease: "power2.out" }, 0)
      .fromTo(".hero-buttons", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.9, ease: "power2.out" }, "-=0.2");
    // Make heading letters appear as a block (no stagger), same start time
    addLetterReveal(sec1_anim, ".hero-text p strong", { duration: 0.0, fromY: 0, stagger: 0, position: 0 });

    const smoothEase = "power4.out";

    // Prepare paragraphs: wrap the text that follows <strong> into a span.subtitle-rest
    const prepareSectionParagraphs = () => {
      sectionsConfig.forEach(({ base }) => {
        const p = document.querySelector(`${base} .section-subtitle`);
        if (!p) return;
        // Skip if already prepared
        if (p.querySelector(".subtitle-rest")) return;
        const strong = p.querySelector("strong");
        if (!strong) return;
        // Collect subsequent text nodes and inline nodes after <strong>
        const restNodes = [];
        let node = strong.nextSibling;
        while (node) {
          const next = node.nextSibling;
          restNodes.push(node);
          node = next;
        }
        if (restNodes.length) {
          const span = document.createElement("span");
          span.className = "subtitle-rest";
          restNodes.forEach((n) => span.appendChild(n));
          p.appendChild(span);
        }
      });
    };
    prepareSectionParagraphs();
    // buildSectionTimeline — більше не використовується (замінено кастомними таймлайнами для секцій)

    /* === Секція 2 ("Зал Слави") — послідовна анімація === */
    const sec2_anim = (() => {
      const base = "#sec2";
      const tl = gsap.timeline({ paused: true });
      // 1) Картинка
      tl.fromTo(
        `${base} .media-frame`,
        { opacity: 0, y: 100, rotate: 5 },
        { opacity: 1, y: 0, rotate: 0, duration: 1.2, ease: "power3.out" },
        0
      );
      // 1.1) Показати контейнер параграфа перед заголовком
      tl.fromTo(
        `${base} .section-subtitle`,
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 0.2, ease: "power2.out" },
        0.2
      );
      // 2) Заголовок (strong) — побуквено
      addLetterReveal(tl, `${base} .section-subtitle strong`, { position: 0.2 });
      // 3) Текст після заголовка
      tl.fromTo(
        `${base} .section-subtitle .subtitle-rest`,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
        ">"
      );
      // 4) Кнопка
      tl.fromTo(
        `${base} .btn`,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
        ">"
      );
      return tl;
    })();

    /* === Секція 3 ("Академія") — послідовна анімація === */
    const sec3_anim = (() => {
      const base = "#sec3";
      const tl = gsap.timeline({ paused: true });
      // 1) Картинка
      tl.fromTo(
        `.section--academy .media-frame`,
        { opacity: 0, x: 100 },
        { opacity: 1, x: 0, duration: 1.1, ease: "power3.out" },
        0
      );
      // 1.1) Показати контейнер параграфа перед заголовком (навіть якщо він уже видимий — це узгодить таймінг)
      tl.fromTo(
        `${base} .section-subtitle`,
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 0.2, ease: "power2.out" },
        0.2
      );
      // 2) Заголовок (strong) — побуквено
      addLetterReveal(tl, `.section--academy .section-subtitle strong`, { position: 0.2 });
      // 3) Текст після заголовка
      tl.fromTo(
        `.section--academy .section-subtitle .subtitle-rest`,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
        ">"
      );
      // 4) Кнопка
      tl.fromTo(
        `.section--academy .btn`,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
        ">"
      );
      return tl;
    })();
    /* === ЗАМІНА: Анімація для Секції 4 (Підтримка/Легенди) — послідовна === */
    const sec4_anim = (() => {
      const base = "#sec4";
      const tl = gsap.timeline({ paused: true });
      // 1) Картинка: fade + scale-in + розфокус → фокус
      tl.fromTo(
        `${base} .media-frame`,
        { opacity: 0, scale: 0.8, filter: "blur(10px)" },
        { opacity: 1, scale: 1, filter: "blur(0px)", duration: 1.2, ease: "power3.out" },
        0
      );
      // 2) Показати контейнер параграфа (щоб був видимий заголовок у strong)
      tl.fromTo(
        `${base} .section-subtitle`,
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 0.2, ease: "power2.out" },
        0.2
      );
      // 3) Заголовок (strong) — побуквено
      addLetterReveal(tl, `${base} .section-subtitle strong`, { position: 0.2 });
      // 4) Текст після заголовка — після завершення заголовка
      tl.fromTo(
        `${base} .section-subtitle .subtitle-rest`,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
        ">"
      );
      // 5) Кнопка — після тексту
      tl.fromTo(
        `${base} .text-left .btn`,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
        ">"
      );
      return tl;
    })();

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
    const debouncedRelocate = (() => {
      let timeout;
      return () => {
        clearTimeout(timeout);
        timeout = setTimeout(relocateButtons, 200);
      };
    })();
    window.addEventListener("resize", debouncedRelocate);

    const sectionBaseByAnchor = {
      page1: "#sec1",
      page2: "#sec2",
      page3: "#sec3",
      page4: "#sec4",
    };

    const resetSection = (base) => {
      if (!base) return;
      // Жорстко ховаємо все, щоб уникнути промальовування до старту таймлайна
      gsap.set(`${base} .section-subtitle`, { opacity: base === "#sec3" ? 1 : 0, y: 28, immediateRender: false });
      gsap.set(`${base} .section-subtitle strong`, { opacity: base === "#sec3" ? 0 : 1, immediateRender: false });
      gsap.set(`${base} .section-subtitle .subtitle-rest`, { opacity: 0, y: 14, immediateRender: false });
      gsap.set(`${base} .media-frame`, { opacity: 0, x: 160, immediateRender: false });
      gsap.set(`${base} .btn`, { opacity: 0, y: 30, immediateRender: false });
    };

    // --- Ініціалізація fullPage.js ---
    $("#fullpage").fullpage({
      autoScrolling: true,
      scrollingSpeed: 900,
      controlArrows: true,
      navigation: true,
      navigationPosition: "right",
      anchors: ["page1", "page2", "page3", "page4"],
      afterLoad(anchorLink) {
        const base = sectionBaseByAnchor[anchorLink];
        resetSection(base);
        const tl = timelines[anchorLink];
        if (tl) tl.restart();
      },
      onLeave(index, nextIndex, direction) {
        const key = `page${index}`;
        const tl = timelines[key];
        if (tl) tl.reverse().pause();
      },
    });
  } // <-- Кінець блоку if (fullpageElement)

  // === 2. ЛОГІКА ДЛЯ 3D-ЗАЛУ СЛАВИ (istoriya.html) ===
  const hallCanvas = document.getElementById("hall-of-fame-canvas");
  const hallSection = document.getElementById("hall-of-fame");
  if (hallCanvas && hallSection && window.THREE) {
    const { THREE } = window;
    const renderer = new THREE.WebGLRenderer({
      canvas: hallCanvas,
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x04040c);
    scene.fog = new THREE.Fog(0x04040c, 20, 90);

    const camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      200
    );
    camera.position.set(0, 1.5, 5);

    const ambient = new THREE.AmbientLight(0xb3c0ff, 0.6);
    scene.add(ambient);
    const dir = new THREE.DirectionalLight(0xfff3d6, 0.4);
    dir.position.set(5, 6, 2);
    scene.add(dir);

    const corridor = new THREE.Mesh(
      new THREE.BoxGeometry(16, 6, 90),
      new THREE.MeshStandardMaterial({
        color: 0x060610,
        roughness: 0.9,
        metalness: 0.05,
        side: THREE.BackSide,
      })
    );
    scene.add(corridor);

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(50, 120),
      new THREE.MeshStandardMaterial({
        color: 0x0f0f1d,
        roughness: 0.4,
        metalness: 0.2,
      })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1.8;
    scene.add(floor);

    const pathPoints = [
      new THREE.Vector3(0, 1.6, 2),
      new THREE.Vector3(0, 1.6, -8),
      new THREE.Vector3(-3, 1.7, -18),
      new THREE.Vector3(3, 1.8, -32),
      new THREE.Vector3(-2, 1.7, -48),
      new THREE.Vector3(0, 1.6, -62),
    ];
    const cameraPath = new THREE.CatmullRomCurve3(pathPoints, false, "centripetal");

    const loader = new THREE.TextureLoader();
    const exhibits = [
      {
        texture: "images/legends/hero_first_champions.jpg.jpg",
        position: new THREE.Vector3(-4.2, 1.7, -12),
        rotation: 0.35,
      },
      {
        texture: "images/legends/hero_higher_league_table.jpg.jpg",
        position: new THREE.Vector3(4.2, 1.7, -30),
        rotation: -0.35,
      },
      {
        texture: "images/legends/today_team_red_medals_banner.jpg.jpg",
        position: new THREE.Vector3(-3.5, 1.7, -48),
        rotation: 0.25,
      },
    ];

    exhibits.forEach((item) => {
      loader.load(
        item.texture,
        (texture) => {
          texture.colorSpace = THREE.SRGBColorSpace;
          const aspect = texture.image ? texture.image.width / texture.image.height : 1.6;
          const height = 3;
          const width = height * aspect;
          const mesh = new THREE.Mesh(
            new THREE.PlaneGeometry(width, height),
            new THREE.MeshStandardMaterial({
              map: texture,
              emissive: 0x050505,
              roughness: 0.4,
            })
          );
          mesh.position.copy(item.position);
          mesh.rotation.y = item.rotation;
          scene.add(mesh);
        },
        undefined,
        () => {
          console.warn("Не вдалося завантажити текстуру:", item.texture);
        }
      );
    });

    const scrollState = { t: 0 };
    const progressFill = document.getElementById("hall-progress");
    const overlayPanels = Array.from(document.querySelectorAll(".overlay-panel"));
    let activeOverlay = overlayPanels[0];

    const updateOverlay = (progress) => {
      const stops = [0, 0.34, 0.67];
      let index = stops.length - 1;
      for (let i = 0; i < stops.length; i += 1) {
        if (progress <= stops[i] + 0.17) {
          index = i;
          break;
        }
      }
      const panel = overlayPanels[index];
      if (panel && panel !== activeOverlay) {
        activeOverlay?.classList.remove("is-active");
        panel.classList.add("is-active");
        activeOverlay = panel;
      }
    };

    const updateProgress = (progress) => {
      if (progressFill) {
        progressFill.style.width = `${(progress * 100).toFixed(1)}%`;
      }
    };

    ScrollTrigger.create({
      trigger: hallSection,
      start: "top top",
      end: "+=4000",
      scrub: 0.8,
      pin: true,
      snap: {
        snapTo: [0, 0.34, 0.67, 1],
        duration: 0.6,
        ease: "power1.inOut",
      },
      onUpdate: (self) => {
        scrollState.t = self.progress;
        updateOverlay(self.progress);
        updateProgress(self.progress);
      },
    });

    const animate = () => {
      requestAnimationFrame(animate);
      const clamped = THREE.MathUtils.clamp(scrollState.t, 0, 0.999);
      const point = cameraPath.getPointAt(clamped);
      const lookPoint = cameraPath.getPointAt(Math.min(clamped + 0.01, 0.999));
      camera.position.copy(point);
      camera.position.y += Math.sin(performance.now() * 0.0005) * 0.05;
      camera.lookAt(lookPoint);
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      const { innerWidth, innerHeight } = window;
      renderer.setSize(innerWidth, innerHeight);
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);
  }
});

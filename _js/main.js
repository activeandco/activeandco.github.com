export function localizedPath(pathname, wantedLang) {
  const path = pathname || "/";
  let portfolioMatch;

  if (wantedLang === "fr") {
    if (/^\/fr(?:\/|$)/.test(path)) return path;

    portfolioMatch = path.match(/^\/work\/([^/]+)\/?$/);
    if (portfolioMatch) return `/fr/portfolio/${portfolioMatch[1]}/`;
    if (path === "/") return "/fr/";

    return `/fr${path}`;
  }

  portfolioMatch = path.match(/^\/fr\/portfolio\/([^/]+)\/?$/);
  if (portfolioMatch) return `/work/${portfolioMatch[1]}/`;
  if (/^\/fr\/?$/.test(path)) return "/";
  if (/^\/fr\//.test(path)) return path.slice(3);

  return path;
}

export function currentLang(pathname) {
  return /^\/fr(?:\/|$)/.test(pathname) ? "fr" : "en";
}

function setCookie(name, value, days) {
  const expires = new Date(Date.now() + days * 86400000).toUTCString();
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax${secure}`;
}

function getCookie(name) {
  const prefix = `${name}=`;
  const cookie = document.cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(prefix));

  return cookie ? cookie.slice(prefix.length) : "";
}

function switchLang(wantedLang) {
  const language = wantedLang === "fr" ? "fr" : "en";
  if (language === currentLang(window.location.pathname)) return;

  const path = localizedPath(window.location.pathname, language);
  window.location.replace(`${window.location.origin}${path}${window.location.search}${window.location.hash}`);
}

function initializeSite() {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const menuButton = document.querySelector(".icon-menu");
  const closeButton = document.querySelector(".icon-close");
  const sidebar = document.querySelector(".layout-sidebar");
  const movable = [...document.querySelectorAll(".movable")];
  const sectionLinks = [...document.querySelectorAll(".section-url")];
  const navigationLinks = [...document.querySelectorAll('.navigation a[href^="#"]')];
  const sidebarLinks = sidebar ? [...sidebar.querySelectorAll("a")] : [];
  let sideOpen = false;
  let trackSections = true;
  let scrollFrame;

  document.querySelector("#lang-en")?.addEventListener("click", () => setCookie("lang", "en", 20));
  document.querySelector("#lang-fr")?.addEventListener("click", () => setCookie("lang", "fr", 20));
  document.querySelector(".waiting")?.classList.remove("animate");
  window.setTimeout(() => document.querySelector(".browsehappy")?.remove(), 7000);

  document.querySelectorAll(".competence").forEach((competence) => {
    const icon = competence.querySelector(".competence-icon");
    if (!icon) return;

    competence.addEventListener("pointerenter", () => {
      const color = icon.dataset.color;
      icon.style.backgroundColor = color;
      document.querySelectorAll(".word-emphasis").forEach((word) => {
        word.style.color = color;
      });
    });
    competence.addEventListener("pointerleave", () => {
      icon.style.backgroundColor = "#FC0";
      document.querySelectorAll(".word-emphasis").forEach((word) => {
        word.style.color = "#FC0";
      });
    });
  });

  const sections = [...document.querySelectorAll("section")];
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("reached");
      });
    }, { rootMargin: "0px 0px -40% 0px" });
    sections.forEach((section) => revealObserver.observe(section));
  } else {
    sections.forEach((section) => section.classList.add("reached"));
  }

  function setActiveSection(href, historyMethod = "replaceState") {
    navigationLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === href);
    });
    if (href && window.location.hash !== href) {
      window.history[historyMethod](null, "", href);
    }
  }

  function documentTop(element) {
    return element.getBoundingClientRect().top + window.scrollY;
  }

  function updateActiveSection() {
    scrollFrame = undefined;
    if (!trackSections || sectionLinks.length === 0) return;

    const marker = window.scrollY + Math.max(1, window.innerHeight * 0.02);
    const active = sectionLinks.reduce((selected, link) => {
      return documentTop(link) <= marker ? link : selected;
    }, sectionLinks[0]);
    setActiveSection(active.getAttribute("href"));
  }

  window.addEventListener("scroll", () => {
    if (!scrollFrame) scrollFrame = window.requestAnimationFrame(updateActiveSection);
  }, { passive: true });

  function scrollToSection(href, addHistory = true) {
    const target = href ? document.querySelector(href) : null;
    trackSections = false;
    window.scrollTo({
      top: target ? documentTop(target) : 0,
      behavior: reducedMotion ? "auto" : "smooth"
    });
    setActiveSection(href || "#activeandco", addHistory ? "pushState" : "replaceState");
    window.setTimeout(() => {
      trackSections = true;
      updateActiveSection();
    }, reducedMotion ? 0 : 750);
  }

  function setSideState(open) {
    if (!menuButton || !closeButton || !sidebar) return;

    menuButton.setAttribute("aria-expanded", String(open));
    closeButton.setAttribute("aria-expanded", String(open));
    sidebar.setAttribute("aria-hidden", String(!open));
    sidebar.classList.toggle("is-open", open);
    sidebarLinks.forEach((link) => {
      if (open) link.removeAttribute("tabindex");
      else link.setAttribute("tabindex", "-1");
    });
  }

  function transitionDelay() {
    if (reducedMotion || movable.length === 0) return 0;
    const seconds = Number.parseFloat(window.getComputedStyle(movable[0]).transitionDuration);
    return Number.isFinite(seconds) ? seconds * 1000 : 0;
  }

  function hideSide(callback, restoreFocus = true) {
    if (!menuButton || !closeButton || !sidebar) {
      callback?.();
      return;
    }
    if (!sideOpen) {
      callback?.();
      return;
    }

    closeButton.style.display = "none";
    menuButton.hidden = false;
    movable.forEach((element) => element.classList.remove("move"));
    setSideState(false);
    window.setTimeout(() => {
      sideOpen = false;
      sidebar.style.right = "-260px";
      if (restoreFocus) menuButton.focus();
      callback?.();
    }, transitionDelay());
  }

  function showSide() {
    if (!menuButton || !closeButton || !sidebar) return;

    menuButton.hidden = true;
    closeButton.style.display = "block";
    sidebar.style.right = "0";
    movable.forEach((element) => element.classList.add("move"));
    sideOpen = true;
    setSideState(true);
    sidebarLinks[0]?.focus();
  }

  setSideState(false);
  menuButton?.addEventListener("click", showSide);
  closeButton?.addEventListener("click", () => hideSide());
  movable.forEach((element) => {
    element.addEventListener("click", () => {
      if (sideOpen) hideSide();
    });
  });
  document.addEventListener("keydown", (event) => {
    if (sideOpen && event.key === "Escape") {
      event.preventDefault();
      hideSide();
    }
  });

  navigationLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");
      if (!href || !document.querySelector(href)) return;

      event.preventDefault();
      hideSide(() => scrollToSection(href), false);
    });
  });

  document.querySelectorAll(".portfolio-item").forEach((item) => {
    item.addEventListener("pointerenter", () => {
      item.classList.add("hover-in");
      item.classList.remove("hover-out");
    });
    item.addEventListener("pointerleave", () => {
      item.classList.add("hover-out");
      item.classList.remove("hover-in");
    });
  });

  window.addEventListener("popstate", () => scrollToSection(window.location.hash, false));
  updateActiveSection();
}

if (typeof window !== "undefined") {
  document.documentElement.classList.replace("no-js", "js");
  const preferredLanguage = getCookie("lang")
    || (window.navigator.language || "en").slice(0, 2);
  switchLang(preferredLanguage);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeSite);
  } else {
    initializeSite();
  }
}

/* 
  Awards Finder Website Customization
  - Applies branding based on the mobile app theme (colors from src/theme.ts)
  - Updates landing page copy to Awards Finder (without touching HTML)
  - Adds UX: smooth scroll, mobile nav toggle, active link highlight, dynamic year, lazy images
  - Store links are configurable via window.AWARDS_FINDER_WEBSITE_CONFIG
*/

(function () {
  const onReady = (fn) => {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  };

  onReady(() => {
    // ---------- Config (override via window.AWARDS_FINDER_WEBSITE_CONFIG) ----------
    const defaultConfig = {
      brandName: "Awards Finder",
      brandFull: "Awards Finder",
      company: "PureHabit",
      title: "Awards Finder — Find and Track Award Flights",
      description:
        "Search, track, and book award flights. Set alerts, compare programs, and maximize your points.",
      keywords:
        "award flights, points, miles, alerts, airlines, credit cards, redemption",
      colors: {
        // From mobile theme.ts
        primary: "#1967d2", // theme.colorBlue
        accent: "#fca311", // theme.colorGold
        neutral: "#1A1F24",
      },
      hero: {
        line1: "Find Award Flights Fast.",
        highlight: "Search Smarter. Redeem Better.",
        subtitle:
          "Discover award availability, set alerts, and use your points where they matter.",
      },
      features: [
        {
          title: "Powerful Award Search",
          description:
            "Scan routes and dates to surface real award seats across programs.",
        },
        {
          title: "Real-time Alerts",
          description:
            "Get notified when award space opens that matches your criteria.",
        },
        {
          title: "Point Wallet",
          description:
            "Track balances across bank and airline programs in one place.",
        },
        {
          title: "Smart Filters",
          description:
            "Filter by cabins, stops, aircraft, and partner programs.",
        },
      ],
      howItWorks: {
        title: "Get Started in 3 Easy Steps",
        subtitle: "Plan, monitor, and book your next redemption.",
        steps: [
          {
            title: "Set Your Route",
            description:
              "Choose origin, destination, dates, cabin, and stops.",
          },
          {
            title: "Choose Programs",
            description:
              "Select airline and bank partners you can transfer from.",
          },
          {
            title: "Create Alerts",
            description:
              "We watch availability and notify you instantly.",
          },
        ],
      },
      cta: {
        title: "Start Finding Award Flights Today",
        subtitle:
          "Join travelers saving time and points with smarter award searches.",
      },
      store: {
        appStoreUrl: "#", // Replace when available
        playStoreUrl: "#", // Replace when available
      },
    };

    const userConfig = window.AWARDS_FINDER_WEBSITE_CONFIG || {};
    const config = {
      ...defaultConfig,
      ...userConfig,
      colors: { ...defaultConfig.colors, ...(userConfig.colors || {}) },
      hero: { ...defaultConfig.hero, ...(userConfig.hero || {}) },
      cta: { ...defaultConfig.cta, ...(userConfig.cta || {}) },
      howItWorks: {
        ...defaultConfig.howItWorks,
        ...(userConfig.howItWorks || {}),
        steps:
          (userConfig.howItWorks && userConfig.howItWorks.steps) ||
          defaultConfig.howItWorks.steps,
      },
      features: userConfig.features || defaultConfig.features,
      store: { ...defaultConfig.store, ...(userConfig.store || {}) },
    };

    // ---------- Helpers ----------
    const qs = (sel, root = document) => root.querySelector(sel);
    const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));
    const setText = (el, text) => {
      if (el) el.textContent = text;
    };
    const setHTML = (el, html) => {
      if (el) el.innerHTML = html;
    };

    // ---------- Meta / Title ----------
    try {
      if (config.title) document.title = config.title;
      const metaDesc = qs('meta[name="description"]');
      if (metaDesc && config.description) {
        metaDesc.setAttribute("content", config.description);
      }
      const metaKeywords = qs('meta[name="keywords"]');
      if (metaKeywords && config.keywords) {
        metaKeywords.setAttribute("content", config.keywords);
      }
    } catch (_) {}

    // ---------- Theme (CSS variables, gradient, CTA colors) ----------
    try {
      const root = document.documentElement;
      root.style.setProperty("--brand-primary", config.colors.primary);
      root.style.setProperty("--brand-accent", config.colors.accent);
      root.style.setProperty("--brand-neutral", config.colors.neutral);

      // Gradient text replacement (override Tailwind green)
      qsa(".gradient-text").forEach((el) => {
        el.style.background = `linear-gradient(to right, ${config.colors.primary}, ${config.colors.accent})`;
        el.style.webkitBackgroundClip = "text";
        el.style.webkitTextFillColor = "transparent";
      });

      // CTA buttons
      qsa(".cta-button").forEach((btn) => {
        btn.style.backgroundColor = config.colors.primary;
        btn.style.borderColor = config.colors.primary;
      });

      // Nav hover accent (inline style override)
      qsa("nav a, #mobile-menu a").forEach((a) => {
        a.addEventListener("mouseover", () => {
          a.style.color = config.colors.primary;
        });
        a.addEventListener("mouseout", () => {
          a.style.color = "";
        });
      });
    } catch (_) {}

    // ---------- Header Brand ----------
    try {
      const headerBrand = qs("header .font-bold");
      setText(headerBrand, config.brandFull);
    } catch (_) {}

    // ---------- Hero Section ----------
    try {
      const heroSection = qs("main section.hero-bg");
      if (heroSection) {
        const h1 = qs("h1", heroSection);
        const p = qs("p", heroSection);
        if (h1) {
          setHTML(
            h1,
            `${config.hero.line1} <br> <span class="gradient-text">${config.hero.highlight}</span>`
          );
        }
        setText(p, config.hero.subtitle);
      }
    } catch (_) {}

    // ---------- Features Section ----------
    try {
      const featuresSection = qs("#features");
      if (featuresSection) {
        const title = qs("h2", featuresSection);
        const subtitle = qs("p", qs(".text-center", featuresSection) || featuresSection);
        setText(title, "Tools for Your Award Travel");
        setText(
          subtitle,
          "Everything you need to discover, track, and redeem award flights efficiently."
        );

        const cards = qsa(".grid > div", featuresSection);
        config.features.slice(0, cards.length).forEach((feat, idx) => {
          const card = cards[idx];
          const h3 = qs("h3", card);
          const p = qs("p", card);
          setText(h3, feat.title);
          setText(p, feat.description);
        });
      }
    } catch (_) {}

    // ---------- How It Works Section ----------
    try {
      const how = qs("#how-it-works");
      if (how) {
        const title = qsa("h2", how)[0];
        const subtitle = qsa(".text-center p", how)[0];
        setText(title, config.howItWorks.title);
        setText(subtitle, config.howItWorks.subtitle);

        const steps = qsa(".max-w-xs", how);
        config.howItWorks.steps.slice(0, steps.length).forEach((step, idx) => {
          const container = steps[idx];
          setText(qs("h3", container), step.title);
          setText(qs("p", container), step.description);
        });
      }
    } catch (_) {}

    // ---------- Download / CTA Section ----------
    try {
      const dl = qs("#download");
      if (dl) {
        const h2 = qs("h2", dl);
        const p = qsa("p", dl)[0];
        setText(h2, config.cta.title);
        setText(p, config.cta.subtitle);

        const appStoreA = qs('a[aria-label*="App Store"]', dl);
        const playStoreA = qs('a[aria-label*="Google Play"]', dl);

        if (appStoreA && config.store.appStoreUrl) {
          appStoreA.href = config.store.appStoreUrl;
          const img = qs("img", appStoreA);
          if (img) {
            img.alt = "Download Awards Finder on the App Store";
          }
        }
        if (playStoreA && config.store.playStoreUrl) {
          playStoreA.href = config.store.playStoreUrl;
          const img = qs("img", playStoreA);
          if (img) {
            img.alt = "Download Awards Finder on Google Play";
          }
        }

        // Platform hint: highlight relevant store
        const ua = navigator.userAgent || "";
        const isAndroid = /Android/i.test(ua);
        const isIOS = /iPhone|iPad|iPod/i.test(ua);
        const emphasize = (el) => {
          if (!el) return;
          const img = qs("img", el);
          if (!img) return;
          img.style.boxShadow = `0 0 0 3px ${config.colors.accent}`;
          img.style.borderRadius = "12px";
        };
        if (isAndroid) emphasize(playStoreA);
        else if (isIOS) emphasize(appStoreA);
      }
    } catch (_) {}

    // ---------- Footer Year + Brand ----------
    try {
      const footer = qs("footer");
      if (footer) {
        const brand = qs(".font-bold", footer);
        if (brand) setText(brand, config.brandFull);
        const copy = qsa(".mt-8.text-center", footer)[0] || qsa(".text-center", footer).slice(-1)[0];
        if (copy) {
          const year = new Date().getFullYear();
          copy.innerHTML = `&copy; ${year} ${config.brandFull} - ${config.company}. All Rights Reserved.`;
        }
      }
    } catch (_) {}

    // ---------- Mobile Menu Toggle (idempotent) ----------
    try {
      const mobileMenuButton = document.getElementById("mobile-menu-button");
      const mobileMenu = document.getElementById("mobile-menu");
      if (mobileMenuButton && mobileMenu && !mobileMenuButton.dataset.bound) {
        mobileMenuButton.addEventListener("click", () => {
          mobileMenu.classList.toggle("hidden");
        });
        mobileMenuButton.dataset.bound = "true";
      }
    } catch (_) {}

    // ---------- Smooth Scroll (idempotent and closes mobile menu) ----------
    try {
      document
        .querySelectorAll('a[href^="#"]')
        .forEach((anchor) => {
          if (anchor.dataset.bound === "true") return;
          anchor.addEventListener("click", function (e) {
            const targetSel = this.getAttribute("href");
            const target = targetSel ? document.querySelector(targetSel) : null;
            if (!target) return;

            e.preventDefault();
            const mm = document.getElementById("mobile-menu");
            if (mm && !mm.classList.contains("hidden")) {
              mm.classList.add("hidden");
            }
            target.scrollIntoView({ behavior: "smooth" });
          });
          anchor.dataset.bound = "true";
        });
    } catch (_) {}

    // ---------- Scrollspy (active nav link styling) ----------
    try {
      const navLinks = qsa("header nav a");
      const idToLink = new Map();
      navLinks.forEach((a) => {
        const href = a.getAttribute("href") || "";
        if (href.startsWith("#")) idToLink.set(href.slice(1), a);
      });

      const sections = qsa("section[id]");
      if (sections.length && idToLink.size) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              const id = entry.target.id;
              const link = idToLink.get(id);
              if (!link) return;
              if (entry.isIntersecting) {
                navLinks.forEach((l) => {
                  l.style.color = "";
                  l.style.fontWeight = "";
                });
                link.style.color = config.colors.primary;
                link.style.fontWeight = "600";
              }
            });
          },
          { root: null, rootMargin: "0px", threshold: 0.5 }
        );
        sections.forEach((sec) => observer.observe(sec));
      }
    } catch (_) {}

    // ---------- Lazy load images (best-effort) ----------
    try {
      qsa("img").forEach((img, idx) => {
        if (!img.hasAttribute("loading")) {
          img.setAttribute("loading", idx < 2 ? "eager" : "lazy");
        }
        img.addEventListener("error", () => {
          img.onerror = null;
          if (!img.src.includes("placehold.co")) {
            img.src =
              "https://placehold.co/600x400/cccccc/ffffff?text=Image+Unavailable";
          }
        });
      });
    } catch (_) {}

    // ---------- Header style on scroll ----------
    try {
      const header = qs("header#header");
      if (header) {
        const toggleShadow = () => {
          if (window.scrollY > 8) {
            header.style.boxShadow = "0 2px 10px rgba(0,0,0,0.08)";
            header.style.backgroundColor = "rgba(255,255,255,0.9)";
          } else {
            header.style.boxShadow = "";
            header.style.backgroundColor = "";
          }
        };
        window.addEventListener("scroll", toggleShadow, { passive: true });
        toggleShadow();
      }
    } catch (_) {}

    // ---------- Warn if store URLs are placeholders ----------
    try {
      if (
        !config.store.appStoreUrl ||
        config.store.appStoreUrl === "#" ||
        !config.store.playStoreUrl ||
        config.store.playStoreUrl === "#"
      ) {
        // eslint-disable-next-line no-console
        console.warn(
          "[Awards Finder] App store URLs are placeholders. Set window.AWARDS_FINDER_WEBSITE_CONFIG.store to real links."
        );
      }
    } catch (_) {}
  });
})();

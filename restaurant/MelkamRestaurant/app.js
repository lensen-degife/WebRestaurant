(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Loader */
  const loader = document.getElementById("loader");
  const body = document.body;

  function hideLoader() {
    if (!loader) return;
    loader.classList.add("is-done");
    body.classList.remove("is-loading");
  }

  body.classList.add("is-loading");
  window.addEventListener("load", () => {
    const delay = prefersReducedMotion ? 0 : 1400;
    window.setTimeout(hideLoader, delay);
  });

  /* Sticky header */
  const header = document.getElementById("site-header");
  function onScrollHeader() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 40);
  }
  window.addEventListener("scroll", onScrollHeader, { passive: true });
  onScrollHeader();

  /* Mobile nav */
  const navToggle = document.getElementById("nav-toggle");
  const navMenu = document.getElementById("nav-menu");

  function closeNav() {
    if (!navToggle || !navMenu) return;
    navToggle.setAttribute("aria-expanded", "false");
    navMenu.classList.remove("is-open");
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const open = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!open));
      navMenu.classList.toggle("is-open", !open);
    });

    navMenu.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", () => {
        if (window.matchMedia("(max-width: 900px)").matches) closeNav();
      });
    });
  }

  /* Menu category tabs */
  const tabBtns = document.querySelectorAll(".menu-tabs__btn");
  const panels = document.querySelectorAll(".menu-grid");

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const cat = btn.dataset.category;
      tabBtns.forEach((b) => {
        b.classList.toggle("is-active", b === btn);
        b.setAttribute("aria-selected", String(b === btn));
      });
      panels.forEach((panel) => {
        const match = panel.dataset.panel === cat;
        panel.classList.toggle("is-active", match);
        panel.hidden = !match;
      });
    });
  });

  /* Lightbox */
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxCaption = document.getElementById("lightbox-caption");
  const lightboxClose = document.getElementById("lightbox-close");

  function openLightbox(src, caption) {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    lightboxImg.alt = caption || "";
    if (lightboxCaption) lightboxCaption.textContent = caption || "";
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    lightboxClose?.focus();
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.hidden = true;
    lightboxImg.src = "";
    document.body.style.overflow = "";
  }

  document.querySelectorAll(".gallery-item[data-lightbox]").forEach((btn) => {
    btn.addEventListener("click", () => {
      openLightbox(btn.dataset.lightbox, btn.dataset.caption);
    });
  });

  lightboxClose?.addEventListener("click", closeLightbox);
  lightbox?.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox && !lightbox.hidden) closeLightbox();
  });

  /* Testimonials */
  const cards = document.querySelectorAll(".testimonial-card");
  const dotsRoot = document.getElementById("testimonial-dots");
  let testimonialIndex = 0;
  let testimonialTimer;

  function showTestimonial(i) {
    testimonialIndex = (i + cards.length) % cards.length;
    cards.forEach((c, j) => c.classList.toggle("is-active", j === testimonialIndex));
    dotsRoot?.querySelectorAll("button").forEach((d, j) => {
      d.classList.toggle("is-active", j === testimonialIndex);
    });
  }

  if (cards.length && dotsRoot) {
    cards.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("aria-label", `Show testimonial ${i + 1}`);
      dot.classList.toggle("is-active", i === 0);
      dot.addEventListener("click", () => {
        showTestimonial(i);
        resetTestimonialTimer();
      });
      dotsRoot.appendChild(dot);
    });

    function nextTestimonial() {
      showTestimonial(testimonialIndex + 1);
    }

    function resetTestimonialTimer() {
      window.clearInterval(testimonialTimer);
      if (!prefersReducedMotion && cards.length > 1) {
        testimonialTimer = window.setInterval(nextTestimonial, 6000);
      }
    }

    resetTestimonialTimer();
  }

  /* Forms */
  const bookingForm = document.getElementById("booking-form");
  const formMessage = document.getElementById("form-message");

  bookingForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!bookingForm.checkValidity()) {
      bookingForm.reportValidity();
      return;
    }
    if (formMessage) {
      formMessage.textContent = "Thank you — we’ll confirm your reservation shortly.";
    }
    bookingForm.reset();
  });

  const newsletterForm = document.getElementById("newsletter-form");
  const newsletterMsg = document.getElementById("newsletter-msg");

  newsletterForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = newsletterForm.querySelector('input[type="email"]');
    if (!email?.value) return;
    if (newsletterMsg) newsletterMsg.textContent = "You’re subscribed. Welcome to the table.";
    newsletterForm.reset();
  });

  /* Footer year */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* Scroll-triggered animations */
  const animated = document.querySelectorAll("[data-animate]");
  if (!prefersReducedMotion && animated.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { root: null, rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    animated.forEach((el) => io.observe(el));
  } else {
    animated.forEach((el) => el.classList.add("is-visible"));
  }
})();

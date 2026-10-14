"use strict";

const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav-links");
const updateHeader = () => header?.classList.toggle("scrolled", window.scrollY > 32);
updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });
const scrollTopButton = document.querySelector(".scroll-top");
const updateScrollTop = () => scrollTopButton?.classList.toggle("is-visible", window.scrollY > 360);
updateScrollTop();
window.addEventListener("scroll", updateScrollTop, { passive: true });
scrollTopButton?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" }));

function closeMenu() {
  menuToggle?.setAttribute("aria-expanded", "false");
  menuToggle?.setAttribute("aria-label", "Open navigation");
  nav?.classList.remove("is-open");
  document.body.classList.remove("menu-open");
  header?.classList.remove("menu-open");
}
menuToggle?.addEventListener("click", () => {
  const open = menuToggle.getAttribute("aria-expanded") !== "true";
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  nav?.classList.toggle("is-open", open);
  document.body.classList.toggle("menu-open", open);
  header?.classList.toggle("menu-open", open);
});
nav?.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));
window.addEventListener("resize", () => { if (window.innerWidth > 720) closeMenu(); });

document.querySelectorAll("#year").forEach(el => el.textContent = new Date().getFullYear());

const siteConfig = window.SITE_CONFIG || {};
document.querySelectorAll("[data-config]").forEach(node => {
  const value = siteConfig[node.dataset.config];
  if (value != null && node.dataset.config === "brandName" && node.classList.contains("brand-word")) {
    node.replaceChildren(document.createTextNode("the"));
    const zeba = document.createElement("strong");
    zeba.textContent = "Zeba";
    node.append(zeba, document.createTextNode("Cone"));
    node.setAttribute("aria-label", value);
  } else if (value != null) node.textContent = value;
});

document.querySelectorAll(".faq-item").forEach(item => {
  const summary = item.querySelector("summary");
  const syncExpanded = () => summary?.setAttribute("aria-expanded", String(item.open));
  syncExpanded();
  item.addEventListener("toggle", syncExpanded);
});

const configNotice = document.querySelector("#config-notice");
let noticeTimer;
function announceConfig(message) {
  if (!configNotice) return;
  configNotice.textContent = message;
  configNotice.classList.add("is-visible");
  window.clearTimeout(noticeTimer);
  noticeTimer = window.setTimeout(() => configNotice.classList.remove("is-visible"), 5000);
}

function makeWhatsAppUrl(message) {
  const number = String(siteConfig.whatsappNumber || "");
  if (!/^\d{10,15}$/.test(number)) return null;
  return `https://wa.me/${number}?text=${encodeURIComponent(message || siteConfig.whatsappMessage || "")}`;
}
document.querySelectorAll("[data-whatsapp]").forEach(link => {
  const url = makeWhatsAppUrl(link.dataset.message);
  if (url) {
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.removeAttribute("aria-disabled");
    link.removeAttribute("title");
    link.classList.remove("is-unconfigured");
    if (link.classList.contains("floating-whatsapp")) document.querySelector("#contact-status")?.replaceChildren(document.createTextNode("WhatsApp booking chat is ready."));
  } else {
    link.href = "#contact";
    link.setAttribute("aria-disabled", "true");
    link.title = "Add your WhatsApp number in site-config.js";
    link.classList.add("is-unconfigured");
    if (link.classList.contains("floating-whatsapp")) {
      link.setAttribute("aria-label", "WhatsApp is not configured yet. Add your number in site-config.js.");
      const label = link.querySelector(".wa-label");
      if (label) label.textContent = "Set WhatsApp number";
    }
    link.addEventListener("click", event => {
      event.preventDefault();
      announceConfig("WhatsApp is ready to connect. Add your number in site-config.js (country code and digits only). ");
      document.querySelector("#contact-status")?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }
});

document.querySelectorAll("[data-phone]").forEach(link => {
  const number = String(siteConfig.whatsappNumber || "");
  if (/^\d{10,15}$/.test(number)) {
    link.href = `tel:+${number}`;
    link.removeAttribute("aria-disabled");
    link.removeAttribute("title");
    link.classList.remove("is-unconfigured");
  } else {
    link.href = "#contact";
    link.setAttribute("aria-disabled", "true");
    link.title = "Add the business phone number in site-config.js";
    link.classList.add("is-unconfigured");
    link.addEventListener("click", event => {
      event.preventDefault();
      announceConfig("Add the business phone number in site-config.js to enable calls.");
      document.querySelector("#contact-status")?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }
});

const instagramUrl = String(siteConfig.instagramProfileUrl || "");
const validInstagram = /^https:\/\/www\.instagram\.com\/(?!YOUR_|$)[A-Za-z0-9._]+\/?$/.test(instagramUrl);
const instagramStatus = document.querySelector("#instagram-status");
document.querySelectorAll("[data-instagram]").forEach(link => {
  if (validInstagram) {
    link.href = instagramUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.removeAttribute("aria-disabled");
    if (instagramStatus) instagramStatus.textContent = "Instagram is linked. The photographs above are inspiration, not a live Instagram feed.";
  } else {
    link.href = "#instagram";
    link.setAttribute("aria-disabled", "true");
    link.title = "Add your Instagram profile URL in site-config.js";
    link.addEventListener("click", event => {
      event.preventDefault();
      const status = document.querySelector("#instagram-status");
      if (status) status.textContent = "Instagram profile not set up yet. Add your profile URL in site-config.js.";
      announceConfig("Add your Instagram profile URL in site-config.js to enable the follow link.");
    });
  }
});

document.querySelectorAll(".inspiration-heading, .inspiration-strip, .faq-heading, .faq-list, .faq-foot").forEach(item => item.classList.add("reveal"));
const revealItems = document.querySelectorAll(".reveal, .timeline");
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add("is-visible"); revealObserver.unobserve(entry.target); }
  }), { threshold: 0.12 });
  revealItems.forEach(item => revealObserver.observe(item));
} else revealItems.forEach(item => item.classList.add("is-visible"));

const heroSlides = [...document.querySelectorAll(".hero-slide")];
const heroSlider = document.querySelector(".hero-slider");
if (heroSlides.length && heroSlider) {
  const dots = document.querySelector(".hero-dots");
  const indexLabel = document.querySelector(".hero-index");
  let active = 0, timer = null, paused = false, pointerX = null;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  heroSlides.forEach((_, i) => {
    const dot = document.createElement("button"); dot.type = "button"; dot.className = "hero-dot";
    dot.setAttribute("aria-label", `Show hero image ${i + 1}`); dot.addEventListener("click", () => { show(i); pauseAuto(); }); dots.append(dot);
  });
  const heroDots = [...dots.querySelectorAll("button")];
  function show(i) { active = (i + heroSlides.length) % heroSlides.length; heroSlides.forEach((slide, n) => { slide.classList.toggle("active", n === active); slide.setAttribute("aria-hidden", String(n !== active)); }); heroDots.forEach((dot, n) => { dot.classList.toggle("active", n === active); dot.setAttribute("aria-current", n === active ? "true" : "false"); }); if (indexLabel) indexLabel.innerHTML = `${String(active + 1).padStart(2,"0")} <span>/</span> ${String(heroSlides.length).padStart(2,"0")}`; }
  function stop() { clearInterval(timer); timer = null; }
  function start() { stop(); if (!paused && !reduced.matches && !document.hidden) timer = setInterval(() => show(active + 1), 4500); }
  function pauseAuto() { paused = true; stop(); }
  document.querySelector(".hero-prev")?.addEventListener("click", () => { show(active - 1); pauseAuto(); });
  document.querySelector(".hero-next")?.addEventListener("click", () => { show(active + 1); pauseAuto(); });
  heroSlider.addEventListener("mouseenter", stop); heroSlider.addEventListener("mouseleave", start);
  heroSlider.addEventListener("focusin", stop); heroSlider.addEventListener("focusout", start);
  heroSlider.addEventListener("pointerdown", e => { pointerX = e.clientX; });
  heroSlider.addEventListener("pointerup", e => { if (pointerX !== null && Math.abs(e.clientX - pointerX) > 45) { show(active + (e.clientX < pointerX ? 1 : -1)); pauseAuto(); } pointerX = null; });
  reduced.addEventListener?.("change", start); document.addEventListener("visibilitychange", start); show(0); start();
}

const galleryItems = [...document.querySelectorAll(".gallery-item")];
if ("IntersectionObserver" in window) {
  const galleryEntrance = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      galleryEntrance.unobserve(entry.target);
    }
  }), { threshold: 0.08 });
  galleryItems.forEach((item, index) => {
    item.style.setProperty("--gallery-order", String(index % 5));
    galleryEntrance.observe(item);
  });
} else galleryItems.forEach(item => item.classList.add("is-visible"));
const filters = [...document.querySelectorAll(".filter")];
let galleryFilterRun = 0;
filters.forEach(filter => filter.addEventListener("click", () => {
  const thisRun = ++galleryFilterRun;
  filters.forEach(item => { item.classList.remove("active"); item.setAttribute("aria-pressed", "false"); });
  filter.classList.add("active"); filter.setAttribute("aria-pressed", "true");
  galleryItems.forEach((item, index) => {
    const matches = filter.dataset.filter === "all" || item.dataset.category.split(" ").includes(filter.dataset.filter);
    if (!matches) {
      item.classList.add("is-leaving");
      window.setTimeout(() => { if (thisRun === galleryFilterRun) { item.hidden = true; item.classList.remove("is-leaving"); } }, 170);
    } else {
      item.hidden = false;
      item.style.animationDelay = `${Math.min(index % 4, 3) * 45}ms`;
      item.animate?.([{ opacity: 0, transform: "translateY(10px)" }, { opacity: 1, transform: "translateY(0)" }], { duration: 280, easing: "ease-out" });
    }
  });
}));
filters.forEach(button => button.setAttribute("aria-pressed", String(button.classList.contains("active"))));

const lightbox = document.querySelector(".lightbox");
if (lightbox && galleryItems.length) {
  const lightboxImage = lightbox.querySelector("figure img");
  const lightboxCaption = lightbox.querySelector("figcaption");
  const lightboxCount = lightbox.querySelector(".lightbox-count");
  let currentSet = [], currentIndex = 0, returnFocus = null;
  function showDesign(index) {
    currentIndex = (index + currentSet.length) % currentSet.length;
    const item = currentSet[currentIndex];
    lightboxImage.style.opacity = "0.25";
    const nextImage = new Image();
    nextImage.onload = () => { lightboxImage.src = nextImage.src; lightboxImage.alt = item.querySelector("img").alt; lightboxImage.style.opacity = "1"; };
    nextImage.onerror = () => { lightboxImage.src = item.querySelector("img").src; lightboxImage.alt = item.querySelector("img").alt; lightboxImage.style.opacity = "1"; };
    nextImage.src = item.dataset.full;
    lightboxCaption.textContent = item.dataset.title;
    lightboxCount.textContent = `${String(currentIndex + 1).padStart(2,"0")} / ${String(currentSet.length).padStart(2,"0")}`;
  }
  galleryItems.forEach(item => item.addEventListener("click", () => {
    currentSet = galleryItems.filter(candidate => !candidate.hidden);
    currentIndex = currentSet.indexOf(item); returnFocus = item;
    showDesign(currentIndex); lightbox.showModal(); lightbox.querySelector(".lightbox-close").focus();
  }));
  lightbox.querySelector(".lightbox-close").addEventListener("click", () => lightbox.close());
  lightbox.querySelector(".lightbox-prev").addEventListener("click", () => showDesign(currentIndex - 1));
  lightbox.querySelector(".lightbox-next").addEventListener("click", () => showDesign(currentIndex + 1));
  lightbox.addEventListener("close", () => returnFocus?.focus());
  lightbox.addEventListener("click", event => { if (event.target === lightbox) lightbox.close(); });
  lightbox.addEventListener("keydown", event => {
    if (event.key === "ArrowRight") showDesign(currentIndex + 1);
    if (event.key === "ArrowLeft") showDesign(currentIndex - 1);
  });
}

const slides = [...document.querySelectorAll(".testimonial")];
const carousel = document.querySelector(".testimonial-carousel");
const testimonialSection = document.querySelector(".testimonials-section");
if (slides.length && carousel) {
  const count = document.querySelector(".carousel-count");
  const pause = document.querySelector(".carousel-pause");
  const track = carousel.querySelector(".testimonial-track");
  const dots = carousel.querySelector(".testimonial-dots");
  const controls = new AbortController();
  const signal = controls.signal;
  const originalCount = slides.length;
  let activeSlide = 0, position = 0, visibleCount = 1, timer = null;
  let userPaused = false, hovering = false, focusInside = false, pointerStart = null, resetTimer = null;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const clones = [];
  function getVisibleCount() {
    if (window.innerWidth <= 600) return 1;
    if (window.innerWidth <= 1000) return 2;
    return 3;
  }
  function setPosition(nextPosition, animate = true) {
    const children = [...track.children];
    const style = getComputedStyle(track);
    const gap = parseFloat(style.columnGap || style.gap) || 0;
    const step = (children[0]?.getBoundingClientRect().width || 0) + gap;
    position = nextPosition;
    activeSlide = ((position % originalCount) + originalCount) % originalCount;
    track.style.transition = animate && !reducedMotion.matches ? "" : "none";
    if (!animate || reducedMotion.matches) void track.offsetWidth;
    track.style.transform = `translate3d(${-position * step}px, 0, 0)`;
    children.forEach((item, index) => {
      const visible = index >= position && index < position + visibleCount;
      item.setAttribute("aria-hidden", String(!visible));
      item.classList.toggle("active", visible);
    });
    count.textContent = `${String(activeSlide + 1).padStart(2, "0")} / ${String(originalCount).padStart(2, "0")}`;
    [...dots.children].forEach((dot, index) => {
      dot.setAttribute("aria-current", String(index === activeSlide));
    });
  }
  function rebuildClones() {
    clones.forEach(clone => clone.remove());
    clones.length = 0;
    visibleCount = getVisibleCount();
    for (let index = 0; index < visibleCount; index++) {
      const clone = slides[index % originalCount].cloneNode(true);
      clone.classList.add("testimonial-clone");
      clone.removeAttribute("id");
      clone.removeAttribute("aria-live");
      clone.setAttribute("aria-hidden", "true");
      track.append(clone);
      clones.push(clone);
    }
    const trackGap = parseFloat(getComputedStyle(track).columnGap) || 0;
    const cardWidth = (carousel.clientWidth - trackGap * (visibleCount - 1)) / visibleCount;
    track.style.setProperty("--testimonial-card-width", `${cardWidth}px`);
    dots.replaceChildren(...slides.map((_, index) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "testimonial-dot";
      dot.setAttribute("aria-label", `Show testimonial ${index + 1}`);
      dot.setAttribute("aria-current", "false");
      dot.addEventListener("click", () => { pauseByUser(); setPosition(index); }, { signal });
      return dot;
    }));
    setPosition(activeSlide, false);
  }
  function stopTimer() { if (timer) window.clearInterval(timer); timer = null; }
  function startTimer() {
    stopTimer();
    if (!userPaused && !hovering && !focusInside && !reducedMotion.matches && !document.hidden) {
      timer = window.setInterval(() => advance(1), 5000);
    }
  }
  function pauseByUser() {
    userPaused = true;
    stopTimer();
    pause.textContent = "▶";
    pause.setAttribute("aria-label", "Resume automatic testimonials");
  }
  function advance(direction) {
    if (resetTimer) window.clearTimeout(resetTimer);
    if (position >= originalCount) setPosition(0, false);
    if (direction < 0 && position === 0) {
      setPosition(originalCount, false);
      void track.offsetWidth;
      setPosition(originalCount - 1);
    } else {
      setPosition(position + direction);
    }
    if (direction > 0 && position === originalCount) {
      resetTimer = window.setTimeout(() => setPosition(0, false), reducedMotion.matches ? 0 : 680);
    }
  }
  function handleManual(direction) { pauseByUser(); advance(direction); }
  carousel.querySelector(".carousel-prev")?.addEventListener("click", () => handleManual(-1), { signal });
  carousel.querySelector(".carousel-next")?.addEventListener("click", () => handleManual(1), { signal });
  pause?.addEventListener("click", () => {
    userPaused = !userPaused;
    pause.textContent = userPaused ? "▶" : "Ⅱ";
    pause.setAttribute("aria-label", userPaused ? "Resume automatic testimonials" : "Pause automatic testimonials");
    startTimer();
  }, { signal });
  testimonialSection?.addEventListener("pointerenter", () => { hovering = true; stopTimer(); }, { signal });
  testimonialSection?.addEventListener("pointerleave", () => { hovering = false; startTimer(); }, { signal });
  carousel.addEventListener("focusin", () => { focusInside = true; stopTimer(); }, { signal });
  carousel.addEventListener("focusout", event => {
    if (!carousel.contains(event.relatedTarget)) { focusInside = false; startTimer(); }
  }, { signal });
  carousel.addEventListener("pointerdown", event => {
    if (event.pointerType === "touch") pointerStart = { x: event.clientX, y: event.clientY };
  }, { signal });
  carousel.addEventListener("pointerup", event => {
    if (!pointerStart) return;
    const dx = event.clientX - pointerStart.x, dy = event.clientY - pointerStart.y;
    pointerStart = null;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) handleManual(dx < 0 ? 1 : -1);
  }, { signal });
  carousel.addEventListener("pointercancel", () => { pointerStart = null; }, { signal });
  carousel.addEventListener("keydown", event => {
    if (event.key === "ArrowLeft") { event.preventDefault(); handleManual(-1); }
    if (event.key === "ArrowRight") { event.preventDefault(); handleManual(1); }
  }, { signal });
  document.addEventListener("visibilitychange", startTimer, { signal });
  reducedMotion.addEventListener?.("change", startTimer, { signal });
  window.addEventListener("resize", rebuildClones, { signal });
  window.addEventListener("pagehide", () => {
    stopTimer();
    if (resetTimer) window.clearTimeout(resetTimer);
    controls.abort();
  }, { once: true, signal });
  rebuildClones();
  startTimer();
}

const enquiryForm = document.querySelector("#enquiry-form");
if (enquiryForm) {
  const status = enquiryForm.querySelector(".form-status"), submitButton = enquiryForm.querySelector('[type="submit"]');
  const emailConfig = siteConfig.emailJs || {};
  const configured = [emailConfig.publicKey, emailConfig.serviceId, emailConfig.templateId].every(value => value && !/^YOUR_/i.test(value));
  if (configured && window.emailjs?.init) window.emailjs.init({ publicKey: emailConfig.publicKey });
  else status.textContent = "Demo mode: email is not configured, so this form will not send. Use WhatsApp to contact us.";
  let submitting = false;
  enquiryForm.addEventListener("submit", async event => {
    event.preventDefault();
    if (!enquiryForm.reportValidity() || submitting) return;
    if (!configured || !window.emailjs?.sendForm) { status.textContent = "Demo mode: no email was sent. Configure EmailJS in site-config.js, or contact us on WhatsApp."; return; }
    submitting = true; submitButton.disabled = true; submitButton.setAttribute("aria-busy", "true"); status.textContent = "Sending your enquiry…";
    try {
      const response = await window.emailjs.sendForm(emailConfig.serviceId, emailConfig.templateId, enquiryForm);
      if (response.status < 200 || response.status >= 300) throw new Error(`Email service returned status ${response.status}`);
      status.textContent = "Thank you. Your enquiry was sent successfully."; enquiryForm.reset();
    } catch (error) {
      status.textContent = "Your enquiry could not be sent. Please try again or contact us on WhatsApp.";
    } finally { submitting = false; submitButton.disabled = false; submitButton.removeAttribute("aria-busy"); }
  });
}

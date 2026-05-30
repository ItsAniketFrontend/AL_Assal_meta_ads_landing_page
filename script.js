/* =========================================================
   AL ASAL MARBLES · Landing Page JS
   ========================================================= */

/* ---------------------------------------------------------
   1) CONFIG  ←  EDIT THESE BEFORE LAUNCH
   --------------------------------------------------------- */
const CONFIG = {
  // Landline shown on the site / used for click-to-call:
  phone: "+97165345581",
  // WhatsApp-enabled number in international format, NO "+", spaces or dashes.
  // ⚠️ Replace with the team's real WhatsApp mobile number:
  whatsapp: "97165345581",
  email: "info@alasalmarbles.com",
  // Optional: paste a Formspree / form-handler endpoint to receive emails.
  // Leave empty ("") to skip · the form will still work via WhatsApp.
  formEndpoint: ""
};

/* ---------------------------------------------------------
   2) Helpers
   --------------------------------------------------------- */
const $  = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

// Progressive enhancement: reveal styles only apply once JS is running,
// so content is never permanently hidden if a script fails to load.
document.documentElement.classList.add("js");

const waLink = (msg = "") =>
  `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;

const track = (event, data = {}) => {
  if (typeof fbq === "function") fbq("track", event, data);
};

/* ---------------------------------------------------------
   3) Wire up Call / WhatsApp / year
   --------------------------------------------------------- */
$$(".js-call").forEach(a => { a.href = `tel:${CONFIG.phone}`; });

const defaultWaMsg =
  "Hello Al Asal Marbles, I'd like a quote for natural stone for my project.";
$$(".js-whatsapp").forEach(a => {
  a.href = waLink(defaultWaMsg);
  a.target = "_blank";
  a.rel = "noopener";
  a.addEventListener("click", () => track("Contact", { method: "whatsapp" }));
});

const yearEl = $("#year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ---------------------------------------------------------
   4) Sticky header
   --------------------------------------------------------- */
const header = $(".site-header");
const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 40);
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

/* ---------------------------------------------------------
   5) Mobile navigation (built from the desktop nav)
   --------------------------------------------------------- */
const toggle = $(".nav-toggle");
const backdrop = Object.assign(document.createElement("div"), { className: "nav-backdrop" });
const panel = document.createElement("nav");
panel.className = "mobile-nav";
panel.setAttribute("aria-label", "Mobile");
panel.innerHTML =
  $$(".nav a").map(a => `<a href="${a.getAttribute("href")}">${a.textContent}</a>`).join("") +
  `<a href="#quote" class="btn btn-gold">Get Free Quote</a>`;
document.body.append(backdrop, panel);

const setMenu = open => {
  panel.classList.toggle("open", open);
  backdrop.classList.toggle("open", open);
  toggle.setAttribute("aria-expanded", String(open));
  document.body.style.overflow = open ? "hidden" : "";
};
toggle.addEventListener("click", () => setMenu(!panel.classList.contains("open")));
backdrop.addEventListener("click", () => setMenu(false));
$$("a", panel).forEach(a => a.addEventListener("click", () => setMenu(false)));

/* ---------------------------------------------------------
   6) OPTIONAL real photos · drop a URL into a card's
      data-img="" (in index.html) and it loads on top of the
      CSS stone texture. If it fails or is empty, the texture
      stays · nothing ever looks broken.
   --------------------------------------------------------- */
$$("[data-img]").forEach(el => {
  const url = el.getAttribute("data-img");
  if (!url) return;                                  // empty → keep CSS stone texture
  const img = new Image();
  img.onload = () => {
    el.style.backgroundImage = `url("${url}")`;
    el.classList.remove("tex-vein", "tex-speck", "tex-mottle");
  };
  img.onerror = () => { /* keep the CSS stone texture */ };
  img.src = url;
});

/* ---------------------------------------------------------
   7) Animations · GSAP + ScrollTrigger (graceful fallback)
   --------------------------------------------------------- */
const reveals = $$(".reveal");
const G = window.gsap;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Count-up for stat numbers (used by GSAP and the fallback alike).
const animateCount = el => {
  const target = +el.dataset.count, suffix = el.dataset.suffix || "";
  const dur = 1600, t0 = performance.now();
  const tick = now => {
    const p = Math.min((now - t0) / dur, 1);
    const val = Math.floor((1 - Math.pow(1 - p, 3)) * target);
    el.textContent = val.toLocaleString() + suffix;
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};

// Split a heading into per-word spans, preserving inner markup (e.g. <span class="gold">).
const splitWords = el => {
  const out = [];
  const walk = node => [...node.childNodes].forEach(child => {
    if (child.nodeType === Node.TEXT_NODE) {
      const frag = document.createDocumentFragment();
      child.textContent.split(/(\s+)/).forEach(tok => {
        if (!tok) return;
        if (/^\s+$/.test(tok)) { frag.appendChild(document.createTextNode(tok)); return; }
        const w = document.createElement("span"); w.className = "word";
        const i = document.createElement("span"); i.className = "word-i"; i.textContent = tok;
        w.appendChild(i); frag.appendChild(w); out.push(i);
      });
      child.replaceWith(frag);
    } else if (child.nodeType === Node.ELEMENT_NODE) {
      walk(child);
    }
  });
  if (el) walk(el);
  return out;
};

if (G && window.ScrollTrigger && !reduceMotion) {
  G.registerPlugin(ScrollTrigger);

  /* Hero entrance timeline (hero items are driven here, not via .reveal) */
  const heroWords = splitWords($(".hero h1"));
  G.timeline({ defaults: { ease: "expo.out" } })
    .from(".hero-bg",           { scale: 1.08, duration: 1.6, ease: "expo.out" }, 0)
    .from(".hero .eyebrow",     { autoAlpha: 0, y: 14, duration: 0.55 })
    .from(heroWords,            { autoAlpha: 0, yPercent: 80, duration: 0.95, stagger: 0.04, ease: "expo.out" }, "-=0.2")
    .from(".hero-form-wrap",    { autoAlpha: 0, y: 36, duration: 0.9 }, "-=0.6")
    .from(".hero-sub",          { autoAlpha: 0, y: 16, duration: 0.6 }, "-=0.65")
    .from(".hero-badges li",    { autoAlpha: 0, y: 12, stagger: 0.06, duration: 0.45 }, "-=0.45")
    .from(".hero-cta-row .btn", { autoAlpha: 0, y: 12, stagger: 0.09, duration: 0.45 }, "-=0.35")
    .from(".hero-trust",        { autoAlpha: 0, duration: 0.45 }, "-=0.3");

  /* Section headings · sequenced kicker → word-by-word title → paragraph */
  $$(".section-head").forEach(head => {
    const kicker = head.querySelector(".kicker");
    const h2 = head.querySelector("h2");
    const p = head.querySelector("p");
    const words = splitWords(h2);
    const tl = G.timeline({
      defaults: { ease: "expo.out" },
      scrollTrigger: { trigger: head, start: "top 82%", once: true }
    });
    if (kicker) tl.from(kicker, { autoAlpha: 0, y: 14, duration: 0.5 });
    if (words.length) tl.from(words, { autoAlpha: 0, yPercent: 70, duration: 0.7, stagger: 0.03 }, "-=0.15");
    else if (h2) tl.from(h2, { autoAlpha: 0, y: 20, duration: 0.6 }, "-=0.15");
    if (p) tl.from(p, { autoAlpha: 0, y: 14, duration: 0.5 }, "-=0.25");
  });

  /* Grouped, staggered reveals for everything else (cards, steps, FAQ…) */
  G.set(reveals, { autoAlpha: 0, y: 40 });
  ScrollTrigger.batch(reveals, {
    start: "top 85%",
    onEnter: batch => G.to(batch, {
      autoAlpha: 1, y: 0, duration: 0.85, ease: "expo.out",
      stagger: { each: 0.08, from: "start" }, overwrite: true
    })
  });

  /* Stat counters trigger on scroll */
  $$("[data-count]").forEach(el =>
    ScrollTrigger.create({ trigger: el, start: "top 85%", once: true, onEnter: () => animateCount(el) }));

  /* Scrubbed parallax backdrops */
  G.to(".hero-bg", { yPercent: 8, ease: "none",
    scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
  G.to(".stockyard-bg", { yPercent: 12, ease: "none",
    scrollTrigger: { trigger: ".stockyard", start: "top bottom", end: "bottom top", scrub: true } });

  /* Top scroll-progress bar */
  G.to("#scrollProgress", { scaleX: 1, ease: "none",
    scrollTrigger: { start: 0, end: "max", scrub: 0.3 } });

  ScrollTrigger.refresh();

  /* Safety net: if the hero intro ever stalls, never leave the headline
     or form hidden. Harmless once the timeline has finished normally. */
  setTimeout(() => {
    try {
      G.set([".hero .eyebrow", ".hero-form-wrap", ".hero-sub",
             ".hero-badges li", ".hero-cta-row .btn", ".hero-trust"],
            { clearProps: "opacity,visibility,transform" });
      if (heroWords.length) G.set(heroWords, { clearProps: "opacity,visibility,transform" });
    } catch (e) { /* no-op */ }
  }, 2400);

} else if (reduceMotion) {
  reveals.forEach(el => el.classList.add("in"));

} else if ("IntersectionObserver" in window) {
  // No GSAP (e.g. CDN blocked) → CSS transitions via IntersectionObserver.
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  reveals.forEach((el, i) => { el.style.transitionDelay = `${(i % 4) * 70}ms`; io.observe(el); });
  setTimeout(() => reveals.forEach(el => el.classList.add("in")), 2500);
  const statIO = new IntersectionObserver((es) => {
    es.forEach(e => { if (e.isIntersecting) { animateCount(e.target); statIO.unobserve(e.target); } });
  }, { threshold: 0.5 });
  $$("[data-count]").forEach(el => statIO.observe(el));

} else {
  reveals.forEach(el => el.classList.add("in"));
}

/* ---------------------------------------------------------
   8) Country marquee · seamless infinite loop (CSS-driven)
   --------------------------------------------------------- */
const mqTrack = $(".marquee-track");
if (mqTrack && !reduceMotion) {
  mqTrack.innerHTML += mqTrack.innerHTML;   // duplicate so the loop is seamless
  mqTrack.classList.add("marquee-run");
}

/* ---------------------------------------------------------
   9) Product CTA → prefill the form's stone dropdown
   --------------------------------------------------------- */
$$(".js-product-cta").forEach(a => {
  a.addEventListener("click", () => {
    const stone = a.dataset.product;
    const select = $("#product");
    if (select) [...select.options].forEach(o => { if (o.value === stone) select.value = stone; });
    const name = $("#name");
    if (name) setTimeout(() => name.focus({ preventScroll: true }), 600);
    track("AddToCart", { content_name: stone });   // signals product interest
  });
});

$$(".js-cta").forEach(a =>
  a.addEventListener("click", () => track("InitiateCheckout", { source: a.dataset.cta || "cta" }))
);

/* ---------------------------------------------------------
   10) Lead form: validate → build WhatsApp message → modal
   --------------------------------------------------------- */
const form = $(".lead-form");
const modal = $("#successModal");
const modalWa = $(".js-modal-wa");

const showField = (field, ok) => field.classList.toggle("invalid", !ok);

const validate = () => {
  let ok = true;
  const name = $("#name"), phone = $("#phone"), product = $("#product");
  [name, phone, product].forEach(el => {
    const valid = el.value.trim() !== "";
    showField(el.closest(".field"), valid);
    if (!valid) ok = false;
  });
  // light phone sanity check
  const digits = phone.value.replace(/\D/g, "");
  if (digits.length < 7) { showField(phone.closest(".field"), false); ok = false; }
  return ok;
};

const buildMessage = () => {
  const v = id => ($("#" + id)?.value || "").trim();
  return [
    "*New Quote Request · Al Asal Marbles*",
    `👤 Name: ${v("name")}`,
    `📞 Phone: ${v("phone")}`,
    v("email") && `✉️ Email: ${v("email")}`,
    `🪨 Stone: ${v("product")}`,
    v("project") && `🏗️ Project: ${v("project")}`,
    v("message") && `📝 Details: ${v("message")}`
  ].filter(Boolean).join("\n");
};

if (form) {
  // clear invalid state as the user types
  $$("input, select, textarea", form).forEach(el =>
    el.addEventListener("input", () => el.closest(".field")?.classList.remove("invalid"))
  );

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!validate()) {
      form.querySelector(".invalid input, .invalid select")?.focus();
      return;
    }

    const msg = buildMessage();

    // Optional: also POST to a form handler if configured
    if (CONFIG.formEndpoint) {
      try {
        await fetch(CONFIG.formEndpoint, {
          method: "POST",
          headers: { "Accept": "application/json" },
          body: new FormData(form)
        });
      } catch (_) { /* non-blocking */ }
    }

    track("Lead", { content_name: $("#product").value });

    // Prepare WhatsApp hand-off and show confirmation
    if (modalWa) {
      modalWa.href = waLink(msg);
      modalWa.target = "_blank";
      modalWa.rel = "noopener";
    }
    openModal();
    form.reset();
  });
}

/* ---------------------------------------------------------
   11) Modal controls
   --------------------------------------------------------- */
function openModal() { if (modal) { modal.hidden = false; document.body.style.overflow = "hidden"; } }
function closeModal() { if (modal) { modal.hidden = true; document.body.style.overflow = ""; } }
$(".modal-close")?.addEventListener("click", closeModal);
$(".modal-dismiss")?.addEventListener("click", closeModal);
modal?.addEventListener("click", e => { if (e.target === modal) closeModal(); });
document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });

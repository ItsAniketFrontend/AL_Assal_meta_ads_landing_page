/* =========================================================
   AL ASAL MARBLES — Landing Page JS
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
  // Leave empty ("") to skip — the form will still work via WhatsApp.
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
   6) OPTIONAL real photos — drop a URL into a card's
      data-img="" (in index.html) and it loads on top of the
      CSS stone texture. If it fails or is empty, the texture
      stays — nothing ever looks broken.
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
   7) Animations — GSAP + ScrollTrigger (graceful fallback)
   --------------------------------------------------------- */
const reveals = $$(".reveal");
const G = window.gsap;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (reduceMotion) {
  // Respect the user's setting — show everything, no motion.
  reveals.forEach(el => el.classList.add("in"));

} else if (G && window.ScrollTrigger) {
  G.registerPlugin(ScrollTrigger);

  // Hero entrance timeline (hero items are driven here, not via .reveal)
  G.timeline({ defaults: { ease: "power3.out" } })
    .from(".hero .eyebrow",     { autoAlpha: 0, y: 18, duration: 0.6 })
    .from(".hero h1",           { autoAlpha: 0, y: 30, duration: 0.9 }, "-=0.3")
    .from(".hero-form-wrap",    { autoAlpha: 0, y: 40, duration: 0.9 }, "-=0.6")
    .from(".hero-sub",          { autoAlpha: 0, y: 18, duration: 0.7 }, "-=0.6")
    .from(".hero-badges li",    { autoAlpha: 0, y: 14, stagger: 0.07, duration: 0.5 }, "-=0.4")
    .from(".hero-cta-row .btn", { autoAlpha: 0, y: 14, stagger: 0.10, duration: 0.5 }, "-=0.3")
    .from(".hero-trust",        { autoAlpha: 0, duration: 0.5 }, "-=0.3");

  // Scroll-triggered reveals for the rest of the page.
  // fromTo defines an explicit end state, so the CSS-hidden start never sticks.
  reveals.forEach(el => {
    G.fromTo(el,
      { autoAlpha: 0, y: 30 },
      {
        autoAlpha: 1, y: 0, duration: 0.8, ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 88%", once: true }
      });
  });

  // Subtle parallax on the hero backdrop (hero clips overflow, so no edge gaps).
  G.to(".hero-bg", {
    yPercent: 8, ease: "none",
    scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
  });

} else if ("IntersectionObserver" in window) {
  // No GSAP (e.g. CDN blocked) → CSS transitions via IntersectionObserver.
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  reveals.forEach((el, i) => {
    el.style.transitionDelay = `${(i % 4) * 70}ms`;
    io.observe(el);
  });
  setTimeout(() => reveals.forEach(el => el.classList.add("in")), 2500);

} else {
  reveals.forEach(el => el.classList.add("in"));
}

/* ---------------------------------------------------------
   8) Animated stat counters
   --------------------------------------------------------- */
const animateCount = el => {
  const target = +el.dataset.count;
  const suffix = el.dataset.suffix || "";
  const dur = 1400, t0 = performance.now();
  const tick = now => {
    const p = Math.min((now - t0) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    const val = Math.floor(eased * target);
    el.textContent = val.toLocaleString() + suffix;
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};
const statIO = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { animateCount(e.target); statIO.unobserve(e.target); }
  });
}, { threshold: 0.5 });
$$("[data-count]").forEach(el => statIO.observe(el));

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
    "*New Quote Request — Al Asal Marbles*",
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

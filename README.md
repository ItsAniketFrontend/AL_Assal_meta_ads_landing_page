# Al Asal Marbles — Meta Ads Landing Page

A modern, dark-luxury, **conversion-optimized** landing page for paid (Meta) traffic.
Single-page, fast-loading, fully responsive. Built with plain HTML + CSS + vanilla JS — no build step.

## Files
| File | Purpose |
|------|---------|
| `index.html` | Page markup & copy |
| `styles.css` | Dark-luxury theme, layout, responsive rules |
| `script.js`  | Form handling, WhatsApp prefill, GSAP animations, counters |
| `Images/logo.png` | Brand logo |

**Animation:** uses [GSAP](https://gsap.com) + ScrollTrigger via CDN (hero entrance timeline, scroll reveals, hero parallax). If the CDN is blocked, the page falls back to CSS/IntersectionObserver reveals and stays fully functional — content is never left hidden.

## ▶️ Preview locally
Just open `index.html` in a browser, or run a tiny server (recommended so images/fonts load cleanly):

```powershell
# from this folder
python -m http.server 5173
# then open http://localhost:5173
```

## ✅ Before you launch — edit these
All settings live at the top of **`script.js`** in the `CONFIG` object:

```js
const CONFIG = {
  phone:    "+97165345581",   // click-to-call number
  whatsapp: "97165345581",    // ⚠️ replace with a real WhatsApp MOBILE number (no +, no spaces)
  email:    "info@alasalmarbles.com",
  formEndpoint: ""            // optional: paste a Formspree/handler URL to also receive emails
};
```

1. **WhatsApp number** — the found number is a landline; swap in the team's WhatsApp-enabled mobile.
2. **Form endpoint (optional)** — to also receive leads by email, create a free [Formspree](https://formspree.io) form and paste its URL into `formEndpoint`. The form already works without it (it hands the lead off to WhatsApp).
3. **Meta Pixel** — in `index.html`, find the `META PIXEL` block in `<head>`, replace `YOUR_PIXEL_ID`, and uncomment it. The JS already fires standard events: `Lead` (form submit), `Contact` (WhatsApp), `InitiateCheckout` (CTA clicks), `AddToCart` (product interest).
4. **Testimonials** — the 3 reviews are clearly-labelled placeholders. Replace with verified client quotes.
5. **Product photos** — cards use premium **CSS-generated stone textures** (realistic SVG veining/mottling tinted per stone) so the page is self-contained and never shows a broken image. To use real photos, drop a URL into a card's `data-img=""` in `index.html` — it loads on top of the texture, and falls back to the texture if the URL fails. **Best results: use Al Asal's own catalogue slab photos.** (Earlier auto-stock hotlinks were removed because unverified IDs resolved to irrelevant images.)

## CRO features included
- Above-the-fold lead form (primary conversion) + sticky/floating WhatsApp & call
- Trust badges (25 yrs · 400+ varieties · 33,000 m² · 11 countries) and global-sourcing strip
- 7 focus products (Quartz, Travertine, Quartzite, Onyx, Limestone, Sandstone, Porcelain) with one-tap "Request Quote" that pre-fills the form
- "Why us", 4-step process, animated stats, testimonials, FAQ, final CTA band
- Mobile bottom action bar (Call · WhatsApp · Free Quote) and success modal with WhatsApp hand-off

## Notes
Company facts (founding year, stockyard size, sourcing countries, contact details, socials)
are drawn from public sources (alasalmarbles.com, Gulf News, Khaleej Times). Verify before launch.

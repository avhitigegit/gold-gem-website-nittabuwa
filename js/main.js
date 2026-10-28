/* =========================================================
   Mr.Sapphire — site behaviour (vanilla JS, no dependencies)
   ========================================================= */

/* ---------- Shop settings: edit these in one place ---------- */
const CONFIG = {
  shopName: "Mr.Sapphire",
  whatsappNumber: "94710800816",       // country code + number, digits only
  // Google Sheet ("Prices" tab, published as CSV). Leave empty to use the built-in prices below.
  // Optional: jewelry sheet (columns id, price, show) published as CSV. Empty = prices in PRODUCTS below.
  productsUrl: "",
  pricesUrl: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTUt-9bt-Iptq00eu_mzk28uVSTe0h33OMbrk43q8-Uq4O6tA01FaMS4h9enewo3l0UC8WE1Y_qhtc_/pub?gid=0&single=true&output=csv",
};

/* ---------- Gem catalogue (indicative LKR price per carat) ----------
   Built-in fallback — live prices are loaded from CONFIG.pricesUrl. */
const COLORS = [
  { id: "all",    label: "All" },
  { id: "blue",   label: "Blue",   hex: "#2a5bd7" },
  { id: "pink",   label: "Pink",   hex: "#e0609a" },
  { id: "yellow", label: "Yellow", hex: "#e8b923" },
  { id: "orange", label: "Orange", hex: "#f08a5d" },
  { id: "red",    label: "Red",    hex: "#c8203a" },
  { id: "green",  label: "Green",  hex: "#1f9e6e" },
  { id: "purple", label: "Purple", hex: "#8a4fd8" },
  { id: "white",  label: "White",  hex: "#e6ecf5" },
];

let GEMS = [
  // Signature five
  { id: "blue-sapphire",   name: "Blue Sapphire",   color: "blue",   hex: "#2a5bd7", ppc: 45000,  featured: true, note: "Royal & cornflower blue" },
  { id: "pink-sapphire",   name: "Pink Sapphire",   color: "pink",   hex: "#e0609a", ppc: 38000,  featured: true, note: "Blush to vivid pink" },
  { id: "yellow-sapphire", name: "Yellow Sapphire", color: "yellow", hex: "#e8b923", ppc: 17000,  featured: true, note: "Golden Pushparaga" },
  { id: "padparadscha",    name: "Padparadscha",    color: "orange", hex: "#f08a5d", ppc: 120000, featured: true, note: "Rare lotus pink-orange" },
  { id: "star-ruby",       name: "Star Ruby",       color: "red",    hex: "#c8203a", ppc: 35000,  featured: true, note: "Six-rayed star cabochon" },
  // More gems
  { id: "ruby",            name: "Ruby",            color: "red",    hex: "#b5122e", ppc: 70000,  note: "Faceted pinkish-red ruby" },
  { id: "spinel",          name: "Spinel",          color: "red",    hex: "#d6365f", ppc: 30000,  note: "Bright red, pink & lavender" },
  { id: "alexandrite",     name: "Alexandrite",     color: "green",  hex: "#2f8f6b", ppc: 150000, note: "Colour-change green to red" },
  { id: "cats-eye",        name: "Cat's Eye",       color: "yellow", hex: "#c9a83a", ppc: 60000,  note: "Chrysoberyl with a sharp eye" },
  { id: "teal-sapphire",   name: "Teal Sapphire",   color: "green",  hex: "#1e8c8c", ppc: 28000,  note: "Blue-green parti tones" },
  { id: "purple-sapphire", name: "Purple Sapphire", color: "purple", hex: "#7b45c9", ppc: 32000,  note: "Violet to plum" },
  { id: "white-sapphire",  name: "White Sapphire",  color: "white",  hex: "#e6ecf5", ppc: 18000,  note: "Colourless & brilliant" },
  { id: "garnet",          name: "Garnet",          color: "red",    hex: "#8e1b2c", ppc: 8000,   note: "Deep wine red" },
  { id: "aquamarine",      name: "Aquamarine",      color: "blue",   hex: "#6fc3df", ppc: 18000,  note: "Sea-blue beryl" },
  { id: "moonstone",       name: "Moonstone",       color: "white",  hex: "#cfd8ea", ppc: 5000,   note: "Blue-sheen adularia" },
  { id: "topaz",           name: "Topaz",           color: "blue",   hex: "#4aa3df", ppc: 6000,   note: "Sky & Swiss blue" },
  { id: "tourmaline",      name: "Tourmaline",      color: "pink",   hex: "#d4588c", ppc: 20000,  note: "Pink & green tones" },
  { id: "amethyst",        name: "Amethyst",        color: "purple", hex: "#9b5fd0", ppc: 4000,   note: "Classic purple quartz" },
  { id: "zircon",          name: "Zircon",          color: "orange", hex: "#d98a3a", ppc: 12000,  note: "Fiery golden-brown" },
];

/* ---------- Jewelry products (price in LKR, 0 = price on request) ---------- */
let PRODUCTS = [
  { id: "garnet-ladies-ring",  name: "Garnet Ladies Ring",  detail: "Natural garnet with sparkling accent stones",        price: 25000, tag: "Garnet",        hex: "#8e1b2c" },
  { id: "garnet-mens-ring",    name: "Garnet Men's Ring",   detail: "Cushion-cut garnet in a bold signet setting",        price: 35000, tag: "Garnet",        hex: "#8e1b2c" },
  { id: "blue-sapphire-ring",  name: "Blue Sapphire Ring",  detail: "Stone weight 1.02 ct · pear cut with double halo",   price: 50000, tag: "Blue Sapphire", hex: "#2a5bd7" },
  { id: "natural-ruby-ring",   name: "Natural Ruby Ring",   detail: "A row of round natural rubies, half-eternity style", price: 40000, tag: "Ruby",          hex: "#c8203a" },
  { id: "pink-sapphire-ring",  name: "Pink Sapphire Ring",  detail: "Natural corundum pink sapphire, cushion cut",        price: 0,     tag: "Pink Sapphire", hex: "#e0609a" },
  { id: "certified-ruby-ring", name: "Certified Ruby Ring", detail: "AGCL certified · 0.66 ct pigeon blood red · heated", price: 0,     tag: "Ruby",          hex: "#c8203a" },
];

/* ---------- Helpers ---------- */
const $  = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const lkr = (n) => "LKR " + Math.round(n).toLocaleString("en-US");
const byId = (list, id) => list.find((x) => x.id === id);
const waLink = (msg) => `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(msg)}`;
const openWhatsApp = (msg) => window.open(waLink(msg), "_blank", "noopener");
const escapeHTML = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

function toast(text) {
  const el = $("#toast");
  el.textContent = text;
  el.classList.add("show");
  clearTimeout(toast.t);
  toast.t = setTimeout(() => el.classList.remove("show"), 2600);
}

function inPriceRange(gem, range) {
  if (range === "all") return true;
  const [min, max] = range.split("-").map(Number);
  return gem.ppc >= min && gem.ppc < max;
}

function buildColorChips(container, onChange) {
  container.innerHTML = COLORS.map((c) => `
    <button type="button" class="chip${c.id === "all" ? " active" : ""}" data-color="${c.id}"
            ${c.hex ? `style="--chip:${c.hex}"` : ""} aria-pressed="${c.id === "all"}">
      <i></i>${c.label}
    </button>`).join("");
  container.addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    $$(".chip", container).forEach((c) => {
      c.classList.toggle("active", c === chip);
      c.setAttribute("aria-pressed", c === chip);
    });
    onChange(chip.dataset.color);
  });
}

/* ---------- WhatsApp links everywhere ---------- */
function initWhatsAppLinks() {
  $$(".js-wa").forEach((a) => {
    a.href = waLink(a.dataset.msg || `Hello ${CONFIG.shopName}, I have an inquiry.`);
    a.target = "_blank";
    a.rel = "noopener";
  });
}

/* ---------- Live prices from Google Sheets ---------- */
function parseCSV(text) {
  const rows = [];
  let row = [], field = "", quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field); rows.push(row); row = []; field = "";
    } else field += c;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  return rows;
}

function sheetToGems(text) {
  const [head, ...rows] = parseCSV(text);
  const col = Object.fromEntries(head.map((h, i) => [h.trim().toLowerCase(), i]));
  const get = (r, key) => (r[col[key]] ?? "").trim();
  const yes = (v) => v.toLowerCase() === "yes";
  const builtIn = Object.fromEntries(GEMS.map((g) => [g.id, g]));

  return rows.map((r) => {
    const id = get(r, "id").toLowerCase();
    const ppc = Number(get(r, "price_per_ct").replace(/[^\d.]/g, ""));
    const color = get(r, "color").toLowerCase();
    if (!id || !(ppc > 0)) return null;               // skip blank or broken rows
    const known = COLORS.find((c) => c.id === color && c.hex);
    const base = builtIn[id] || {};
    return {
      id,
      name: get(r, "name") || base.name || id,
      color: known ? color : base.color || "white",
      hex: base.hex || (known ? known.hex : "#e6ecf5"),
      ppc,
      note: get(r, "note") || base.note || "",
      featured: yes(get(r, "featured")),
      show: get(r, "show") === "" || yes(get(r, "show")),
    };
  }).filter(Boolean);
}

async function loadPrices() {
  if (!CONFIG.pricesUrl) return;
  try {
    const res = await fetch(CONFIG.pricesUrl, { cache: "no-store" });
    if (!res.ok) throw new Error(res.status);
    const gems = sheetToGems(await res.text());
    if (!gems.length) throw new Error("no rows");
    GEMS = gems.filter((g) => g.show);

    // Featured cards: update price, hide when switched off in the sheet
    $$(".gem-card[data-gem]").forEach((card) => {
      const gem = gems.find((g) => g.id === card.dataset.gem);
      if (!gem) return;
      card.hidden = !gem.show;
      const price = $(".gem-price strong", card);
      if (price) price.textContent = lkr(gem.ppc);
    });
    renderMoreGems();
  } catch (err) {
    console.warn("Live prices unavailable, showing built-in prices.", err);
  }
}

/* ---------- Jewelry collection ---------- */
function renderProducts() {
  $("#product-grid").innerHTML = PRODUCTS.filter((p) => p.show !== false).map((p) => {
    const price = p.price > 0 ? lkr(p.price) : "Price on request";
    const msg = `Hello ${CONFIG.shopName}, I'm interested in the ${p.name}${p.price > 0 ? ` (${lkr(p.price)})` : ""}. Is it available?`;
    return `
      <article class="gem-card product-card">
        <div class="gem-media">
          <img loading="lazy" src="images/products/${p.id}.webp" alt="${escapeHTML(p.name)}" width="800" height="800">
          <span class="gem-tag" style="--chip:${p.hex}">${escapeHTML(p.tag)}</span>
        </div>
        <div class="gem-body">
          <h3>${escapeHTML(p.name)}</h3>
          <p class="gem-sub">${escapeHTML(p.detail)}</p>
          <p class="gem-price"><strong>${price}</strong></p>
          <div class="gem-actions">
            <a href="${waLink(msg)}" class="btn btn-gold btn-sm" target="_blank" rel="noopener">Order on WhatsApp</a>
          </div>
        </div>
      </article>`;
  }).join("");
}

// Optional live prices for jewelry (sheet columns: id, price, show)
async function loadProducts() {
  if (!CONFIG.productsUrl) return;
  try {
    const res = await fetch(CONFIG.productsUrl, { cache: "no-store" });
    if (!res.ok) throw new Error(res.status);
    const [head, ...rows] = parseCSV(await res.text());
    const col = Object.fromEntries(head.map((h, i) => [h.trim().toLowerCase(), i]));
    rows.forEach((r) => {
      const p = PRODUCTS.find((x) => x.id === (r[col.id] || "").trim().toLowerCase());
      if (!p) return;
      const price = Number((r[col.price] || "").replace(/[^\d.]/g, ""));
      if (!Number.isNaN(price)) p.price = price;
      p.show = (r[col.show] || "yes").trim().toLowerCase() !== "no";
    });
    renderProducts();
  } catch (err) {
    console.warn("Live jewelry prices unavailable, showing built-in prices.", err);
  }
}

/* ---------- More gems filter ---------- */
let renderMoreGems = () => {};

function initMoreGems() {
  const list = $("#more-gem-list");
  const priceSel = $("#more-price-filter");
  let color = "all";

  const render = () => {
    const items = GEMS.filter((g) => !g.featured)
      .filter((g) => color === "all" || g.color === color)
      .filter((g) => inPriceRange(g, priceSel.value));

    list.innerHTML = items.length
      ? items.map((g, i) => `
        <li class="mini-gem" style="--chip:${g.hex}; animation-delay:${i * 50}ms">
          <header><span class="swatch"></span><h4>${escapeHTML(g.name)}</h4></header>
          <p>${escapeHTML(g.note)}</p>
          <p class="price">From ${lkr(g.ppc)} / ct</p>
          <a href="${waLink(`Hello ${CONFIG.shopName}, I'd like to inquire about ${g.name}. Please share available stones, sizes and prices.`)}" target="_blank" rel="noopener">Inquire on WhatsApp →</a>
        </li>`).join("")
      : `<li class="empty-note">No gems in this range right now — request one below and we'll source it for you.</li>`;
  };

  buildColorChips($("#more-color-filter"), (c) => { color = c; render(); });
  priceSel.addEventListener("change", render);
  renderMoreGems = render;
  render();

  $("#request-gem-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const val = $("#request-gem-input").value.trim();
    if (!val) return;
    openWhatsApp(`Hello ${CONFIG.shopName}, I'm looking for a specific gem:\n${val}\nCan you help source it?`);
  });
}

/* ---------- Trade inquiry ---------- */
function initTrade() {
  $("#trade-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const v = (id) => $(id).value.trim();
    if (!v("#t-business") || !v("#t-gems")) {
      toast("Please add your business name and gems required");
      return;
    }
    const msg = [
      `Hello ${CONFIG.shopName}, trade / wholesale inquiry:`,
      `• Business: ${v("#t-business")} (${v("#t-type")})`,
      `• Gems required: ${v("#t-gems")}`,
      v("#t-qty") ? `• Quantity: ${v("#t-qty")}` : "",
      v("#t-notes") ? `• Requirements: ${v("#t-notes")}` : "",
    ].filter(Boolean).join("\n");
    openWhatsApp(msg);
  });
}

/* ---------- Contact form ---------- */
function initContact() {
  $("#contact-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const v = (id) => $(id).value.trim();
    if (!v("#c-name") || !v("#c-message")) {
      toast("Please add your name and a message");
      return;
    }
    const msg = [
      `Hello ${CONFIG.shopName}, new inquiry from the website:`,
      `• Name: ${v("#c-name")}`,
      v("#c-phone") ? `• Phone: ${v("#c-phone")}` : "",
      v("#c-email") ? `• Email: ${v("#c-email")}` : "",
      `• Interested in: ${v("#c-topic")}`,
      `• Message: ${v("#c-message")}`,
    ].filter(Boolean).join("\n");
    openWhatsApp(msg);
  });
}

/* ---------- Navigation ---------- */
function initNav() {
  const header = $(".site-header");
  const toggle = $(".nav-toggle");
  const menu = $("#nav-menu");

  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 30);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const setOpen = (open) => {
    menu.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", open);
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };
  toggle.addEventListener("click", () => setOpen(!menu.classList.contains("open")));
  menu.addEventListener("click", (e) => { if (e.target.closest("a")) setOpen(false); });

  // highlight the section currently in view
  const links = $$(".nav-link");
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((l) => l.classList.toggle("active", l.getAttribute("href") === `#${entry.target.id}`));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  links.forEach((l) => { const s = $(l.getAttribute("href")); if (s) spy.observe(s); });
}

/* ---------- Animations ---------- */
function initReveal() {
  // stagger siblings that reveal together
  $$(".reveal").forEach((el) => {
    const siblings = [...el.parentElement.children].filter((c) => c.classList.contains("reveal"));
    const i = siblings.indexOf(el);
    if (siblings.length > 1) el.style.setProperty("--delay", `${Math.min(i, 6) * 0.1}s`);
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("in");
      io.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  $$(".reveal").forEach((el) => io.observe(el));
}

function initCounters() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const end = +el.dataset.count;
      const start = performance.now();
      const dur = 1800;
      const tick = (now) => {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(end * eased).toLocaleString("en-US") + (p === 1 ? "+" : "");
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      io.unobserve(el);
    });
  }, { threshold: 0.6 });
  $$("[data-count]").forEach((el) => io.observe(el));
}

/* ---------- Boot ---------- */
document.documentElement.classList.remove("no-js");
document.addEventListener("DOMContentLoaded", () => {
  $("#year").textContent = new Date().getFullYear();
  initWhatsAppLinks();
  initNav();
  initMoreGems();
  loadPrices();
  renderProducts();
  loadProducts();
  initTrade();
  initContact();
  initReveal();
  initCounters();
});

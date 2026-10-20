// meetka.eu: light / dark (follows the system until chosen) and the cs / en switch.
// Loaded in <head> without defer, so a chosen theme applies before the first paint.
// Pages with texts set window.MEETKA_TEXTS (texts.js, 404.html); elements carry data-i18n="key".
(function () {
  var root = document.documentElement;
  try {
    var saved = localStorage.getItem("meetka-theme");
    if (saved === "light" || saved === "dark") root.setAttribute("data-theme", saved);
  } catch (e) { /* storage blocked: follow the system */ }

  function effectiveTheme() {
    var t = root.getAttribute("data-theme");
    if (t) return t;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function syncTheme() {
    var dark = effectiveTheme() === "dark";
    document.querySelectorAll("[data-theme-toggle]").forEach(function (b) {
      b.setAttribute("aria-pressed", String(dark));
    });
  }

  window.meetkaTheme = function () {
    var next = effectiveTheme() === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("meetka-theme", next); } catch (e) { /* not remembered */ }
    syncTheme();
  };

  function pickLang() {
    try {
      var saved = localStorage.getItem("lang");
      if (saved === "cs" || saved === "en") return saved;
    } catch (e) { /* private mode */ }
    var nav = (navigator.language || "en").toLowerCase();
    return nav.indexOf("cs") === 0 || nav.indexOf("sk") === 0 ? "cs" : "en";
  }

  function applyLang(lang) {
    var texts = window.MEETKA_TEXTS && window.MEETKA_TEXTS[lang];
    if (!texts) return;
    root.lang = lang;
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var value = texts[el.getAttribute("data-i18n")];
      if (value !== undefined) el.innerHTML = value;
    });
    document.querySelectorAll("[data-i18n-label]").forEach(function (el) {
      var value = texts[el.getAttribute("data-i18n-label")];
      if (value !== undefined) el.setAttribute("aria-label", value);
    });
    document.querySelectorAll("[data-lang]").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-lang") === lang));
    });
    if (texts.title) document.title = texts.title;
    // Pages with their own texts (the invitation) listen for the switch.
    document.dispatchEvent(new CustomEvent("meetka:lang", { detail: lang }));
  }

  window.meetkaLang = function (lang) {
    try { localStorage.setItem("lang", lang); } catch (e) { /* ignore */ }
    applyLang(lang);
  };

  document.addEventListener("DOMContentLoaded", function () {
    applyLang(pickLang());
    syncTheme();
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", syncTheme);
  });
})();

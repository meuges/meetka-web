// Tiny cs/en switch: elements carry data-i18n="key"; the choice is remembered when storage works.
(function () {
  function pick() {
    try {
      var saved = localStorage.getItem("lang");
      if (saved === "cs" || saved === "en") return saved;
    } catch (e) { /* private mode */ }
    var nav = (navigator.language || "en").toLowerCase();
    return nav.indexOf("cs") === 0 || nav.indexOf("sk") === 0 ? "cs" : "en";
  }

  function apply(lang) {
    var texts = window.MEETKA_TEXTS[lang];
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var value = texts[el.getAttribute("data-i18n")];
      if (value !== undefined) el.innerHTML = value;
    });
    document.querySelectorAll(".lang button").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-lang") === lang));
    });
    if (texts.title) document.title = texts.title;
  }

  window.meetkaLang = function (lang) {
    try { localStorage.setItem("lang", lang); } catch (e) { /* ignore */ }
    apply(lang);
  };

  document.addEventListener("DOMContentLoaded", function () { apply(pick()); });
})();

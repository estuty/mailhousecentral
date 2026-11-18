(function () {
  "use strict";

  // Mobile menu
  var toggle = document.querySelector(".menu-toggle");
  var nav = document.getElementById("nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.textContent = open ? "Close" : "Menu";
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a") && nav.classList.contains("is-open")) toggle.click();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) { toggle.click(); toggle.focus(); }
    });
  }

  // Hero: the new site registers and reports in, once, when the rack is first seen.
  var slot = document.querySelector("[data-new]");
  if (slot) {
    var state = slot.querySelector(".st");
    var connect = function (animate) {
      slot.classList.add("is-connected");
      if (animate) slot.classList.add("thunk");
      state.className = "st st-good";
      state.textContent = "Connected";
    };
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) {
      connect(false);
    } else {
      var io = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) {
          io.disconnect();
          setTimeout(function () { connect(true); }, 1400);
        }
      }, { threshold: 0.6 });
      io.observe(slot);
    }
  }
})();

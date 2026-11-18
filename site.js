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

  // Hero postmark: today's date, and a re-stamp through the transports
  var mark = document.querySelector(".env-postmark");
  if (mark) {
    var dateEl = mark.querySelector(".pm-date");
    var nameEl = mark.querySelector(".pm-transport");
    var months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    var d = new Date();
    if (dateEl) dateEl.textContent = d.getDate() + " " + months[d.getMonth()] + " " + d.getFullYear();

    var transports = [
      "SendGrid", "Mailgun", "Brevo", "Postmark", "Resend", "Amazon SES", "Mailjet", "SparkPost",
      "SMTP2GO", "Elastic Email", "MailerSend", "ZeptoMail", "Mailchimp", "SMTP", "PHP mail"
    ];
    var fit = function (name) {
      nameEl.textContent = name;
      var size = name.length > 10 ? 9.5 : name.length > 7 ? 11.5 : 13;
      nameEl.setAttribute("font-size", size);
    };
    fit(transports[0]);

    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!reduce.matches && nameEl) {
      var i = 0;
      var timer = null;
      var step = function () {
        i = (i + 1) % transports.length;
        mark.classList.remove("thunk");
        void mark.getBoundingClientRect();
        fit(transports[i]);
        mark.classList.add("thunk");
      };
      var start = function () { if (!timer) timer = setInterval(step, 2600); };
      var stop = function () { clearInterval(timer); timer = null; };
      // Only stamp while the envelope is on screen and the tab is visible
      var inView = true;
      if ("IntersectionObserver" in window) {
        new IntersectionObserver(function (entries) {
          inView = entries[0].isIntersecting;
          inView && !document.hidden ? start() : stop();
        }).observe(mark);
      } else {
        start();
      }
      document.addEventListener("visibilitychange", function () {
        document.hidden || !inView ? stop() : start();
      });
      reduce.addEventListener && reduce.addEventListener("change", function (e) { if (e.matches) stop(); });
    }
  }

  // Docs: contents start collapsed on small screens, always open on wide ones
  var tocBox = document.querySelector(".toc-box");
  if (tocBox) {
    var wide = window.matchMedia("(min-width: 961px)");
    var sync = function () { tocBox.open = wide.matches; };
    sync();
    wide.addEventListener && wide.addEventListener("change", sync);
    tocBox.addEventListener("click", function (e) {
      if (!wide.matches && e.target.closest("a")) tocBox.open = false;
    });
  }

  // Docs: highlight the section in view
  var tocLinks = document.querySelectorAll(".docs-toc a[href^='#']");
  if (tocLinks.length && "IntersectionObserver" in window) {
    var byId = {};
    tocLinks.forEach(function (a) { byId[decodeURIComponent(a.getAttribute("href").slice(1))] = a; });
    var current = null;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting && byId[en.target.id]) {
          if (current) current.classList.remove("is-active");
          current = byId[en.target.id];
          current.classList.add("is-active");
        }
      });
    }, { rootMargin: "-80px 0px -70% 0px" });
    Object.keys(byId).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) io.observe(el);
    });
  }
})();

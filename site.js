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

  // Contact form: sent with fetch when JavaScript is on, as a normal form post when it isn't
  var form = document.querySelector(".contact-form");
  if (form) {
    var started = form.querySelector('[name="started"]');
    if (started) started.value = String(Date.now());
    var status = form.querySelector(".form-status");
    var button = form.querySelector('button[type="submit"]');
    var messages = {
      name: "Add your name.",
      email: "Check your email address. We need it to reply.",
      message: "Write a little more in your message (at least 10 characters)."
    };
    var clearError = function (input) {
      input.removeAttribute("aria-invalid");
      var err = document.getElementById(input.id + "-error");
      if (err) err.remove();
      input.removeAttribute("aria-describedby");
    };
    var showError = function (input, text) {
      clearError(input);
      input.setAttribute("aria-invalid", "true");
      var p = document.createElement("p");
      p.className = "field-error";
      p.id = input.id + "-error";
      p.textContent = text;
      input.insertAdjacentElement("afterend", p);
      input.setAttribute("aria-describedby", p.id);
    };
    form.addEventListener("input", function (e) {
      if (e.target.getAttribute("aria-invalid") === "true" && e.target.checkValidity()) clearError(e.target);
    });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      status.textContent = "";
      status.classList.remove("is-bad");
      var firstBad = null;
      ["name", "email", "message"].forEach(function (n) {
        var input = form.elements[n];
        input.value = input.value.trim() === "" ? "" : input.value;
        if (!input.checkValidity()) {
          showError(input, messages[n]);
          if (!firstBad) firstBad = input;
        } else {
          clearError(input);
        }
      });
      if (firstBad) { firstBad.focus(); return; }

      button.disabled = true;
      button.textContent = "Sending…";
      fetch(form.action, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } })
        .then(function (r) {
          return r.json().catch(function () { return { ok: false }; }).then(function (data) {
            if (!r.ok || !data.ok) {
              var e = new Error(data.error || "");
              e.fromServer = true;
              throw e;
            }
          });
        })
        .then(function () {
          var done = document.createElement("div");
          done.className = "form-done";
          done.setAttribute("tabindex", "-1");
          var h = document.createElement("h3");
          h.textContent = "Message sent";
          var p = document.createElement("p");
          p.textContent = "Thanks. We’ll reply to " + form.elements.email.value.trim() + ".";
          done.appendChild(h);
          done.appendChild(p);
          form.replaceWith(done);
          done.focus();
        })
        .catch(function (err) {
          status.textContent = (err && err.fromServer && err.message) || "Your message wasn’t sent. Check your connection and send it again.";
          status.classList.add("is-bad");
          button.disabled = false;
          button.textContent = "Send message";
        });
    });
  }

  // The plugin's latest release, read from GitHub so the page never names an old version.
  // The page already carries the version it was written with, so a failed or slow request
  // changes nothing; a successful one replaces the version, the date and the download link.
  if (document.querySelector("[data-plugin-version], [data-plugin-zip]") && window.fetch) {
    fetch("https://api.github.com/repos/estuty/mailhouse/releases/latest", { headers: { Accept: "application/vnd.github+json" } })
      .then(function (r) { if (!r.ok) throw new Error(String(r.status)); return r.json(); })
      .then(function (rel) {
        var version = String(rel.tag_name || "").replace(/^v/, "");
        if (!/^\d+\.\d+\.\d+$/.test(version)) return;
        var zip = (rel.assets || []).filter(function (a) { return a.name === "mailhouse-" + version + ".zip"; })[0];
        document.querySelectorAll("[data-plugin-version]").forEach(function (el) { el.textContent = version; });
        if (zip && /^https:\/\/github\.com\//.test(zip.browser_download_url)) {
          document.querySelectorAll("[data-plugin-zip]").forEach(function (a) { a.href = zip.browser_download_url; });
        }
        if (rel.html_url && /^https:\/\/github\.com\//.test(rel.html_url)) {
          document.querySelectorAll("[data-plugin-notes]").forEach(function (a) { a.href = rel.html_url; });
        }
        var when = new Date(rel.published_at);
        if (!isNaN(when)) {
          var text = when.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
          document.querySelectorAll("[data-plugin-date]").forEach(function (el) { el.textContent = text; });
        }
      })
      .catch(function () {});
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

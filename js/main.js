(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Header & Progress Bar ---------- */
  var header = document.getElementById("siteHeader");
  var progressBar = document.getElementById("progressBar");

  function onScroll() {
    var scrollTop = window.scrollY || document.documentElement.scrollTop;
    if (header) header.classList.toggle("is-scrolled", scrollTop > 8);

    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (progressBar) progressBar.style.width = pct + "%";
  }
  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile navigation ---------- */
  var navToggle = document.getElementById("navToggle");
  var mobileNav = document.getElementById("mobileNav");

  function closeMobileNav() {
    if (!navToggle || !mobileNav) return;
    navToggle.setAttribute("aria-expanded", "false");
    mobileNav.classList.remove("is-open");
    document.body.style.overflow = "";
  }

  if (navToggle && mobileNav) {
    navToggle.addEventListener("click", function () {
      var isOpen = mobileNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
      document.body.style.overflow = isOpen ? "hidden" : "";
    });

    mobileNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMobileNav);
    });
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMobileNav();
  });

  /* ---------- Animation on scroll ---------- */
  var revealEls = document.querySelectorAll(".reveal, .reveal-stagger");

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
    document.querySelectorAll(".count").forEach(function (el) {
      el.textContent = el.dataset.target;
    });
  } else {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });

    /* ---------- Counter Animation ---------- */
    var countEls = document.querySelectorAll(".count");
    var countIo = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          countIo.unobserve(entry.target);
          var el = entry.target;
          var target = parseInt(el.dataset.target, 10);
          var duration = 1200;
          var start = null;

          function step(ts) {
            if (start === null) start = ts;
            var progress = Math.min((ts - start) / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(eased * target);
            if (progress < 1) requestAnimationFrame(step);
          }
          requestAnimationFrame(step);
        });
      },
      { threshold: 0.2 }
    );
    countEls.forEach(function (el) { countIo.observe(el); });
  }

  /* ---------- Trigger Hero Activation ---------- */
  var heroCopy = document.getElementById("heroCopy");
  if (heroCopy) {
    requestAnimationFrame(function () {
      heroCopy.classList.add("in-view");
    });
  }

  /* ---------- Product Preview Active State ---------- */
  var previewStage = document.getElementById("previewStage");
  if (previewStage) {
    if (reduceMotion || !("IntersectionObserver" in window)) {
      previewStage.classList.add("in-view");
    } else {
      var previewIo = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              previewStage.classList.add("in-view");
              previewIo.unobserve(previewStage);
            }
          });
        },
        { threshold: 0.15 }
      );
      previewIo.observe(previewStage);
    }

    /* Subtle 3D Mouse Tilt */
    var dashMock = previewStage.querySelector(".dash-mock");
    var canTilt = !reduceMotion && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (dashMock && canTilt) {
      var MAX_TILT = 4;

      dashMock.addEventListener("mousemove", function (e) {
        var rect = dashMock.getBoundingClientRect();
        var px = (e.clientX - rect.left) / rect.width - 0.5;
        var py = (e.clientY - rect.top) / rect.height - 0.5;
        dashMock.style.transition = "transform 0.08s linear";
        dashMock.style.transform =
          "perspective(1000px) rotateX(" + (-py * MAX_TILT).toFixed(2) + "deg) " +
          "rotateY(" + (px * MAX_TILT).toFixed(2) + "deg) scale(1.005)";
      });

      dashMock.addEventListener("mouseleave", function () {
        dashMock.style.transition = "transform 0.5s cubic-bezier(0.16,1,0.3,1)";
        dashMock.style.transform = "";
      });
    }
  }

  /* ---------- Accordion Panels Logic ---------- */
  var expandPanels = document.getElementById("expandPanels");
  if (expandPanels) {
    var panels = Array.prototype.slice.call(expandPanels.querySelectorAll(".expand-panel"));
    var activatePanel = function (target) {
      panels.forEach(function (p) {
        var isTarget = p === target;
        p.setAttribute("aria-expanded", String(isTarget));
        p.style.width = isTarget ? "46%" : "18%";
      });
    };
    panels.forEach(function (panel) {
      panel.addEventListener("mouseenter", function () { activatePanel(panel); });
      panel.addEventListener("focus", function () { activatePanel(panel); });
    });
  }

  /* ---------- Contact Form Handling ---------- */
  var form = document.getElementById("gocrmForm");
  var status = document.getElementById("formStatus");

  if (form && status) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      status.textContent = "";
      status.removeAttribute("data-state");

      var name = document.getElementById("frmName").value.trim();
      var email = document.getElementById("frmEmail").value.trim();
      var company = document.getElementById("frmCompany").value.trim();

      if (!name || !email || !company) {
        status.textContent = "Veuillez remplir tous les champs obligatoires.";
        status.setAttribute("data-state", "error");
        return;
      }

      var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        status.textContent = "Veuillez entrer une adresse email valide.";
        status.setAttribute("data-state", "error");
        return;
      }

      status.textContent = "Envoi en cours…";
      status.setAttribute("data-state", "info");

      setTimeout(function () {
        status.textContent = "Merci ! Votre demande a été transmise. Un expert vous contactera sous 24h.";
        status.setAttribute("data-state", "success");
        form.reset();
      }, 1000);
    });
  }
})();
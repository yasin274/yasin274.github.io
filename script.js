/* ============================================================
   PORTFOLIO — interactions
   Vanilla JS, no dependencies
   ============================================================ */
"use strict";

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Reveal on scroll ---------- */
const revealItems = document.querySelectorAll(".reveal");

function revealAll() {
  revealItems.forEach((el) => el.classList.add("is-visible"));
}

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  revealItems.forEach((el, i) => {
    // Stagger items that appear together
    el.style.transitionDelay = `${Math.min(i % 6, 5) * 70}ms`;
    observer.observe(el);
  });

  // Safety net: content must never stay invisible, even if the page was
  // loaded in a background tab where observer callbacks are deferred.
  setTimeout(revealAll, 2500);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) setTimeout(revealAll, 800);
  });
} else {
  revealAll();
}

/* ---------- Sticky nav border + reading progress ---------- */
const nav = document.getElementById("nav");
const progress = document.getElementById("progress");

const onScroll = () => {
  nav.classList.toggle("is-stuck", window.scrollY > 8);

  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = scrollable > 0 ? Math.min(window.scrollY / scrollable, 1) : 0;
  progress.style.transform = `scaleX(${ratio})`;
};

window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("resize", onScroll, { passive: true });
onScroll();

/* ---------- Counting up the stat numbers ----------
   The target is read from the markup, so the numbers stay correct with JS
   disabled and there is nothing to keep in sync in two places. */
const formatNumber = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ");

function countUp(el) {
  const original = el.textContent.trim();
  const target = Number(original.replace(/\D/g, ""));

  // Nothing to animate for a plain zero or unparseable content.
  if (!Number.isFinite(target) || target === 0) return;

  const duration = 1100;
  const start = performance.now();

  const tick = (now) => {
    const t = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = formatNumber(Math.round(target * eased));
    if (t < 1) requestAnimationFrame(tick);
    else el.textContent = original;
  };

  el.textContent = "0";
  requestAnimationFrame(tick);
}

const statValues = document.querySelectorAll(".stat dd");

if (!reduceMotion && "IntersectionObserver" in window) {
  const statObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        statObserver.unobserve(entry.target);
        countUp(entry.target);
      });
    },
    { threshold: 0.6 }
  );

  statValues.forEach((el) => statObserver.observe(el));
}

/* ---------- Case filters ---------- */
const filters = document.querySelectorAll(".filter");
const cases = document.querySelectorAll(".cases .case");
const LEAVE_MS = 220;

function applyFilter(filter) {
  cases.forEach((item) => {
    const show = filter === "all" || item.dataset.category.split(" ").includes(filter);
    const hidden = item.classList.contains("is-hidden");

    // A card can be mid-transition from a previous click.
    clearTimeout(item._filterTimer);

    if (show === !hidden) return;

    if (show) {
      item.classList.remove("is-hidden", "is-leaving");
      if (!reduceMotion) {
        item.classList.add("is-entering");
        item._filterTimer = setTimeout(() => item.classList.remove("is-entering"), 400);
      }
      return;
    }

    if (reduceMotion) {
      item.classList.add("is-hidden");
      return;
    }

    item.classList.add("is-leaving");
    item._filterTimer = setTimeout(() => {
      item.classList.add("is-hidden");
      item.classList.remove("is-leaving");
    }, LEAVE_MS);
  });
}

filters.forEach((btn) => {
  btn.addEventListener("click", () => {
    filters.forEach((b) => {
      const active = b === btn;
      b.classList.toggle("is-active", active);
      b.setAttribute("aria-pressed", String(active));
    });

    applyFilter(btn.dataset.filter);
  });
});

/* ---------- Footer year ---------- */
document.getElementById("year").textContent = new Date().getFullYear();

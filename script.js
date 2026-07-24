/* ============================================================
   PORTFOLIO — interactions
   Vanilla JS, no dependencies
   ============================================================ */
"use strict";

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

/* ---------- Sticky nav border ---------- */
const nav = document.getElementById("nav");

const onScroll = () => {
  nav.classList.toggle("is-stuck", window.scrollY > 8);
};

window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* ---------- Project filters ---------- */
const filters = document.querySelectorAll(".filter");
const cards = document.querySelectorAll(".projects .card");

filters.forEach((btn) => {
  btn.addEventListener("click", () => {
    filters.forEach((b) => b.classList.toggle("is-active", b === btn));

    const filter = btn.dataset.filter;
    cards.forEach((card) => {
      const categories = card.dataset.category.split(" ");
      const show = filter === "all" || categories.includes(filter);
      card.classList.toggle("is-hidden", !show);
    });
  });
});

/* ---------- Footer year ---------- */
document.getElementById("year").textContent = new Date().getFullYear();

// ─── Elements ──────────────────────────────────────────────────
const navLinks = Array.from(document.querySelectorAll(".nav-link"));
const sections = navLinks
  .map((a) => document.querySelector(a.getAttribute("href")))
  .filter(Boolean);
const navbar = document.querySelector(".navbar");
const hamburger = document.getElementById("hamburger");
const overlay = document.getElementById("navOverlay");

// ─── Hamburger toggle ──────────────────────────────────────────
function toggleMenu(forceClose) {
  const shouldClose = forceClose === true || navbar.classList.contains("open");

  navbar.classList.toggle("open", !shouldClose);
  overlay.classList.toggle("show", !shouldClose);
  hamburger.setAttribute("aria-expanded", String(!shouldClose));
  document.body.style.overflow = shouldClose ? "" : "hidden";
}

hamburger.addEventListener("click", () => toggleMenu());
overlay.addEventListener("click", () => toggleMenu(true));

// ─── Smooth scroll on click ───────────────────────────────────
navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;

    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });

    // Close mobile menu if open
    if (navbar.classList.contains("open")) toggleMenu(true);
  });
});

// ─── Active link while scrolling ──────────────────────────────
const setActive = (id) => {
  navLinks.forEach((l) => {
    const isMatch = l.getAttribute("href") === `#${id}`;
    l.classList.toggle("active", isMatch);
  });
};

const io = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((e) => e.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (visible?.target?.id) setActive(visible.target.id);
  },
  {
    root: null,
    threshold: [0.15, 0.25, 0.35, 0.5, 0.65],
  }
);

sections.forEach((s) => io.observe(s));

// ─── Contact form (demo — no backend) ────────────────────────
const form = document.getElementById("contactForm");
const hint = document.getElementById("formHint");

if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    hint.textContent = "Message ready — connect this form to your backend/email service.";
    form.reset();
  });
}

// ─── Footer year ──────────────────────────────────────────────
const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();
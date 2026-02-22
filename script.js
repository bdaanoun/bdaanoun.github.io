// ─── Smooth Scrolling & Active Link Highlighting ──────────────────

const navLinks = document.querySelectorAll('.nav-link');

navLinks.forEach(link => {
  link.addEventListener('click', function (e) {
    // Update active state
    navLinks.forEach(l => l.classList.remove('active'));
    this.classList.add('active');

    // Smooth scroll to section
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ─── Nav Toggle (visual feedback only) ────────────────────────────

const toggle = document.querySelector('.nav-toggle');
let toggled = false;

toggle.addEventListener('click', () => {
  toggled = !toggled;
  toggle.style.background = toggled ? '#f5e44e' : '#ffffff';
});
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

// ─── Contact form (EmailJS Integration) ─────────────────────────
const form = document.getElementById("contactForm");
const hint = document.getElementById("formHint");

// EmailJS IDs (put your real ones here)
const EMAILJS_SERVICE_ID = "service_k5ue7io";
const EMAILJS_TEMPLATE_ID = "template_6tevt1i";

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    hint.textContent = "Sending message...";
    hint.style.color = "var(--text)";

    const formData = new FormData(form);
    const name = formData.get("name")?.toString().trim();
    const email = formData.get("email")?.toString().trim();
    const message = formData.get("message")?.toString().trim();

    // Basic validation
    if (!name || !email || !message) {
      hint.textContent = "Please fill in all fields.";
      hint.style.color = "#d32f2f";
      return;
    }

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: name,
          reply_to: email,
          message: message,
        }
      );

      hint.textContent = "Message sent successfully!";
      hint.style.color = "#2e7d32";
      form.reset();
    } catch (error) {
      console.error("EmailJS error:", error);
      hint.textContent = "Failed to send message. Please try again later.";
      hint.style.color = "#d32f2f";
    }
  });
}

// ─── Footer year ──────────────────────────────────────────────
const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

// ─── Interactive Background ───────────────────────────────────
const canvas = document.getElementById('bg-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let width, height, particles;

  const mouse = {
    x: null,
    y: null,
    radius: 120
  };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  function resize() {
    width = canvas.width = window.innerWidth;
    const container = document.querySelector('.container');
    height = canvas.height = container.offsetHeight;
  }

  const resizeObserver = new ResizeObserver(() => {
    resize();
    initParticles();
  });
  resizeObserver.observe(document.querySelector('.container'));

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2 + 0.5;
      this.baseX = this.x;
      this.baseY = this.y;
      this.density = (Math.random() * 10) + 2;
      this.vx = (Math.random() - 0.5) * 1.5;
      this.vy = (Math.random() - 0.5) * 1.5;
    }

    update(actualMouseX, actualMouseY) {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Interaction with mouse
      if (actualMouseX != null) {
        let dx = actualMouseX - this.x;
        let dy = actualMouseY - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius) {
          let forceDirectionX = dx / distance;
          let forceDirectionY = dy / distance;
          let force = (mouse.radius - distance) / mouse.radius;
          let directionX = forceDirectionX * force * this.density;
          let directionY = forceDirectionY * force * this.density;

          this.x -= directionX;
          this.y -= directionY;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(20, 20, 20, 0.5)';
      ctx.fill();
    }
  }

  function initParticles() {
    particles = [];
    let numberOfParticles = Math.floor((width * height) / 12000);
    if (numberOfParticles > 200) numberOfParticles = 200;

    for (let i = 0; i < numberOfParticles; i++) {
      particles.push(new Particle());
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    let actualMouseX = mouse.x != null ? mouse.x + window.scrollX : null;
    let actualMouseY = mouse.y != null ? mouse.y + window.scrollY : null;

    for (let i = 0; i < particles.length; i++) {
      particles[i].update(actualMouseX, actualMouseY);
      particles[i].draw();

      for (let j = i; j < particles.length; j++) {
        let dx = particles[i].x - particles[j].x;
        let dy = particles[i].y - particles[j].y;
        let distance = dx * dx + dy * dy;

        if (distance < 12000) {
          let opacity = 1 - (distance / 12000);

          let distMouse = Infinity;
          if (actualMouseX != null) {
            let dxMouse = particles[i].x - actualMouseX;
            let dyMouse = particles[i].y - actualMouseY;
            distMouse = dxMouse * dxMouse + dyMouse * dyMouse;
          }

          if (distMouse < 25000 && actualMouseX != null) {
            // Highlight connections near the mouse with an amber/gold color
            ctx.strokeStyle = `rgba(218, 165, 32, ${opacity + 0.5})`;
            ctx.lineWidth = 1.2;
          } else {
            ctx.strokeStyle = `rgba(20, 20, 20, ${opacity * 0.3})`;
            ctx.lineWidth = 1;
          }

          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }

  resize();
  initParticles();
  animate();
}
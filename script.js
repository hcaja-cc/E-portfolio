// Typing Text Dynamic Animation
const typingTextElement = document.querySelector('.typing-text');
const titles = [
  'BSIT Instructor',
  'UI/UX & Web Designer',
  'Learning Tech Specialist',
  'Mobile & Graphic Developer'
];

let titleIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 100;

function typeEffect() {
  const currentTitle = titles[titleIndex];

  if (isDeleting) {
    typingTextElement.textContent = currentTitle.substring(0, charIndex - 1);
    charIndex--;
    typingSpeed = 50;
  } else {
    typingTextElement.textContent = currentTitle.substring(0, charIndex + 1);
    charIndex++;
    typingSpeed = 100;
  }

  if (!isDeleting && charIndex === currentTitle.length) {
    isDeleting = true;
    typingSpeed = 1500;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    titleIndex = (titleIndex + 1) % titles.length;
    typingSpeed = 500;
  }

  setTimeout(typeEffect, typingSpeed);
}

document.addEventListener('DOMContentLoaded', () => {
  typeEffect();
  initPhotoOverlay();
});

// Photo Overlay Handler
function initPhotoOverlay() {
  const profilePhoto = document.getElementById('profile-photo');
  const placeholderOverlay = document.getElementById('placeholder-overlay');

  if (profilePhoto && profilePhoto.getAttribute('src') !== '') {
    placeholderOverlay.style.display = 'none';
  } else if (profilePhoto) {
    profilePhoto.addEventListener('load', () => {
      placeholderOverlay.style.display = 'none';
    });
  }
}

// Dark/Light Theme Switcher
const themeToggleBtn = document.getElementById('theme-toggle');
const currentTheme = localStorage.getItem('portfolio-theme');

if (currentTheme) {
  document.body.setAttribute('data-theme', currentTheme);
  updateThemeIcon(currentTheme);
}

themeToggleBtn.addEventListener('click', () => {
  let theme = document.body.getAttribute('data-theme');
  if (theme === 'dark') {
    document.body.removeAttribute('data-theme');
    localStorage.setItem('portfolio-theme', 'light');
    updateThemeIcon('light');
  } else {
    document.body.setAttribute('data-theme', 'dark');
    localStorage.setItem('portfolio-theme', 'dark');
    updateThemeIcon('dark');
  }
});

function updateThemeIcon(theme) {
  const icon = themeToggleBtn.querySelector('i');
  if (theme === 'dark') {
    icon.className = 'fa-solid fa-sun';
  } else {
    icon.className = 'fa-solid fa-moon';
  }
}

// Mobile Menu Navigation Toggle
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('active');
  const icon = hamburger.querySelector('i');
  if (navLinks.classList.contains('active')) {
    icon.className = 'fa-solid fa-xmark';
  } else {
    icon.className = 'fa-solid fa-bars';
  }
});

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
    hamburger.querySelector('i').className = 'fa-solid fa-bars';
  });
});

// Skills Category Filter
const filterBtns = document.querySelectorAll('.filter-btn');
const skillCards = document.querySelectorAll('.skill-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.getAttribute('data-filter');

    skillCards.forEach(card => {
      if (filter === 'all' || card.getAttribute('data-category') === filter) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  });
});

// Copy Text to Clipboard & Show Toast Notification
function copyText(text, message) {
  navigator.clipboard.writeText(text).then(() => {
    showToast(message);
  }).catch(err => {
    console.error('Failed to copy text: ', err);
  });
}

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// Form Submission Simulation
function handleFormSubmit(event) {
  event.preventDefault();
  showToast('Thank you! Your message has been sent.');
  document.getElementById('contact-form').reset();
}

/* ===================================================
   Interactive Particle Canvas Engine
   =================================================== */
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];
const mouse = { x: null, y: null, radius: 150 };

// Resize canvas to match window
function resizeCanvas() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Track Mouse Movement
window.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

window.addEventListener('mouseleave', () => {
  mouse.x = null;
  mouse.y = null;
});

// Particle Constructor
class Particle {
  constructor() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.vx = (Math.random() - 0.5) * 1.2;
    this.vy = (Math.random() - 0.5) * 1.2;
    this.radius = Math.random() * 2 + 1.5;
  }

  update() {
    // Bounce off edges
    if (this.x < 0 || this.x > width) this.vx *= -1;
    if (this.y < 0 || this.y > height) this.vy *= -1;

    this.x += this.vx;
    this.y += this.vy;

    // Mouse Interaction (Push gently when mouse gets close)
    if (mouse.x !== null && mouse.y !== null) {
      let dx = mouse.x - this.x;
      let dy = mouse.y - this.y;
      let distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < mouse.radius) {
        const forceDirectionX = dx / distance;
        const forceDirectionY = dy / distance;
        const force = (mouse.radius - distance) / mouse.radius;

        // Push away slightly
        this.x -= forceDirectionX * force * 3;
        this.y -= forceDirectionY * force * 3;
      }
    }
  }

  draw(isDark) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = isDark ? 'rgba(56, 189, 248, 0.7)' : 'rgba(37, 99, 235, 0.5)';
    ctx.fill();
  }
}

// Generate Particles
function initParticles() {
  particles = [];
  const particleCount = Math.floor((width * height) / 12000);
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
}

initParticles();
window.addEventListener('resize', initParticles);

// Animation Loop
function animateParticles() {
  ctx.clearRect(0, 0, width, height);
  const isDark = document.body.getAttribute('data-theme') === 'dark';

  // Draw connecting lines between close particles
  for (let a = 0; a < particles.length; a++) {
    for (let b = a; b < particles.length; b++) {
      let dx = particles[a].x - particles[b].x;
      let dy = particles[a].y - particles[b].y;
      let distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 120) {
        let opacity = 1 - distance / 120;
        ctx.strokeStyle = isDark 
          ? `rgba(56, 189, 248, ${opacity * 0.25})` 
          : `rgba(37, 99, 235, ${opacity * 0.15})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(particles[a].x, particles[a].y);
        ctx.lineTo(particles[b].x, particles[b].y);
        ctx.stroke();
      }
    }
  }

  // Draw lines to mouse position
  if (mouse.x !== null && mouse.y !== null) {
    for (let i = 0; i < particles.length; i++) {
      let dx = particles[i].x - mouse.x;
      let dy = particles[i].y - mouse.y;
      let distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < mouse.radius) {
        let opacity = 1 - distance / mouse.radius;
        ctx.strokeStyle = isDark 
          ? `rgba(56, 189, 248, ${opacity * 0.4})` 
          : `rgba(37, 99, 235, ${opacity * 0.3})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
      }
    }
  }

  // Update & Draw individual particles
  particles.forEach(p => {
    p.update();
    p.draw(isDark);
  });

  requestAnimationFrame(animateParticles);
}

animateParticles();
// CURSOR — developer crosshair
const curWrap = document.getElementById('cursorWrap');
let cx = window.innerWidth / 2, cy = window.innerHeight / 2;
let angle = 0;

document.addEventListener('mousemove', e => {
  cx = e.clientX; cy = e.clientY;
  curWrap.style.transform = `translate(${cx - 20}px, ${cy - 20}px)`;
});

// Slow continuous rotation
function rotateCursor() {
  angle += 0.18;
  document.getElementById('cursorSvg').style.transform = `rotate(${angle}deg)`;
  requestAnimationFrame(rotateCursor);
}
rotateCursor();

// Hover state on interactive elements
document.querySelectorAll('a, button, .skill-item, .service-card, .project-card').forEach(el => {
  el.addEventListener('mouseenter', () => curWrap.classList.add('hovering'));
  el.addEventListener('mouseleave', () => curWrap.classList.remove('hovering'));
});

// CANVAS PARTICLES
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');
let W, H, particles = [];
function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.size = Math.random() * 1.5 + 0.3;
    this.speedX = (Math.random() - 0.5) * 0.4;
    this.speedY = (Math.random() - 0.5) * 0.4;
    this.opacity = Math.random() * 0.5 + 0.1;
    this.life = 0;
    this.maxLife = Math.random() * 200 + 100;
  }
  update() {
    this.x += this.speedX; this.y += this.speedY; this.life++;
    if (this.x < 0 || this.x > W || this.y < 0 || this.y > H || this.life > this.maxLife) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0, 210, 255, ${this.opacity})`;
    ctx.fill();
  }
}

for (let i = 0; i < 120; i++) particles.push(new Particle());

// Draw connecting lines
function drawLines() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 100) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(0, 210, 255, ${0.06 * (1 - dist/100)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}

function animCanvas() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => { p.update(); p.draw(); });
  drawLines();
  requestAnimationFrame(animCanvas);
}
animCanvas();

// TYPEWRITER
const words = ['Web Developer', 'AI Enthusiast', 'Freelancer', 'Problem Solver'];
let wi = 0, ci = 0, deleting = false;
const tw = document.getElementById('typewriter');
function typeLoop() {
  const word = words[wi];
  if (!deleting) {
    tw.textContent = word.slice(0, ci + 1);
    ci++;
    if (ci === word.length) { deleting = true; setTimeout(typeLoop, 1800); return; }
    setTimeout(typeLoop, 80);
  } else {
    tw.textContent = word.slice(0, ci - 1);
    ci--;
    if (ci === 0) { deleting = false; wi = (wi + 1) % words.length; }
    setTimeout(typeLoop, 45);
  }
}
typeLoop();

// SCROLL REVEAL
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      const delay = e.target.dataset.delay || 0;
      setTimeout(() => { e.target.classList.add('visible'); }, parseInt(delay));
      // Animate skill bars
      const bar = e.target.querySelector('.skill-fill');
      if (bar) {
        setTimeout(() => { bar.style.width = bar.dataset.width + '%'; }, 300);
      }
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });
reveals.forEach(r => observer.observe(r));

// FORM SUBMIT
function handleSubmit(e) {
  e.preventDefault();
  const btn = e.target.querySelector('.form-submit');
  btn.textContent = '✓ Message Sent!';
  btn.style.background = '#00ff88';
  setTimeout(() => { btn.textContent = 'Send Message →'; btn.style.background = ''; e.target.reset(); }, 3000);
}

// NAV SCROLL EFFECT
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  nav.style.padding = window.scrollY > 50 ? '14px 6vw' : '20px 6vw';
});
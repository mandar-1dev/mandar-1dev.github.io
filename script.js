/* ═══════════════════════════════════════════
   MANDAR SURYAVANSHI — PORTFOLIO JS
═══════════════════════════════════════════ */

/* ── Scroll Progress Bar ── */
const progressBar = document.createElement('div');
progressBar.id = 'scrollProgress';
document.body.prepend(progressBar);
window.addEventListener('scroll', () => {
    const pct = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    progressBar.style.width = Math.min(pct, 100) + '%';
}, { passive: true });

/* ── Loader ── */
(function () {
    const loader = document.getElementById('loader');
    const percent = document.getElementById('loaderPercent');
    let count = 0;
    const iv = setInterval(() => {
        count += Math.floor(Math.random() * 7) + 2;
        if (count >= 100) { count = 100; clearInterval(iv); }
        percent.textContent = count + '%';
        if (count === 100) setTimeout(() => loader.classList.add('hide'), 400);
    }, 55);
})();

/* ── Touch Detection ── */
const isTouchDevice = () => window.matchMedia('(hover:none)').matches;

/* ── Custom Cursor ── */
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');
let fx = 0, fy = 0, cx = window.innerWidth / 2, cy = window.innerHeight / 2;

if (!isTouchDevice() && cursor) {
    document.addEventListener('mousemove', e => {
        cx = e.clientX; cy = e.clientY;
        cursor.style.left = cx + 'px';
        cursor.style.top = cy + 'px';
    });
    (function animF() {
        fx += (cx - fx) * 0.12;
        fy += (cy - fy) * 0.12;
        if (follower) { follower.style.left = fx + 'px'; follower.style.top = fy + 'px'; }
        requestAnimationFrame(animF);
    })();
}

/* ── Canvas Particles ── */
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');
let W, H, particles;

function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', () => { resize(); initParticles(); }, { passive: true });

function Particle() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.vx = (Math.random() - .5) * .3;
    this.vy = (Math.random() - .5) * .3;
    this.r = Math.random() * 1.4 + .4;
    this.col = Math.random() > .5 ? '0,245,212' : '123,47,255';
}
Particle.prototype.update = function () {
    this.x += this.vx; this.y += this.vy;
    if (this.x < 0) this.x = W; if (this.x > W) this.x = 0;
    if (this.y < 0) this.y = H; if (this.y > H) this.y = 0;
};

function initParticles() {
    particles = Array.from({ length: Math.max(30, Math.floor((W * H) / 16000)) }, () => new Particle());
}
initParticles();

let mouseX = -9999, mouseY = -9999;
window.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; }, { passive: true });

function draw() {
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.update();
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.col},.5)`; ctx.fill();
        for (let j = i + 1; j < particles.length; j++) {
            const q = particles[j];
            const dx = p.x - q.x, dy = p.y - q.y, d = Math.sqrt(dx * dx + dy * dy);
            if (d < 110) {
                ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
                ctx.strokeStyle = `rgba(${p.col},${(1 - d / 110) * .15})`; ctx.lineWidth = .5; ctx.stroke();
            }
        }
        if (!isTouchDevice()) {
            const dx = p.x - mouseX, dy = p.y - mouseY, d = Math.sqrt(dx * dx + dy * dy);
            if (d < 120) {
                ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mouseX, mouseY);
                ctx.strokeStyle = `rgba(0,245,212,${(1 - d / 120) * .35})`; ctx.lineWidth = .7; ctx.stroke();
            }
        }
    }
    requestAnimationFrame(draw);
}
draw();

/* ── Navigation ── */
const nav = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');
let menuOpen = false;

window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 50), { passive: true });

navToggle.addEventListener('click', () => {
    menuOpen = !menuOpen;
    mobileMenu.classList.toggle('open', menuOpen);
    const spans = navToggle.querySelectorAll('span');
    if (menuOpen) {
        spans[0].style.transform = 'rotate(45deg) translate(5px,5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px,-5px)';
        document.body.style.overflow = 'hidden';
    } else {
        spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
        document.body.style.overflow = '';
    }
});

document.querySelectorAll('.mob-link').forEach(l => {
    l.addEventListener('click', () => {
        menuOpen = false;
        mobileMenu.classList.remove('open');
        navToggle.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
        document.body.style.overflow = '';
    });
});

/* ── Smooth Scroll ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        const href = a.getAttribute('href');
        if (href === '#') return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - nav.offsetHeight - 10, behavior: 'smooth' });
        }
    });
});

/* ── Typing Effect ── */
const phrases = [
    'Building AI Multi-Agent Systems_',
    'Engineering Intelligent Backends_',
    'Crafting RAG Pipelines_',
    'Designing Distributed Architectures_',
    'Turning Ideas into AI Products_',
];
const typedEl = document.getElementById('typedText');
let pIdx = 0, cIdx = 0, deleting = false;
function typeLoop() {
    const phrase = phrases[pIdx];
    if (!deleting) {
        typedEl.textContent = phrase.slice(0, ++cIdx);
        if (cIdx === phrase.length) { deleting = true; setTimeout(typeLoop, 1800); return; }
    } else {
        typedEl.textContent = phrase.slice(0, --cIdx);
        if (cIdx === 0) { deleting = false; pIdx = (pIdx + 1) % phrases.length; }
    }
    setTimeout(typeLoop, deleting ? 38 : 68);
}
typeLoop();

/* ── Scroll Reveal ── */
const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); } });
}, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
document.querySelectorAll('.reveal-up,.reveal-left,.reveal-right').forEach(el => revealObs.observe(el));

/* ── Counter Animation ── */
function animateCounter(el) {
    const raw = parseFloat(el.dataset.count);
    const isCGPA = el.dataset.suffix === '';
    const target = isCGPA ? raw / 100 : raw;
    let current = 0, step = target / 60;
    const iv = setInterval(() => {
        current += step;
        if (current >= target) { current = target; clearInterval(iv); }
        el.textContent = isCGPA ? current.toFixed(2) : Math.floor(current);
    }, 22);
}
const statsObs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.querySelectorAll('.stat-num').forEach(animateCounter); statsObs.unobserve(e.target); } });
}, { threshold: .4 });
const statsSection = document.querySelector('.about-stats');
if (statsSection) statsObs.observe(statsSection);

/* ── Skill Bars ── */
const barObs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.querySelectorAll('.sbar-fill').forEach(b => b.style.width = b.dataset.width + '%'); barObs.unobserve(e.target); } });
}, { threshold: .25 });
const skillBarsEl = document.querySelector('.skill-bars');
if (skillBarsEl) barObs.observe(skillBarsEl);

/* ── CGPA Bar ── */
const cgpaObs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.style.width = '84.1%'; cgpaObs.unobserve(e.target); } });
}, { threshold: .4 });
document.querySelectorAll('.cgpa-fill').forEach(el => cgpaObs.observe(el));

/* ── 3D Tilt ── */
if (!isTouchDevice()) {
    document.querySelectorAll('[data-tilt]').forEach(card => {
        card.addEventListener('mousemove', e => {
            const r = card.getBoundingClientRect();
            const x = e.clientX - r.left, y = e.clientY - r.top;
            const rY = ((x - r.width / 2) / (r.width / 2)) * 7;
            const rX = -((y - r.height / 2) / (r.height / 2)) * 7;
            card.style.transform = `perspective(800px) rotateX(${rX}deg) rotateY(${rY}deg) translateY(-4px) scale(1.015)`;
        });
        card.addEventListener('mouseleave', () => card.style.transform = '');
    });
}

/* ── Active Nav ── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');
window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => { if (window.scrollY >= s.offsetTop - 180) current = s.id; });
    navLinks.forEach(l => { l.style.color = l.getAttribute('href') === `#${current}` ? 'var(--cyan)' : ''; });
}, { passive: true });

/* ── Hero Parallax ── */
const heroContent = document.querySelector('.hero-content');
if (!isTouchDevice() && heroContent) {
    window.addEventListener('scroll', () => {
        if (window.scrollY < window.innerHeight)
            heroContent.style.transform = `translateY(${window.scrollY * 0.2}px)`;
    }, { passive: true });
}

/* ── Button Ripple ── */
const rs = document.createElement('style');
rs.textContent = '@keyframes ripple{to{transform:scale(1);opacity:0}}';
document.head.appendChild(rs);
document.querySelectorAll('.btn-primary,.btn-ghost').forEach(btn => {
    btn.addEventListener('click', e => {
        const r = document.createElement('span');
        const rect = btn.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) * 2;
        r.style.cssText = `position:absolute;border-radius:50%;pointer-events:none;left:${e.clientX - rect.left - size / 2}px;top:${e.clientY - rect.top - size / 2}px;width:${size}px;height:${size}px;background:rgba(255,255,255,.13);transform:scale(0);animation:ripple .5s linear;`;
        btn.style.position = 'relative'; btn.style.overflow = 'hidden';
        btn.appendChild(r); setTimeout(() => r.remove(), 550);
    });
});

/* ── Noise Overlay ── */
(function () {
    const nc = document.createElement('canvas');
    nc.width = nc.height = 200;
    const c = nc.getContext('2d'), d = c.createImageData(200, 200);
    for (let i = 0; i < d.data.length; i += 4) { const v = Math.random() * 255; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 10; }
    c.putImageData(d, 0, 0);
    const div = document.createElement('div');
    div.style.cssText = `position:fixed;inset:0;z-index:0;pointer-events:none;background-image:url(${nc.toDataURL()});background-size:200px;opacity:.35;`;
    document.body.appendChild(div);
})();

console.log('%c MANDAR SURYAVANSHI ', 'background:#7b2fff;color:#fff;font-size:18px;padding:8px 16px;border-radius:4px;font-family:monospace;');
console.log('%c AI Engineer · Full Stack Developer ', 'color:#00f5d4;font-size:12px;font-family:monospace;');
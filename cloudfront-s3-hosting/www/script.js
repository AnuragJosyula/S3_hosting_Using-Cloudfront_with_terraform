// ========== PARTICLE CANVAS ==========
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function createParticles() {
    particles = [];
    const count = Math.min(60, Math.floor(window.innerWidth / 20));
    for (let i = 0; i < count; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 2 + 0.5,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            opacity: Math.random() * 0.5 + 0.1
        });
    }
}
createParticles();

function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const isLight = document.body.classList.contains('light-theme');
    const color = isLight ? '79, 70, 229' : '99, 102, 241';

    particles.forEach((p, i) => {
        // Move
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        // Dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color}, ${p.opacity})`;
        ctx.fill();

        // Lines between nearby particles
        for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dx = p.x - p2.x;
            const dy = p.y - p2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) {
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.strokeStyle = `rgba(${color}, ${0.08 * (1 - dist / 120)})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }
    });

    requestAnimationFrame(drawParticles);
}
drawParticles();

// ========== COUNTER ==========
let counter = 0;
const counterButton = document.getElementById('counterButton');
const counterSpan = document.getElementById('counter');

counterButton.addEventListener('click', () => {
    counter++;
    counterSpan.textContent = counter;

    counterButton.style.transform = 'scale(0.94)';
    setTimeout(() => {
        counterButton.style.transform = 'scale(1)';
    }, 120);

    if (counter % 10 === 0) showCelebration();
});

// ========== THEME TOGGLE ==========
const colorButton = document.getElementById('colorButton');
let isLight = false;

colorButton.addEventListener('click', () => {
    isLight = !isLight;
    document.body.classList.toggle('light-theme');
    colorButton.querySelector('.btn-icon').textContent = isLight ? '☀️' : '🌙';
    localStorage.setItem('lightTheme', isLight);
});

// ========== PAGE LOAD ==========
document.addEventListener('DOMContentLoaded', () => {
    // Restore theme
    if (localStorage.getItem('lightTheme') === 'true') {
        isLight = true;
        document.body.classList.add('light-theme');
        colorButton.querySelector('.btn-icon').textContent = '☀️';
    }

    // Animate cards in
    const cards = document.querySelectorAll('.feature-card');
    cards.forEach((card, i) => {
        setTimeout(() => card.classList.add('visible'), 200 + i * 150);
    });

    // Measure load time
    setTimeout(() => {
        const perf = performance.getEntriesByType('navigation')[0];
        if (perf) {
            const ms = Math.round(perf.loadEventEnd - perf.startTime);
            document.getElementById('latencyStat').textContent = ms + 'ms';
        }
    }, 100);

    // Status rotation
    updateStatus();
    setInterval(updateStatus, 4000);
});

// ========== CELEBRATION ==========
function showCelebration() {
    const el = document.createElement('div');
    el.innerHTML = '🎉';
    el.style.cssText = `
        position: fixed; top: 50%; left: 50%;
        transform: translate(-50%, -50%) scale(0);
        font-size: 4rem; pointer-events: none; z-index: 1000;
        animation: celebrateAnim 0.8s ease-out forwards;
    `;
    const style = document.createElement('style');
    style.textContent = `
        @keyframes celebrateAnim {
            0%   { transform: translate(-50%, -50%) scale(0); opacity: 1; }
            50%  { transform: translate(-50%, -50%) scale(1.3); opacity: 1; }
            100% { transform: translate(-50%, -50%) scale(1.6); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    document.body.appendChild(el);
    setTimeout(() => {
        el.remove();
        style.remove();
    }, 800);
}

// ========== STATUS ROTATION ==========
function updateStatus() {
    const statuses = ['Active', 'Optimized', 'Secure', 'Fast', 'Cached'];
    const el = document.getElementById('status');
    const next = statuses[Math.floor(Math.random() * statuses.length)];
    el.style.opacity = '0';
    setTimeout(() => {
        el.textContent = next;
        el.style.opacity = '1';
    }, 250);
}

// ========== CARD HOVER ==========
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.feature-card').forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        card.addEventListener('mouseleave', function () {
            this.style.transform = '';
        });
    });
});

// ========== KEYBOARD SHORTCUTS ==========
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') { e.preventDefault(); counterButton.click(); }
    if (e.key === 't' || e.key === 'T') colorButton.click();
});

// ========== CONSOLE ==========
window.addEventListener('load', () => {
    console.log('%c🚀 Anurag Josyula — Cloud Infrastructure Project', 'font-size:14px;font-weight:bold;');
    console.log('%c📦 S3 + CloudFront + Terraform', 'color: #6366f1');
    console.log('%c⌨️  Shortcuts: Space (counter) | T (theme)', 'color: #94a3b8');
});
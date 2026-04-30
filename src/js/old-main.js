lucide.createIcons();

/* ── Mobile Menu ── */
let iconsReady = false;
function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    const btn  = document.getElementById('navHamburger');
    const isOpen = menu.classList.toggle('open');
    btn.classList.toggle('open', isOpen);
    btn.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
    if (isOpen && !iconsReady) { lucide.createIcons(); iconsReady = true; }
}

function closeMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    const btn  = document.getElementById('navHamburger');
    menu.classList.remove('open');
    btn.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
}

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMobileMenu();
});

/* ── Navbar scroll ── */
const nav = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
});

/* ── Scroll reveal via IntersectionObserver ── */
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.anim').forEach(el => revealObserver.observe(el));

/* ── Parallax suave nos blobs ── */
const blobData = [
    { el: document.querySelector('.blob-1'), sx: 0.04, sy: 0.03 },
    { el: document.querySelector('.blob-2'), sx: -0.03, sy: 0.05 },
    { el: document.querySelector('.blob-3'), sx: 0.05, sy: -0.04 },
    { el: document.querySelector('.blob-4'), sx: -0.04, sy: 0.03 },
];
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(() => {
            const y = window.scrollY;
            blobData.forEach(b => {
                if (b.el) b.el.style.transform = `translate(${y * b.sx}px, ${y * b.sy}px)`;
            });
            ticking = false;
        });
        ticking = true;
    }
});

/* ── Mouse parallax 3D nos cards ── */
function apply3D(selector, intensity) {
    document.querySelectorAll(selector).forEach(card => {
        card.style.transformStyle = 'preserve-3d';
        card.style.willChange = 'transform';
        card.addEventListener('mousemove', e => {
            const r = card.getBoundingClientRect();
            const dx = (e.clientX - r.left - r.width  / 2) / (r.width  / 2);
            const dy = (e.clientY - r.top  - r.height / 2) / (r.height / 2);
            card.style.transition = 'transform 0.1s ease, box-shadow 0.1s ease';
            card.style.transform = `perspective(800px) translateY(-${intensity * 1.5}px) rotateX(${-dy * intensity}deg) rotateY(${dx * intensity}deg) scale(1.02)`;
            card.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
            card.style.setProperty('--my', `${((e.clientY - r.top)  / r.height) * 100}%`);
        });
        card.addEventListener('mouseleave', () => {
            card.style.transition = 'transform 0.4s ease, box-shadow 0.4s ease';
            card.style.transform = '';
        });
    });
}

apply3D('.value-card', 6);
apply3D('.tcard', 5);
apply3D('.pricing-card', 5);
apply3D('.ui-card', 4);

/* ── Contador animado nas stats ── */
const countObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.count);
        const hasPct = el.dataset.count && el.textContent.includes('%');
        let cur = 0;
        const step = Math.max(1, Math.ceil(target / 60));
        const timer = setInterval(() => {
            cur = Math.min(cur + step, target);
            el.textContent = (hasPct ? '' : '+') + cur.toLocaleString('pt-BR') + (hasPct ? '%' : '');
            if (cur >= target) clearInterval(timer);
        }, 20);
        countObserver.unobserve(el);
    });
}, { threshold: 0.5 });
document.querySelectorAll('.stat-num[data-count]').forEach(el => countObserver.observe(el));

/* ── Captura de e-mail no CTA ── */
const leadForm = document.getElementById('leadForm');
if (leadForm) {
    leadForm.addEventListener('submit', e => {
        e.preventDefault();
        const email = leadForm.querySelector('input[type="email"]').value.trim();
        if (!email) return;
        const successMsg = document.getElementById('leadSuccess');
        leadForm.style.display = 'none';
        if (successMsg) successMsg.style.display = 'flex';
    });
}

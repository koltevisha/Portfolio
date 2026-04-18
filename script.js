/* ===== Portfolio Interactive Script ===== */

document.addEventListener('DOMContentLoaded', () => {

    // ===== CURSOR GLOW =====
    const cursorGlow = document.getElementById('cursorGlow');
    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorGlow.style.left = mouseX + 'px';
        cursorGlow.style.top = mouseY + 'px';
    });

    // ===== PARTICLE CANVAS =====
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    const PARTICLE_COUNT = 50;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.4;
            this.speedY = (Math.random() - 0.5) * 0.4;
            this.opacity = Math.random() * 0.4 + 0.1;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(108, 92, 231, ${this.opacity})`;
            ctx.fill();
        }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });

        // Draw connections
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(108, 92, 231, ${0.06 * (1 - dist / 120)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    // ===== NAVBAR =====
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('open');
    });

    // Close mobile nav on link click
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinks.classList.remove('open');
        });
    });

    // Active nav link on scroll
    const sections = document.querySelectorAll('section[id]');
    function updateActiveNav() {
        const scrollPos = window.scrollY + 100;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            const link = document.querySelector(`.nav-link[data-section="${id}"]`);
            if (link) {
                if (scrollPos >= top && scrollPos < top + height) {
                    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                }
            }
        });
    }
    window.addEventListener('scroll', updateActiveNav);

    // ===== TYPING EFFECT =====
    const typingEl = document.getElementById('typingText');
    const phrases = [
        'web applications.',
        'scalable backends.',
        'beautiful UIs.',
        'REST APIs.',
        'full-stack solutions.'
    ];
    let phraseIndex = 0, charIndex = 0, isDeleting = false;

    function typeEffect() {
        const current = phrases[phraseIndex];
        if (isDeleting) {
            typingEl.textContent = current.substring(0, charIndex--);
            if (charIndex < 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                setTimeout(typeEffect, 400);
                return;
            }
        } else {
            typingEl.textContent = current.substring(0, charIndex++);
            if (charIndex > current.length) {
                isDeleting = true;
                setTimeout(typeEffect, 1800);
                return;
            }
        }
        setTimeout(typeEffect, isDeleting ? 40 : 80);
    }
    typeEffect();

    // ===== COUNTER ANIMATION =====
    const counters = document.querySelectorAll('.stat-number');
    let countersDone = false;

    function animateCounters() {
        if (countersDone) return;
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-count');
            const duration = 1500;
            const start = performance.now();

            function step(now) {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);
                const ease = 1 - Math.pow(1 - progress, 3);
                counter.textContent = Math.round(target * ease);
                if (progress < 1) requestAnimationFrame(step);
            }
            requestAnimationFrame(step);
        });
        countersDone = true;
    }
    // Trigger counters when hero is visible
    setTimeout(animateCounters, 1200);

    // ===== REVEAL ON SCROLL =====
    const revealEls = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // Animate skill bars when skills section is visible
                if (entry.target.closest('.skills')) {
                    entry.target.querySelectorAll('.skill-card').forEach((card, i) => {
                        setTimeout(() => card.classList.add('animated'), i * 100);
                    });
                }
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => observer.observe(el));

    // ===== SKILLS TABS =====
    const tabs = document.querySelectorAll('.skill-tab');
    const panels = document.querySelectorAll('.skill-panel');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.getAttribute('data-tab');

            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            panels.forEach(p => {
                p.classList.remove('active');
                if (p.id === `panel-${target}`) {
                    p.classList.add('active');
                    // Animate skill bars
                    p.querySelectorAll('.skill-card').forEach((card, i) => {
                        card.classList.remove('animated');
                        setTimeout(() => card.classList.add('animated'), i * 80);
                    });
                }
            });
        });
    });

    // Initial skill bar animation for active panel
    setTimeout(() => {
        document.querySelectorAll('.skill-panel.active .skill-card').forEach((card, i) => {
            setTimeout(() => card.classList.add('animated'), i * 100);
        });
    }, 500);

    // ===== CONTACT FORM =====
    const form = document.getElementById('contactForm');
    form.addEventListener('submit', e => {
        e.preventDefault();
        const btn = document.getElementById('submitBtn');
        const original = btn.innerHTML;

        btn.innerHTML = '<i class="fas fa-check"></i> <span>Message Sent!</span>';
        btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';

        setTimeout(() => {
            btn.innerHTML = original;
            btn.style.background = '';
            form.reset();
        }, 2500);
    });

    // ===== SMOOTH SCROLL FOR ALL ANCHOR LINKS =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ===== TILT EFFECT ON PROJECT CARDS =====
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
});
/* ===== CERTIFICATE GALLERY LIGHTBOX ===== */
const galleryItems = document.querySelectorAll('.gallery-item');
const certModal = document.getElementById('certModal');
const modalImg = document.getElementById('modalImg');
const modalTitle = document.getElementById('modalTitle');
const modalIssuer = document.getElementById('modalIssuer');
const modalClose = document.getElementById('modalClose');

if (galleryItems.length > 0 && certModal) {
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const imgSrc = item.querySelector('img').src;
            const title = item.getAttribute('data-title');
            const issuer = item.getAttribute('data-issuer');

            modalImg.src = imgSrc;
            modalTitle.textContent = title;
            modalIssuer.textContent = issuer;

            certModal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Disable scroll
        });
    });

    const closeModal = () => {
        certModal.classList.remove('active');
        document.body.style.overflow = ''; // Enable scroll
    };

    modalClose.addEventListener('click', closeModal);

    certModal.addEventListener('click', (e) => {
        if (e.target === certModal) {
            closeModal();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && certModal.classList.contains('active')) {
            closeModal();
        }
    });
}

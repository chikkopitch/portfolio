// Minimalistic JS для реализации микроанимаций и UX-паттернов (ui-ux-pro-max-skill)

// --- Telegram Bot Config ---
const BOT_TOKEN = '8882168141:AAEjUh_paj0Bo_HQyYReWcJn2rNoWdk1gfs';
const ADMIN_CHAT_ID = '1250232776';

document.addEventListener('DOMContentLoaded', () => {

    // 1. Анимация Header'а при скролле (Glassmorphism эффект)
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 2. Intersection Observer для эффекта появления элементов (fade-up)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));



});

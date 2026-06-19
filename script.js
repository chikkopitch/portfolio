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

    // 3. Обработка формы контактов — отправка уведомления в Telegram
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name    = document.getElementById('form-name').value.trim();
        const contact = document.getElementById('form-contact').value.trim();
        const message = document.getElementById('form-message').value.trim();
        const btn     = document.getElementById('submitBtn');
        const status  = document.getElementById('formStatus');

        // Блокируем кнопку на время отправки
        btn.disabled = true;
        btn.textContent = 'Отправляю...';
        status.style.display = 'none';

        const text =
            `📬 *Новая заявка с портфолио!*\n\n` +
            `👤 *Имя:* ${name}\n` +
            `📱 *Контакт:* ${contact}\n` +
            `💬 *Сообщение:*\n${message}`;

        try {
            const response = await fetch(
                `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chat_id: ADMIN_CHAT_ID,
                        text: text,
                        parse_mode: 'Markdown'
                    })
                }
            );

            const result = await response.json();

            if (result.ok) {
                form.reset();
                status.style.display = 'block';
                status.style.color = 'var(--accent)';
                status.textContent = '✅ Заявка отправлена! Я свяжусь с вами в ближайшее время.';
            } else {
                throw new Error(result.description);
            }
        } catch (err) {
            status.style.display = 'block';
            status.style.color = '#ff4d4d';
            status.textContent = '❌ Ошибка отправки. Напишите мне напрямую в Telegram.';
            console.error('Telegram API error:', err);
        } finally {
            btn.disabled = false;
            btn.textContent = 'Отправить заявку';
        }
    });

});

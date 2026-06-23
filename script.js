// Minimalistic JS для реализации микроанимаций и UX-паттернов (ui-ux-pro-max-skill)

// --- Telegram Bot Config ---
const BOT_TOKEN = '8882168141:AAEjUh_paj0Bo_HQyYReWcJn2rNoWdk1gfs';
const ADMIN_CHAT_ID = '1250232776';

document.addEventListener('DOMContentLoaded', () => {

    // --- Защита от копирования контента ---
    document.addEventListener('contextmenu', (e) => {
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault();
        }
    });

    document.addEventListener('keydown', (e) => {
        const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
        const isCmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        if (isCmdOrCtrl && ['c', 'x', 'a', 'u', 's', 'p'].includes(e.key.toLowerCase())) {
            e.preventDefault();
        }
    });

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

    // 3. Mock Chat Animation
    const mockChatContainer = document.getElementById('mockChatContainer');
    const mockChatBox = document.getElementById('mockChatBox');
    
    if (mockChatContainer && mockChatBox) {
        const messages = [
            { type: 'client', text: 'Здравствуйте! Сколько будет стоить разводка отопления в доме 120 м²?' },
            { type: 'typing', delay: 1500 },
            { type: 'bot', text: 'Здравствуйте! Разводка отопления под ключ — от 180 000 ₽, точная сумма зависит от схемы и материалов. Оставите контакты — специалист посчитает смету и перезвонит.' },
            { type: 'typing', delay: 800 },
            { type: 'bot', text: 'Как вас зовут и какой номер для связи?' },
            { type: 'client', text: 'Игорь, +7 951 ХХХ-ХХ-ХХ' },
            { type: 'system', text: 'Заявка отправлена администратору ✅' }
        ];

        let chatAnimationSeq = 0;
        let isVisible = false;

        const playChatAnimation = async (seq) => {
            const wait = (ms) => new Promise(res => setTimeout(res, ms));

            while (isVisible && chatAnimationSeq === seq) {
                mockChatBox.innerHTML = '';
                await wait(500);

                for (let i = 0; i < messages.length; i++) {
                    if (!isVisible || chatAnimationSeq !== seq) return;
                    
                    const msg = messages[i];
                    
                    if (msg.type === 'typing') {
                        const typingDiv = document.createElement('div');
                        typingDiv.className = 'chat-msg bot typing-msg';
                        typingDiv.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span></div>';
                        mockChatBox.appendChild(typingDiv);
                        
                        void typingDiv.offsetWidth;
                        typingDiv.classList.add('visible');
                        
                        await wait(msg.delay || 1500);
                        
                        if (!isVisible || chatAnimationSeq !== seq) return;
                        typingDiv.remove();
                    } else {
                        const div = document.createElement('div');
                        div.className = `chat-msg ${msg.type}`;
                        div.textContent = msg.text;
                        mockChatBox.appendChild(div);
                        
                        void div.offsetWidth;
                        div.classList.add('visible');
                        
                        await wait(1200);
                    }
                }
                
                await wait(3000); // Wait before repeating
            }
        };

        const chatObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (!isVisible) {
                        isVisible = true;
                        chatAnimationSeq++;
                        playChatAnimation(chatAnimationSeq);
                    }
                } else {
                    isVisible = false;
                    chatAnimationSeq++; // Cancel pending sequence
                }
            });
        }, { threshold: 0.1 });

        chatObserver.observe(mockChatContainer);
    }

});

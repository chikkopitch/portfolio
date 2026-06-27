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

    // 3.5. Smooth Scroll для ссылок меню и кнопок
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId && targetId.length > 1) {
                e.preventDefault();
                const targetSec = document.querySelector(targetId);
                if (targetSec) {
                    const startPosition = window.scrollY || document.documentElement.scrollTop;
                    const targetPosition = targetSec.offsetTop;
                    const distance = targetPosition - startPosition;
                    const duration = 1000;
                    let start = null;

                    function animation(currentTime) {
                        if (start === null) start = currentTime;
                        const timeElapsed = currentTime - start;
                        const progress = Math.min(timeElapsed / duration, 1);
                        const ease = progress < 0.5 ? 8 * Math.pow(progress, 4) : 1 - Math.pow(-2 * progress + 2, 4) / 2;
                        window.scrollTo(0, startPosition + distance * ease);
                        if (timeElapsed < duration) {
                            requestAnimationFrame(animation);
                        }
                    }
                    requestAnimationFrame(animation);
                }
            }
        });
    });

    // 4. Custom Smooth Scroll (Apple-like) БЕЗ ЗАДЕРЖЕК
    const scrollSections = Array.from(document.querySelectorAll('.section, .footer'));
    let isScrollThrottled = false;

    window.addEventListener('wheel', (e) => {
        if (window.innerWidth <= 768) return; // На мобильных оставляем нативный скролл
        if (e.ctrlKey || e.shiftKey) return;
        
        e.preventDefault();

        if (isScrollThrottled) return;
        
        const scrollY = window.scrollY || document.documentElement.scrollTop;
        const viewportHeight = window.innerHeight;
        
        let currentIndex = 0;
        scrollSections.forEach((sec, index) => {
            if (!sec) return;
            if (scrollY >= sec.offsetTop - 50) {
                currentIndex = index;
            }
        });

        const currentSec = scrollSections[currentIndex];
        if (!currentSec) return;

        const currentTop = currentSec.offsetTop;
        const currentBottom = currentTop + currentSec.offsetHeight;
        const viewportBottom = scrollY + viewportHeight;

        let targetPosition = scrollY;
        const scrollStep = viewportHeight * 0.6; // Шаг скролла внутри высокой секции

        if (e.deltaY > 0) { // Скролл вниз
            if (Math.ceil(viewportBottom) < currentBottom - 10) {
                // Если мы внутри высокой секции, скроллим по частям, а не прыгаем
                targetPosition = Math.min(scrollY + scrollStep, currentBottom - viewportHeight);
            } else if (currentIndex < scrollSections.length - 1) {
                targetPosition = scrollSections[currentIndex + 1].offsetTop;
            }
        } else if (e.deltaY < 0) { // Скролл вверх
            if (Math.floor(scrollY) > currentTop + 10) {
                // Скроллим вверх внутри высокой секции
                targetPosition = Math.max(scrollY - scrollStep, currentTop);
            } else if (currentIndex > 0) {
                const prevSec = scrollSections[currentIndex - 1];
                if (prevSec.offsetHeight > viewportHeight + 10) {
                    // Если предыдущая секция высокая, прыгаем к ее НИЖНЕМУ краю
                    targetPosition = prevSec.offsetTop + prevSec.offsetHeight - viewportHeight;
                } else {
                    targetPosition = prevSec.offsetTop;
                }
            }
        }

        if (targetPosition !== scrollY) {
            isScrollThrottled = true;
            
            const distance = targetPosition - scrollY;
            const duration = 1000;
            let start = null;

            function animation(currentTime) {
                if (start === null) start = currentTime;
                const timeElapsed = currentTime - start;
                const progress = Math.min(timeElapsed / duration, 1);
                
                const ease = progress < 0.5 ? 8 * Math.pow(progress, 4) : 1 - Math.pow(-2 * progress + 2, 4) / 2;

                window.scrollTo(0, scrollY + distance * ease);

                if (timeElapsed < duration) {
                    requestAnimationFrame(animation);
                } else {
                    window.scrollTo(0, targetPosition);
                    setTimeout(() => { isScrollThrottled = false; }, 50);
                }
            }
            
            requestAnimationFrame(animation);
        } else {
            isScrollThrottled = true;
            setTimeout(() => { isScrollThrottled = false; }, 200);
        }
    }, { passive: false });

});

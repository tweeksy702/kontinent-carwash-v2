/* =========================================
   КАРУСЕЛЬ ОТЗЫВОВ
   ========================================= */
(function initCarousel() {
    const track = document.getElementById('carouselTrack');
    const slides = track.querySelectorAll('.carousel__slide');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dotsContainer = document.getElementById('carouselDots');
    let currentIndex = 0;
    let autoplayInterval;

    // Создаём точки
    slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.classList.add('carousel__dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('.carousel__dot');

    function updateCarousel() {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    }

    function goToSlide(index) {
        currentIndex = (index + slides.length) % slides.length;
        updateCarousel();
        resetAutoplay();
    }

    function nextSlide() {
        goToSlide(currentIndex + 1);
    }

    function prevSlide() {
        goToSlide(currentIndex - 1);
    }

    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    function resetAutoplay() {
        clearInterval(autoplayInterval);
        autoplayInterval = setInterval(nextSlide, 6000);
    }

    // Запуск автопрокрутки
    resetAutoplay();

    // Свайп на мобильных
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const delta = touchStartX - touchEndX;
        if (Math.abs(delta) > 50) {
            if (delta > 0) nextSlide();
            else prevSlide();
        }
    }
})();

/* =========================================
   АНИМАЦИЯ ПОЯВЛЕНИЯ ПРИ СКРОЛЛЕ
   ========================================= */
(function initRevealOnScroll() {
    const reveals = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    reveals.forEach((el) => observer.observe(el));
})();

/* =========================================
   АНИМАЦИЯ ЧИСЕЛ В ПРАЙСЕ
   ========================================= */
(function initPriceCounter() {
    const priceNums = document.querySelectorAll('.price-num');

    const animateValue = (el) => {
        const target = parseInt(el.getAttribute('data-target'), 10);
        const duration = 1500;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // easing-функция
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(eased * target);
            el.textContent = current;
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = target;
            }
        }

        requestAnimationFrame(update);
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const row = entry.target;
                const nums = row.querySelectorAll('.price-num');
                nums.forEach(animateValue);
                observer.unobserve(row);
            }
        });
    }, { threshold: 0.3 });

    document.querySelectorAll('.price__table tbody tr').forEach((row) => {
        observer.observe(row);
    });
})();

/* =========================================
   КНОПКА "СВЯЗАТЬСЯ С НАМИ"
   ========================================= */
(function initContactButton() {
    const btn = document.getElementById('contactBtn');
    const phoneBlock = document.getElementById('contactsPhone');

    if (!btn || !phoneBlock) return;

    btn.addEventListener('click', () => {
        phoneBlock.classList.toggle('active');
        if (phoneBlock.classList.contains('active')) {
            btn.querySelector('span:last-child').textContent = 'Скрыть номер';
            // Плавный скролл к телефону
            setTimeout(() => {
                phoneBlock.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        } else {
            btn.querySelector('span:last-child').textContent = 'Связаться с нами';
        }
    });
})();

/* =========================================
   ИЗМЕНЕНИЕ ШАПКИ ПРИ СКРОЛЛЕ
   ========================================= */
(function initHeaderScroll() {
    const header = document.getElementById('header');
    if (!header) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }
    });
})();

/* =========================================
   БУРГЕР-МЕНЮ
   ========================================= */
(function initBurger() {
    const burger = document.getElementById('burger');
    const nav = document.querySelector('.nav');

    if (!burger || !nav) return;

    burger.addEventListener('click', () => {
        burger.classList.toggle('active');
        nav.classList.toggle('active');
    });

    // Закрыть меню при клике на ссылку
    nav.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            burger.classList.remove('active');
            nav.classList.remove('active');
        });
    });
})();

/* =========================================
   МОДАЛЬНОЕ ОКНО
   ========================================= */
(function initModal() {
    const modal = document.getElementById('modal');
    const closeBtn = document.getElementById('modalClose');

    if (!modal) return;

    function openModal() {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Закрытие по клику на фон или крестик
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Закрытие по Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

    // Экспортируем для возможного использования
    window.openContactModal = openModal;
})();

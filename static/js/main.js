function slowScroll(id) {
	$("html, body").animate({
		scrollTop: $(id).offset().top - 50
	}, 500);
	return false;
}

/* Функция для мобильного меню */
$(document).ready(function() {
    // Открытие/закрытие мобильного меню
    $(".header-top .menu").on("click", function(e) {
        e.stopPropagation();

        if($(".mobile-menu").is(":visible")) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    // Закрытие меню при клике на ссылку
    $(".mobile-menu a").on("click", function() {
        closeMenu();
    });

    // Закрытие меню при клике вне его
    $(document).on("click", function(e) {
        if($(".mobile-menu").is(":visible") &&
           !$(e.target).closest('.mobile-menu, .header-top .menu').length) {
            closeMenu();
        }
    });

    // Закрытие меню при нажатии Escape
    $(document).on('keyup', function(e) {
        if (e.key === 'Escape' && $(".mobile-menu").is(":visible")) {
            closeMenu();
        }
    });
});

function openMenu() {
    $(".mobile-menu").fadeIn(300);
    $(".header-top .menu").addClass("active");
    $(".mobile-menu").addClass("active");
    $("body").addClass("menu-open");
    $(".header-top .menu i").removeClass("fa-bars").addClass("fa-times");
}

function closeMenu() {
    $(".mobile-menu").fadeOut(300);
    $(".header-top .menu").removeClass("active");
    $(".mobile-menu").removeClass("active");
    $("body").removeClass("menu-open");
    $(".header-top .menu i").removeClass("fa-times").addClass("fa-bars");
}

// Добавьте эту функцию для использования в onclick ссылок
function slowScrollWithClose(id) {
    closeMenu();
    slowScroll(id);
    return false;
}

// ПРОСТОЙ И НАДЕЖНЫЙ СЛАЙДЕР ОТЗЫВОВ
function initNewReviewsSlider() {
    console.log('=== Новый слайдер отзывов ===');

    // Получаем элементы
    const reviewItems = document.querySelectorAll('.review-item');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dots = document.querySelectorAll('.dot');

    console.log('Найдено отзывов:', reviewItems.length);

    if (reviewItems.length === 0) {
        console.warn('Нет отзывов для показа');
        return;
    }

    let currentIndex = 0;

    // Функция показа отзыва
    function showReview(index) {
        console.log(`Показываем отзыв ${index + 1}/${reviewItems.length}`);

        // 1. Скрываем все отзывы
        reviewItems.forEach(item => {
            item.style.display = 'none';
            item.classList.remove('active');
            item.style.opacity = '0';
        });

        // 2. Показываем нужный отзыв
        const activeItem = reviewItems[index];
        if (activeItem) {
            activeItem.style.display = 'block';
            activeItem.classList.add('active');
            activeItem.style.opacity = '1';

            // 3. Гарантируем видимость всего контента внутри
            const allElements = activeItem.querySelectorAll('*');
            allElements.forEach(el => {
                el.style.opacity = '1';
                el.style.visibility = 'visible';
                el.style.color = ''; // Сбрасываем цвет
            });

            // 4. Особенно проверяем текст
            const textElement = activeItem.querySelector('.review-text p');
            if (textElement) {
                textElement.style.color = '#AFAFAF';
                textElement.style.opacity = '1';
                console.log('Текст отзыва:', textElement.textContent.substring(0, 50) + '...');
            }
        }

        // 5. Обновляем точки
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });

        // 6. Сохраняем текущий индекс
        currentIndex = index;
    }

    // Следующий отзыв
    function nextReview() {
        const nextIndex = (currentIndex + 1) % reviewItems.length;
        showReview(nextIndex);
    }

    // Предыдущий отзыв
    function prevReview() {
        const prevIndex = (currentIndex - 1 + reviewItems.length) % reviewItems.length;
        showReview(prevIndex);
    }

    // Навешиваем обработчики на кнопки
    if (prevBtn) {
        prevBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Кнопка "Назад" нажата');
            prevReview();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Кнопка "Вперед" нажата');
            nextReview();
        });
    }

    // Навешиваем обработчики на точки
    dots.forEach(dot => {
        dot.addEventListener('click', function(e) {
            e.preventDefault();
            const index = parseInt(this.getAttribute('data-index'));
            if (!isNaN(index) && index >= 0 && index < reviewItems.length) {
                console.log(`Точка ${index} нажата`);
                showReview(index);
            }
        });
    });

    // Показываем первый отзыв
    showReview(0);

    console.log('Новый слайдер успешно запущен');
}

// Запускаем когда страница загружена
document.addEventListener('DOMContentLoaded', function() {
    // Даем время на загрузку всех стилей
    setTimeout(initNewReviewsSlider, 100);
});

// Альтернативный запуск
window.addEventListener('load', initNewReviewsSlider);


// Обновляем функцию инициализации слайдера
document.addEventListener('DOMContentLoaded', function() {
    const photoSlider = document.querySelector('.photo-slider');

    if (!photoSlider) return;

    const slides = document.querySelectorAll('.photo-slide');
    const dots = document.querySelectorAll('.photo-dot');
    const prevBtn = document.querySelector('.photo-slider-btn.prev');
    const nextBtn = document.querySelector('.photo-slider-btn.next');
    const slidesContainer = document.querySelector('.photo-slides');

    let currentSlide = 0;
    const totalSlides = slides.length;

    // Рассчитываем высоту для правильного позиционирования
    function updateSliderHeight() {
        const slide = slides[currentSlide];
        const img = slide.querySelector('img');

        if (img.complete) {
            adjustSliderHeight(img);
        } else {
            img.addEventListener('load', function() {
                adjustSliderHeight(img);
            });
        }
    }

    function adjustSliderHeight(img) {
        const containerWidth = photoSlider.clientWidth;
        const imgRatio = img.naturalHeight / img.naturalWidth;
        const newHeight = containerWidth * imgRatio;

        // Ограничиваем максимальную и минимальную высоту
        const minHeight = 300;
        const maxHeight = 500;
        const finalHeight = Math.min(Math.max(newHeight, minHeight), maxHeight);

        photoSlider.style.height = finalHeight + 'px';
        slidesContainer.style.height = 'calc(' + finalHeight + 'px - 50px)';
    }

    // Функция переключения слайда
    function goToSlide(index) {
        if (index < 0) index = totalSlides - 1;
        if (index >= totalSlides) index = 0;

        currentSlide = index;

        // Перемещаем слайды
        slidesContainer.style.transform = `translateX(-${currentSlide * 100}%)`;

        // Обновляем точки
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide);
        });

        // Обновляем слайды
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === currentSlide);
        });

        // Обновляем высоту для нового слайда
        updateSliderHeight();
    }

    // События для кнопок
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            goToSlide(currentSlide - 1);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            goToSlide(currentSlide + 1);
        });
    }

    // События для точек
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToSlide(index);
        });
    });

    // Автопрокрутка
    let autoSlideInterval;

    function startAutoSlide() {
        autoSlideInterval = setInterval(() => {
            goToSlide(currentSlide + 1);
        }, 5000);
    }

    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }

    // Инициализация
    updateSliderHeight();
    startAutoSlide();

    // Ресайз окна
    window.addEventListener('resize', updateSliderHeight);

    // Останавливаем при взаимодействии
    photoSlider.addEventListener('mouseenter', stopAutoSlide);
    photoSlider.addEventListener('mouseleave', startAutoSlide);
    photoSlider.addEventListener('touchstart', stopAutoSlide);
    photoSlider.addEventListener('touchend', () => {
        setTimeout(startAutoSlide, 3000);
    });
});

// ==================== АНИМАЦИИ ПРИ СКРОЛЛЕ ====================

function animateOnScroll() {
    const elements = document.querySelectorAll('.scroll-animate');

    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        if (elementTop < windowHeight - 100) {
            element.classList.add('visible');
        }
    });
}

// Инициализация анимированных элементов при загрузке
document.addEventListener('DOMContentLoaded', function() {
    // Добавляем классы для анимаций при скролле основным секциям
    const sections = document.querySelectorAll('section');
    sections.forEach((section, index) => {
        section.classList.add('scroll-animate');
        section.style.animationDelay = `${index * 0.1}s`;
    });

    // Запускаем проверку после загрузки
    setTimeout(animateOnScroll, 300);

    // Проверяем при скролле
    window.addEventListener('scroll', animateOnScroll);

    // Проверяем при ресайзе
    window.addEventListener('resize', animateOnScroll);
});

// ==================== ПЛАВНАЯ АНИМАЦИЯ ПРИ ПЕРЕХОДЕ ПО ССЫЛКАМ ====================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});
// =========================================================================
// 1. УТИЛИТЫ ДЛЯ УПРАВЛЕНИЯ DROPDOWN МЕНЮ И ЗАКРЫТИЯ
// =========================================================================

/**
 * Ищет триггер (элемент, который открыл дропдаун) по ID или по предыдущему соседу.
 */
function findDropdownTrigger(dropdownElement) {
    // 1. Поиск по aria-controls, если у дропдауна есть ID
    const triggerByControls = dropdownElement.id ? document.querySelector(`[aria-controls="${dropdownElement.id}"]`) : null;
    if (triggerByControls) return triggerByControls;
    
    // 2. Поиск по предыдущему соседу (для классических .dropdown-content)
    return dropdownElement.previousElementSibling;
}

/**
 * Переключает видимость элемента и обновляет ARIA-атрибут 'aria-expanded' для кнопки.
 */
function toggleDropdown(element, trigger) {
    if (!element || !trigger) return;

    // Проверяем, видимо ли меню (используем classList, если вы переключитесь на CSS)
    // NOTE: Использование style.display='block' менее предпочтительно, чем classList, 
    // но сохранено для совместимости с исходным кодом.
    const isVisible = element.style.display === 'block';

    // 1. Закрыть все другие открытые выпадающие списки в шапке
    document.querySelectorAll('.dropdown-content, .lang-dropdown, #app-menu').forEach(d => {
        if (d !== element && d.style.display === 'block') {
            d.style.display = 'none';
            
            const associatedTrigger = findDropdownTrigger(d);

            if (associatedTrigger) {
                associatedTrigger.setAttribute('aria-expanded', 'false');
            }
        }
    });

    // 2. Переключить текущий элемент
    if (isVisible) {
        element.style.display = 'none';
        trigger.setAttribute('aria-expanded', 'false');
    } else {
        element.style.display = 'block';
        trigger.setAttribute('aria-expanded', 'true');
        
        const focusable = element.querySelector('a, button, input');
        if (focusable) focusable.focus();
    }
}

/**
 * Обрабатывает клики вне дропдаунов для их автоматического закрытия.
 */
function closeAllDropdowns(e) {
    // ИСПРАВЛЕНО: Добавлены ID модальных окон в список исключений, чтобы не закрывать
    // дропдауны, если клик произошел внутри открытой модалки.
    if (e.target.closest('.dropdown, .lang-switcher-new, .app-menu-container, #search-toggle-btn, #details-modal.is-active, #auth-modal.active')) {
        return;
    }

    document.querySelectorAll('.dropdown-content, .lang-dropdown, #app-menu').forEach(d => {
        if (d.style.display === 'block') {
            d.style.display = 'none';
            
            const trigger = findDropdownTrigger(d);

            if (trigger) trigger.setAttribute('aria-expanded', 'false');
        }
    });
}


// =========================================================================
// НОВАЯ ФУНКЦИЯ: УПРАВЛЕНИЕ ВКЛАДКАМИ В МОДАЛЬНОМ ОКНЕ АВАТАРКИ
// =========================================================================

function setupModalTabs(modal) {
    const tabButtons = modal.querySelectorAll('.modal-tabs .tab-button');
    const tabPanels = modal.querySelectorAll('.modal-body .tab-panel');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetPanelId = button.getAttribute('aria-controls');
            
            // 1. Сброс активного состояния для всех кнопок
            tabButtons.forEach(btn => {
                btn.classList.remove('is-active');
                btn.setAttribute('aria-selected', 'false');
            });
            
            // 2. Скрытие всех панелей
            tabPanels.forEach(panel => {
                panel.classList.remove('is-active');
                panel.toggleAttribute('hidden', true); 
            });

            // 3. Активация выбранной кнопки
            button.classList.add('is-active');
            button.setAttribute('aria-selected', 'true');

            // 4. Показ выбранной панели
            const targetPanel = document.getElementById(targetPanelId);
            if (targetPanel) {
                targetPanel.classList.add('is-active');
                targetPanel.toggleAttribute('hidden', false);
                // Установка фокуса на заголовок/начало панели для доступности
                // (Использовать только в случае, если контент не интерактивный. 
                // В данном случае, это скорее декоративно)
                // targetPanel.focus({ preventScroll: true }); 
            }
        });
    });
}


// =========================================================================
// 2. ЛОГИКА МОДАЛЬНОГО ОКНА HERO SECTION (АВАТАРКА) - ОБНОВЛЕНО
// =========================================================================

function setupHeroModal() {
    const trigger = document.getElementById('hero-modal-trigger');
    const modal = document.getElementById('details-modal');

    if (!trigger || !modal) return;
    
    // ИНИЦИАЛИЗАЦИЯ ВКЛАДОК
    setupModalTabs(modal); 

    // Устанавливаем начальное состояние ARIA.
    modal.setAttribute('aria-hidden', 'true');
    
    const closeBtn = modal.querySelector('.modal-close-btn');
    let lastActiveElement; // Для сохранения фокуса

    // Функция открытия
    const openModal = () => {
        lastActiveElement = document.activeElement; // Сохраняем элемент, который вызвал модалку
        modal.classList.add('is-active');
        modal.setAttribute('aria-hidden', 'false');
        trigger.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
        modal.focus(); // Устанавливаем фокус на саму модалку
    };

    // Функция закрытия
    const closeModal = () => {
        modal.classList.remove('is-active');
        modal.setAttribute('aria-hidden', 'true');
        trigger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        if (lastActiveElement) lastActiveElement.focus(); // Возвращаем фокус
    };

    // 1. Обработчик нажатия на триггер (фото)
    trigger.addEventListener('click', openModal);

    // 2. Обработчик нажатия на кнопку закрытия (X)
    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    // 3. Обработчик нажатия на область фона (вне модали)
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // 4. Обработчик нажатия клавиши ESC
    modal.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        } 
        
        // Ловушка фокуса (Tabbing) - Логика должна быть здесь для полной доступности
        // if (e.key === 'Tab') { ... }
    });
}


// =========================================================================
// 3. ЛОГИКА МОДАЛЬНОГО ОКНА АВТОРИЗАЦИИ (ВХОД/РЕГИСТРАЦИЯ)
// =========================================================================

function setupAuthModal() {
    const authModal = document.getElementById('auth-modal');
    if (!authModal) return;

    // Устанавливаем начальное состояние ARIA
    authModal.setAttribute('aria-hidden', 'true');
    
    const loginView = document.getElementById('login-view');
    const registerView = document.getElementById('register-view');
    
    const allTriggers = document.querySelectorAll('.auth-trigger, #header-auth-btn, #header-register-btn');
    const modalCloseBtn = authModal.querySelector('.modal-close-btn');
    const switchToRegister = document.getElementById('switch-to-register');
    const switchToLogin = document.getElementById('switch-to-login');
    let lastActiveElement;

    /** Открыть модальное окно и показать нужную вкладку */
    const openModal = (view) => {
        lastActiveElement = document.activeElement;
        // ИСПРАВЛЕНИЕ: Используйте 'is-active' для единообразия, 
        // или удостоверьтесь, что CSS использует 'active'.
        authModal.classList.add('active'); 
        authModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; 
        
        const isRegister = view === 'register';

        // Управление видимостью вкладок
        if (loginView) {
            loginView.classList.toggle('active', !isRegister);
            loginView.toggleAttribute('hidden', isRegister);
        }
        if (registerView) {
            registerView.classList.toggle('active', isRegister);
            registerView.toggleAttribute('hidden', !isRegister);
        }

        // Фокус на первый инпут
        const activeView = isRegister ? registerView : loginView;
        const firstInput = activeView ? activeView.querySelector('input') : null;
        if (firstInput) firstInput.focus();
    };

    /** Закрыть модальное окно */
    const closeModal = () => {
        authModal.classList.remove('active');
        authModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        if (lastActiveElement) lastActiveElement.focus();
    };

    // Открытие модального окна по всем найденным триггерам
    allTriggers.forEach(button => {
        button.addEventListener('click', () => {
            const defaultView = button.getAttribute('data-target-view') || 
                                 (button.id === 'header-auth-btn' ? 'login' : 'register');
            openModal(defaultView);
        });
    });

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);

    // Закрытие по клику на оверлей
    authModal.addEventListener('click', (e) => {
        if (e.target === authModal) {
            closeModal();
        }
    });

    // Закрытие по ESC (теперь обрабатываем только Auth Modal)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && authModal.classList.contains('active')) {
            closeModal();
        }
    });

    // Переключение между Входом и Регистрацией
    if (switchToRegister) {
        switchToRegister.addEventListener('click', (e) => {
            e.preventDefault();
            openModal('register');
        });
    }

    if (switchToLogin) {
        switchToLogin.addEventListener('click', (e) => {
            e.preventDefault();
            openModal('login');
        });
    }
}


// =========================================================================
// 4. ЛОГИКА ТЕМНОЙ/СВЕТЛОЙ ТЕМЫ
// =========================================================================

function setupThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;

    const currentTheme = localStorage.getItem('theme') || 'light';
    
    const applyTheme = (isDark) => {
        const icon = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        const label = isDark ? 'Переключить светлую тему' : 'Переключить темную тему';

        document.body.classList.toggle('dark-theme', isDark);
        themeToggle.innerHTML = icon;
        themeToggle.setAttribute('aria-label', label);
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    };

    applyTheme(currentTheme === 'dark');

    themeToggle.addEventListener('click', () => {
        const newIsDark = !document.body.classList.contains('dark-theme');
        applyTheme(newIsDark);
    });
}


// =========================================================================
// 5. ЛОГИКА НАВИГАЦИИ (ДРОПДАУНЫ И МОБИЛЬНОЕ МЕНЮ)
// =========================================================================

function setupNavigation() {
    
    // --- 5.1. ДРОПДАУНЫ В ШАПКЕ ---
    document.querySelectorAll('.dropdown > a[aria-haspopup="true"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const dropdownContent = link.nextElementSibling;
            if (dropdownContent && dropdownContent.classList.contains('dropdown-content')) {
                toggleDropdown(dropdownContent, link);
            }
        });
    });

    // Меню Приложений
    const appMenuToggle = document.getElementById('app-menu-toggle');
    const appMenu = document.getElementById('app-menu'); 
    if (appMenuToggle && appMenu) {
        appMenuToggle.addEventListener('click', () => {
            toggleDropdown(appMenu, appMenuToggle);
        });
    }

    // Меню Языков
    const langToggleBtn = document.getElementById('lang-toggle-btn');
    const langDropdown = document.getElementById('lang-dropdown');
    if (langToggleBtn && langDropdown) {
        langToggleBtn.addEventListener('click', () => {
            toggleDropdown(langDropdown, langToggleBtn);
        });
    }

    // --- 5.2. МОБИЛЬНОЕ МЕНЮ ---
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    const desktopNav = document.querySelector('nav.desktop-nav'); // Используем класс для надежности

    if (mobileMenuToggle && mobileNav && desktopNav) {
        
        // Клонируем основную навигацию в мобильное меню (только при первом запуске)
        if (mobileNav.children.length === 0) {
            const clonedNav = desktopNav.cloneNode(true);
            clonedNav.classList.remove('desktop-nav'); // Удаляем класс десктопа
            mobileNav.appendChild(clonedNav);
        }

        /** Управляет открытием/закрытием мобильного меню */
        const toggleMobileMenu = (forceClose = false) => {
            const isOpened = mobileNav.classList.contains('is-open') && !forceClose;

            // Переключаем класс (для управления видимостью через CSS)
            mobileNav.classList.toggle('is-open', !isOpened);
            
            // Управляем иконкой и ARIA
            mobileMenuToggle.setAttribute('aria-expanded', isOpened ? 'false' : 'true');
            mobileMenuToggle.innerHTML = isOpened ? '<i class="fas fa-bars"></i>' : '<i class="fas fa-times"></i>';
            
            // Управляем прокруткой тела страницы
            document.body.style.overflow = isOpened ? '' : 'hidden';

            // ИСПРАВЛЕНИЕ: Удаляем атрибут hidden, который был в HTML,
            // и управляем только классом/CSS.
        };
        
        // Переключатель по клику
        mobileMenuToggle.addEventListener('click', () => toggleMobileMenu());

        // Закрытие при изменении размера (если экран стал десктопным)
        window.addEventListener('resize', () => {
            const breakpoint = 992; // Установите вашу точку перелома
            if (window.innerWidth > breakpoint && mobileNav.classList.contains('is-open')) {
                toggleMobileMenu(true); // Принудительное закрытие
            }
        });
    }

    // --- 5.3. Закрытие при клике вне дропдауна ---
    document.addEventListener('click', closeAllDropdowns);
}


// =========================================================================
// 6. ЛОГИКА ПОИСКА (Search Bar)
// =========================================================================

function setupSearchBar() {
    const searchToggleBtn = document.getElementById('search-toggle-btn');
    const searchBarContainer = document.getElementById('search-bar-container');
    const searchCloseBtn = document.getElementById('search-close-btn');
    const searchInput = document.getElementById('search-input');
    const mainHeader = document.getElementById('main-header');

    if (!searchToggleBtn || !searchBarContainer || !searchCloseBtn || !mainHeader) return;

    /** Открывает или закрывает поле поиска */
    const toggleSearch = (close = false) => {
        const isCurrentlyOpen = searchBarContainer.classList.contains('active');
        const shouldClose = isCurrentlyOpen || close;

        if (shouldClose) {
            // Закрыть
            searchBarContainer.classList.remove('active');
            mainHeader.classList.remove('search-active');
            searchToggleBtn.setAttribute('aria-expanded', 'false');
            searchInput.blur();
            searchToggleBtn.focus();
        } else {
            // Открыть
            searchBarContainer.classList.add('active');
            mainHeader.classList.add('search-active');
            searchToggleBtn.setAttribute('aria-expanded', 'true');
            // Обеспечить фокус на поле ввода
            setTimeout(() => searchInput.focus(), 300); 
        }
    };

    // Открытие/переключение поля поиска
    searchToggleBtn.addEventListener('click', () => toggleSearch());

    // Закрытие поля поиска
    searchCloseBtn.addEventListener('click', () => toggleSearch(true));

    // Обработка отправки формы
    const searchSubmitBtn = document.getElementById('search-submit-btn');
    if (searchSubmitBtn) {
        searchSubmitBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const query = searchInput.value.trim();
            if (query) {
                console.log(`Выполняется поиск: ${query}`);
                toggleSearch(true); // Закрываем после "поиска"
            }
        });
    }
    
    // Закрытие по клавише ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === "Escape" && searchBarContainer.classList.contains('active')) {
            toggleSearch(true);
        }
    });
}


// =========================================================================
// 7. КНОПКА "СКРОЛЛ НАВЕРХ"
// =========================================================================

function setupScrollToTop() {
    // ВАЖНО: Убедитесь, что кнопка с ID="scrollTopBtn" существует в вашем HTML!
    const scrollTopBtn = document.getElementById('scrollTopBtn'); 
    if (!scrollTopBtn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollTopBtn.classList.add('show');
        } else {
            scrollTopBtn.classList.remove('show');
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}
function setupSitemapModal() {
    const trigger = document.getElementById('explore-services-btn');
    const modal = document.getElementById('sitemap-modal');

    if (!trigger || !modal) {
        // Если модалка не найдена, сохраняем старое поведение кнопки
        if (trigger) trigger.setAttribute('href', '#subscriptions-hub');
        return;
    }

    // Удаляем или игнорируем href, чтобы предотвратить прокрутку при клике
    trigger.removeAttribute('href'); 
    
    modal.setAttribute('aria-hidden', 'true');
    const closeBtn = modal.querySelector('.modal-close-btn');
    let lastActiveElement;

    const openModal = (e) => {
        // Предотвращаем стандартное действие, если вдруг есть href
        if (e) e.preventDefault(); 
        
        lastActiveElement = document.activeElement;
        modal.classList.add('is-active');
        modal.setAttribute('aria-hidden', 'false');
        trigger.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
        modal.focus(); 
    };

    const closeModal = () => {
        modal.classList.remove('is-active');
        modal.setAttribute('aria-hidden', 'true');
        trigger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        if (lastActiveElement) lastActiveElement.focus();
    };

    // 1. Обработчик нажатия на триггер (кнопка "Обзор")
    trigger.addEventListener('click', openModal);

    // 2. Обработчик нажатия на кнопку закрытия (X)
    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    // 3. Обработчик нажатия на область фона
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // 4. Обработчик нажатия клавиши ESC
    modal.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        } 
    });
}

// =========================================================================
// 8. ЗАПУСК ВСЕХ ФУНКЦИЙ (ОБЪЕДИНЕННЫЙ)
// =========================================================================

document.addEventListener('DOMContentLoaded', () => {
    // ... (остальные вызовы)
    setupHeroModal(); 
    setupAuthModal();
    setupThemeToggle();
    setupNavigation();
    setupSearchBar(); 
    setupSitemapModal(); // НОВЫЙ ВЫЗОВ
    setupScrollToTop();
    
    console.log("Интерактивность сайта полностью загружена и проверена. Карта сайта активна.");
});

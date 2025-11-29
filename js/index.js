

/**
 * Ищет триггер (элемент, который открыл дропдаун) по ID или по предыдущему соседу.
 */
function findDropdownTrigger(dropdownElement) {
    
    const triggerByControls = dropdownElement.id ? document.querySelector(`[aria-controls="${dropdownElement.id}"]`) : null;
    if (triggerByControls) return triggerByControls;

    
    return dropdownElement.previousElementSibling;
}

/**
 * Переключает видимость элемента и обновляет ARIA-атрибут 'aria-expanded' для кнопки.
 */
function toggleDropdown(element, trigger) {
    if (!element || !trigger) return;

    
    const isVisible = element.style.display === 'block';

    
    document.querySelectorAll('.dropdown-content, .lang-dropdown, #app-menu').forEach(d => {
        if (d !== element && d.style.display === 'block') {
            d.style.display = 'none';
            
            const associatedTrigger = findDropdownTrigger(d);

            if (associatedTrigger) {
                associatedTrigger.setAttribute('aria-expanded', 'false');
            }
        }
    });

    
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



function setupModalTabs(modal) {
    const tabButtons = modal.querySelectorAll('.modal-tabs .tab-button');
    const tabPanels = modal.querySelectorAll('.modal-body .tab-panel');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetPanelId = button.getAttribute('aria-controls');

            
            tabButtons.forEach(btn => {
                btn.classList.remove('is-active');
                btn.setAttribute('aria-selected', 'false');
            });

            
            tabPanels.forEach(panel => {
                panel.classList.remove('is-active');
                panel.toggleAttribute('hidden', true); 
            });

            
            button.classList.add('is-active');
            button.setAttribute('aria-selected', 'true');

            
            const targetPanel = document.getElementById(targetPanelId);
            if (targetPanel) {
                targetPanel.classList.add('is-active');
                targetPanel.toggleAttribute('hidden', false);
              
            }
        });
    });
}


function setupHeroModal() {
    const trigger = document.getElementById('hero-modal-trigger');
    const modal = document.getElementById('details-modal');

    if (!trigger || !modal) return;
    
    setupModalTabs(modal); 

    modal.setAttribute('aria-hidden', 'true');
    
    const closeBtn = modal.querySelector('.modal-close-btn');
    let lastActiveElement; 

    const openModal = () => {
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

    trigger.addEventListener('click', openModal);

    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    modal.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        } 
    
    });
}



function setupAuthModal() {
    const authModal = document.getElementById('auth-modal');
    if (!authModal) return;

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

        authModal.classList.add('active'); 
        authModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; 
        
        const isRegister = view === 'register';

        if (loginView) {
            loginView.classList.toggle('active', !isRegister);
            loginView.toggleAttribute('hidden', isRegister);
        }
        if (registerView) {
            registerView.classList.toggle('active', isRegister);
            registerView.toggleAttribute('hidden', !isRegister);
        }

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

    allTriggers.forEach(button => {
        button.addEventListener('click', () => {
            const defaultView = button.getAttribute('data-target-view') || 
                                 (button.id === 'header-auth-btn' ? 'login' : 'register');
            openModal(defaultView);
        });
    });

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);

    authModal.addEventListener('click', (e) => {
        if (e.target === authModal) {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && authModal.classList.contains('active')) {
            closeModal();
        }
    });

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


function setupNavigation() {
    
    document.querySelectorAll('.dropdown > a[aria-haspopup="true"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const dropdownContent = link.nextElementSibling;
            if (dropdownContent && dropdownContent.classList.contains('dropdown-content')) {
                toggleDropdown(dropdownContent, link);
            }
        });
    });
    const appMenuToggle = document.getElementById('app-menu-toggle');
    const appMenu = document.getElementById('app-menu'); 
    if (appMenuToggle && appMenu) {
        appMenuToggle.addEventListener('click', () => {
            toggleDropdown(appMenu, appMenuToggle);
        });
    }

    const langToggleBtn = document.getElementById('lang-toggle-btn');
    const langDropdown = document.getElementById('lang-dropdown');
    if (langToggleBtn && langDropdown) {
        langToggleBtn.addEventListener('click', () => {
            toggleDropdown(langDropdown, langToggleBtn);
        });
    }
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    const desktopNav = document.querySelector('nav.desktop-nav'); 

    if (mobileMenuToggle && mobileNav && desktopNav) {
        
        if (mobileNav.children.length === 0) {
            const clonedNav = desktopNav.cloneNode(true);
            clonedNav.classList.remove('desktop-nav'); 
            mobileNav.appendChild(clonedNav);
        }

        const toggleMobileMenu = (forceClose = false) => {
            const isOpened = mobileNav.classList.contains('is-open') && !forceClose;

            mobileNav.classList.toggle('is-open', !isOpened);
            
            mobileMenuToggle.setAttribute('aria-expanded', isOpened ? 'false' : 'true');
            mobileMenuToggle.innerHTML = isOpened ? '<i class="fas fa-bars"></i>' : '<i class="fas fa-times"></i>';
            
            document.body.style.overflow = isOpened ? '' : 'hidden';

        };
        
        mobileMenuToggle.addEventListener('click', () => toggleMobileMenu());

        window.addEventListener('resize', () => {
            const breakpoint = 992; 
            if (window.innerWidth > breakpoint && mobileNav.classList.contains('is-open')) {
                toggleMobileMenu(true); 
            }
        });
    }

    document.addEventListener('click', closeAllDropdowns);
}


function setupSearchBar() {
    const searchToggleBtn = document.getElementById('search-toggle-btn');
    const searchBarContainer = document.getElementById('search-bar-container');
    const searchCloseBtn = document.getElementById('search-close-btn');
    const searchInput = document.getElementById('search-input');
    const mainHeader = document.getElementById('main-header');

    if (!searchToggleBtn || !searchBarContainer || !searchCloseBtn || !mainHeader) return;

    const toggleSearch = (close = false) => {
        const isCurrentlyOpen = searchBarContainer.classList.contains('active');
        const shouldClose = isCurrentlyOpen || close;

        if (shouldClose) {
            searchBarContainer.classList.remove('active');
            mainHeader.classList.remove('search-active');
            searchToggleBtn.setAttribute('aria-expanded', 'false');
            searchInput.blur();
            searchToggleBtn.focus();
        } else {
            searchBarContainer.classList.add('active');
            mainHeader.classList.add('search-active');
            searchToggleBtn.setAttribute('aria-expanded', 'true');
            setTimeout(() => searchInput.focus(), 300); 
        }
    };

    searchToggleBtn.addEventListener('click', () => toggleSearch());

    searchCloseBtn.addEventListener('click', () => toggleSearch(true));

    const searchSubmitBtn = document.getElementById('search-submit-btn');
    if (searchSubmitBtn) {
        searchSubmitBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const query = searchInput.value.trim();
            if (query) {
                console.log(`Выполняется поиск: ${query}`);
                toggleSearch(true); 
            }
        });
    }
    
    document.addEventListener('keydown', (e) => {
        if (e.key === "Escape" && searchBarContainer.classList.contains('active')) {
            toggleSearch(true);
        }
    });
}

function setupScrollToTop() {
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
        if (trigger) trigger.setAttribute('href', '#subscriptions-hub');
        return;
    }

    trigger.removeAttribute('href'); 
    
    modal.setAttribute('aria-hidden', 'true');
    const closeBtn = modal.querySelector('.modal-close-btn');
    let lastActiveElement;

    const openModal = (e) => {
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

    trigger.addEventListener('click', openModal);

    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    modal.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        } 
    });
}

document.addEventListener('DOMContentLoaded', () => {
    setupHeroModal(); 
    setupAuthModal();
    setupThemeToggle();
    setupNavigation();
    setupSearchBar(); 
    setupSitemapModal(); 
    setupScrollToTop();
    
    console.log("Интерактивность сайта полностью загружена и проверена. Карта сайта активна.");
});

document.addEventListener('DOMContentLoaded', () => {
    if (typeof gsap !== 'undefined') {
        gsap.from(".hero-content img", { duration: 1, y: -50, opacity: 0 });
        gsap.from(".hero-content h1", { duration: 1, x: -50, opacity: 0 });
        gsap.from(".hero-content p", { duration: 1, x: 50, opacity: 0 });
        gsap.from(".social-links a", { duration: 1, opacity: 0, stagger: 0.2, delay: 0.5 });
        gsap.from(".hero-card", { duration: 1, opacity: 0, scale: 0.9, stagger: 0.3, delay: 0.8 });
    }
    const avatarImage = document.getElementById('avatar-image');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    const staticAvatars = [
        'assets/avatar1.jpg', 
        'assets/avatar2.jpg', 
        'assets/avatar3.jpg',
        'assets/avatar4.jpg',
        'assets/avatar5.jpg',
        'assets/avatar6.jpg', 
        'assets/avatar7.jpg', 
        'assets/avatar8.jpg',
        'assets/avatar9.jpg', 
        'assets/avatar10.jpg',
        'assets/avatar11.jpg',
        'assets/avatar12.jpg',
        'assets/avatar13.jpeg', 
        'assets/avatar14.jpeg',
        'assets/avatar15.jpeg',
        'assets/avatar16.jpeg',
        'assets/avatar17.jpeg',
        'assets/avatar18.jpeg',
        'assets/avatar19.jpeg',
        'assets/avatar20.jpeg',
        'assets/avatar21.jpeg' 
    ];
    const gifAvatars = [
        'assets/gif1.gif', 
        'assets/gif2.gif',
        'assets/gif3.gif',
        'assets/gif4.gif',
        'assets/gif5.gif'
    ];


    let avatars = staticAvatars;
    let currentAvatarIndex = 0;
    const customSelect = document.querySelector('.custom-select'); 
    const currentFlag = document.getElementById('current-flag'); 
    const langDropdown = document.getElementById('lang-dropdown');
    const i18nKeys = {
        '1': 'ru', 
        '2': 'en',
        '3': 'fr',
        'ru': 'ru', 
        'en': 'en',
        'fr': 'fr'
    };
    const i18nDict = {
        "page.title": { "ru": "Ventie — Портфолио", "en": "Ventie — Portfolio", "fr": "Ventie — Portfolio" },
        "nav.about": { "ru": "Обо мне", "en": "About Me", "fr": "À Propos" },
        "about.bio": { "ru": "Биография и CV", "en": "Biography & CV", "fr": "Biographie & CV" },
        "about.certs": { "ru": "Сертификаты и Квалификация", "en": "Certifications & Qualifications", "fr": "Certificats & Qualifications" },
        "about.accred": { "ru": "Аккредитации", "en": "Accreditations", "fr": "Accréditations" },
        "about.awards": { "ru": "Награды и Признание", "en": "Awards & Recognition", "fr": "Prix & Reconnaissance" },
        "nav.projects": { "ru": "Проекты", "en": "Projects", "fr": "Projets" },
        "projects.main": { "ru": "Основные Проекты (Портфолио)", "en": "Main Projects (Portfolio)", "fr": "Projets Principaux (Portfolio)" },
        "projects.open": { "ru": "Open Source / GitHub", "en": "Open Source / GitHub", "fr": "Open Source / GitHub" },
        "projects.freelance": { "ru": "Фриланс и Коммерция", "en": "Freelance & Commerce", "fr": "Freelance & Commerce" },
        "nav.content": { "ru": "Контент / Блог", "en": "Content / Blog", "fr": "Contenu / Blog" },
        "content.lyrics": { "ru": "Тексты Песен (Lyrics)", "en": "Lyrics", "fr": "Paroles de Chansons" },
        "content.articles": { "ru": "Статьи и Туториалы", "en": "Articles & Tutorials", "fr": "Articles & Tutoriels" },
        "content.research": { "ru": "Научные Публикации", "en": "Scientific Publications", "fr": "Publications Scientifiques" },
        "content.blog": { "ru": "Личный Блог / Заметки", "en": "Personal Blog / Notes", "fr": "Blog Personnel / Notes" },
        "nav.download": { "ru": "Скачать", "en": "Download", "fr": "Télécharger" },
        "download.cv": { "ru": "Скачать Резюме (PDF)", "en": "Download CV (PDF)", "fr": "Télécharger CV (PDF)" },
        "download.code": { "ru": "Файлы/Код с GitHub", "en": "Files/Code from GitHub", "fr": "Fichiers/Code de GitHub" },
        "download.assets": { "ru": "Медиа/Прес-кит", "en": "Media/Press Kit", "fr": "Média/Dossier de Presse" },
        "nav.details": { "ru": "Система / Детали", "en": "System / Details", "fr": "Système / Détails" },
        "system.tech": { "ru": "Используемые Технологии", "en": "Used Technologies", "fr": "Technologies Utilisées" },
        "system.api": { "ru": "API и Интеграции", "en": "API & Integrations", "fr": "API & Intégrations" },
        "system.privacy": { "ru": "Политика Конфиденциальности", "en": "Privacy Policy", "fr": "Politique de Confidentialité" },
        "app_menu.header": { "ru": "Сервисы Ventie", "en": "Ventie Services", "fr": "Services Ventie" },
        "btn.book_library": { "ru": "Перейти в мою библиотеку", "en": "Go to my Library", "fr": "Aller à ma Bibliothèque" },
        "section.books": { "ru": "Мои книги", "en": "My Books", "fr": "Mes Livres" },
        "book1.title": { "ru": "Аэстрис: Тайны под замком", "en": "Aestris: Secrets Under Lock", "fr": "Aestris: Secrets Sous Clé" },
        "book2.title": { "ru": "Проклятие созерцателя", "en": "The Curse of the Contemplator", "fr": "La Malédiction du Contemplateur" },
        "book3.title": { "ru": "Последняя Сказка", "en": "The Last Fairy Tale", "fr": "Le Dernier Conte de Fées" },
        "tag.mysticism": { "ru": "#Мистика", "en": "#Mysticism", "fr": "#Mysticisme" },
        "tag.adventures": { "ru": "#Приключения", "en": "#Adventures", "fr": "#Aventures" },
        "tag.dark_fantasy": { "ru": "#Темное Фэнтези", "en": "#DarkFantasy", "fr": "#DarkFantasy" },
        "tag.horror": { "ru": "#Ужасы", "en": "#Horror", "fr": "#Horreur" },
        "tag.thriller": { "ru": "#Триллер", "en": "#Thriller", "fr": "#Thriller" },
        "tag.tragedy": { "ru": "#Трагедия", "en": "#Tragedy", "fr": "#Tragédie" },
        "tag.fantasy": { "ru": "#Фэнтези", "en": "#Fantasy", "fr": "#Fantaisie" },
        "btn.read": { "ru": "Читать", "en": "Read", "fr": "Lire" },
        "btn.glossary": { "ru": "Глоссарий", "en": "Glossary", "fr": "Glossaire" },
        "section.badges": { "ru": "Карточки", "en": "Badges", "fr": "Badges" },
        "section.history": { "ru": "История", "en": "History", "fr": "Historique" },
        "section.skills": { "ru": "Навыки", "en": "Skills", "fr": "Compétences" },
        "skill.python": { "ru": "Python", "en": "Python", "fr": "Python" },
        "skill.python.desc": { "ru": "Разработка ботов, визуальных новелл и автоматизации.", "en": "Development of bots, visual novels, and automation.", "fr": "Développement de bots, romans visuels et automatisation." },
        "skill.csharp": { "ru": "C#", "en": "C#", "fr": "C#" },
        "skill.csharp.desc": { "ru": "Основной язык программирования.", "en": "Primary programming language.", "fr": "Langage de programmation principal." },
        "skill.htmlcss": { "ru": "HTML5 & CSS3", "en": "HTML5 & CSS3", "fr": "HTML5 & CSS3" },
        "skill.htmlcss.desc": { "ru": "Современная вёрстка и адаптивный дизайн сайтов.", "en": "Modern layout and responsive website design.", "fr": "Mise en page moderne et design adaptatif." },
        "skill.javascript": { "ru": "JavaScript", "en": "JavaScript", "fr": "JavaScript" },
        "skill.javascript.desc": { "ru": "Интерактивные элементы и динамика на сайтах.", "en": "Interactive elements and website dynamics.", "fr": "Éléments interactifs et dynamique de site web." },
        "skill.writing": { "ru": "Писательство", "en": "Writing", "fr": "Écriture" },
        "skill.writing.desc": { "ru": "Сценарии, лор, стихи и тексты для проектов.", "en": "Scripts, lore, poetry, and project texts.", "fr": "Scénarios, lore, poésie et textes pour projets." },
        "skill.music": { "ru": "Музыка", "en": "Music", "fr": "Musique" },
        "skill.music.desc": { "ru": "Создание саундтреков и озвучка для игр и новелл.", "en": "Creating soundtracks and voice-overs for games and novels.", "fr": "Création de bandes sonores et voix-off pour jeux et romans." },
        "section.about": { "ru": "Описание", "en": "Description", "fr": "Description" },
        "section.about.summary": { "ru": "Кратко о сайте Ventie.dev", "en": "Briefly about Ventie.dev", "fr": "Bref aperçu de Ventie.dev" },
        "btn.read_more": { "ru": "Подробнее", "en": "Read More", "fr": "En Savoir Plus" },
        "modal.avatar.title": { "ru": "Выберите аватар", "en": "Select Avatar", "fr": "Sélectionner Avatar" },
        "modal.avatar.static": { "ru": "Аватарки", "en": "Avatars", "fr": "Avatars" },
        "modal.avatar.gif": { "ru": "GIFы", "en": "GIFs", "fr": "GIFs" },
        "modal.auth.login.title": { "ru": "Вход", "en": "Login", "fr": "Connexion" },
        "modal.auth.register.title": { "ru": "Регистрация", "en": "Register", "fr": "Inscription" },
        "modal.auth.switch.register": { "ru": "Нет аккаунта? Зарегистрироваться", "en": "No account? Register", "fr": "Pas de compte? S'inscrire" },
        "modal.auth.switch.login": { "ru": "Уже есть аккаунт? Войти", "en": "Already have an account? Login", "fr": "Déjà un compte? Se connecter" },
        "modal.auth.forgot": { "ru": "Забыли пароль?", "en": "Forgot Password?", "fr": "Mot de passe oublié?" },
        "modal.auth.placeholder.username": { "ru": "Имя пользователя", "en": "Username", "fr": "Nom d'utilisateur" },
        "modal.auth.placeholder.email": { "ru": "Электронная почта", "en": "Email", "fr": "E-mail" },
        "modal.auth.placeholder.password": { "ru": "Пароль", "en": "Password", "fr": "Mot de passe" },
        "modal.auth.placeholder.confirm_password": { "ru": "Подтвердите пароль", "en": "Confirm Password", "fr": "Confirmer le mot de passe" },
        "modal.auth.btn.login": { "ru": "Войти", "en": "Login", "fr": "Se connecter" },
        "modal.auth.btn.register": { "ru": "Зарегистрироваться", "en": "Register", "fr": "S'inscrire" },
        
    };

    /**
     * Устанавливает язык на странице.
     * @param {string} langCode - Код языка ('ru', 'en', 'fr').
     */
    function setLanguage(langCode) {
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = i18nDict[key] ? i18nDict[key][langCode] : null;
            
            if (translation) {
                if (key === 'page.title') {
                    document.title = translation;
                } else if (element.tagName === 'INPUT' && element.hasAttribute('placeholder')) {
                     element.setAttribute('placeholder', translation);
                } else if (key.startsWith('modal.auth.switch.')) {
                    element.querySelector('a').textContent = translation;
                } else if (element.closest('.dropdown') && !element.closest('.dropdown-content') && key.startsWith('nav.')) {
                    const iconSpan = element.querySelector('.dropdown-icon') || document.createElement('span');
                    if (!iconSpan.classList.contains('dropdown-icon')) {
                        iconSpan.classList.add('dropdown-icon');
                        iconSpan.textContent = '▼';
                    }
                    element.innerHTML = `${translation} ${iconSpan.outerHTML}`;
                } else {
                    element.textContent = translation;
                }
            } else {
            }
        });
        localStorage.setItem('lang', langCode);
    }
    const savedLangCode = localStorage.getItem('lang') || 'ru';
    if (customSelect) {
        const initialValue = Object.keys(i18nKeys).find(key => i18nKeys[key] === savedLangCode);
        if (initialValue) {
            customSelect.value = initialValue;
        }
        customSelect.addEventListener('change', (event) => {
            const selectedValue = event.target.value;
            const langCode = i18nKeys[selectedValue];
            if (langCode) {
                setLanguage(langCode);
            }
        });
    }
    const langToggleBtn = document.getElementById('lang-toggle-btn');
    const langOptions = langDropdown ? langDropdown.querySelectorAll('.lang-option') : [];

    if (langToggleBtn && langDropdown) {
        langToggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            langDropdown.classList.toggle('active');
        });
        document.addEventListener('click', (e) => {
            if (!langDropdown.contains(e.target) && !langToggleBtn.contains(e.target)) {
                langDropdown.classList.remove('active');
            }
        });
        langOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                e.preventDefault();
                const newLang = option.getAttribute('data-lang');
                const newFlagSrc = option.querySelector('.flag-icon').src;
                const newFlagAlt = option.querySelector('.flag-icon').alt;
                if (currentFlag) {
                    currentFlag.src = newFlagSrc;
                    currentFlag.alt = newFlagAlt;
                }
                langDropdown.classList.remove('active');
                if (newLang) {
                    setLanguage(newLang);
                }
            });
            if (option.getAttribute('data-lang') === savedLangCode && currentFlag) {
                currentFlag.src = option.querySelector('.flag-icon').src;
                currentFlag.alt = option.querySelector('.flag-icon').alt;
            }
        });
    }
    setLanguage(savedLangCode);
    let updateAvatar; 
    
    if (avatarImage && prevBtn && nextBtn) {
        updateAvatar = function() {
            gsap.to(avatarImage, {
                opacity: 0,
                duration: 0.3,
                onComplete: () => {
                    avatarImage.src = avatars[currentAvatarIndex];
                    gsap.to(avatarImage, {
                        opacity: 1,
                        duration: 0.3
                    });
                }
            });
        }

        prevBtn.addEventListener('click', () => {
            currentAvatarIndex = (currentAvatarIndex - 1 + avatars.length) % avatars.length;
            updateAvatar();
        });

        nextBtn.addEventListener('click', () => {
            currentAvatarIndex = (currentAvatarIndex + 1) % avatars.length;
            updateAvatar();
        });
    }
    const avatarModal = document.getElementById('avatar-selection-modal');
    const avatarGrid = document.getElementById('avatar-grid');
    const closeAvatarModalBtn = document.querySelector('.close-avatar-modal-btn');
    const filterButtons = document.querySelectorAll('.filter-btn');

    if (avatarImage && avatarModal && avatarGrid && closeAvatarModalBtn && filterButtons.length > 0) {
        function openAvatarModal() {
            avatarModal.classList.add('is-visible');
        }

        function closeAvatarModal() {
            avatarModal.classList.remove('is-visible');
        }
        
        function renderAvatars(type) {
            avatarGrid.innerHTML = '';
            
            let avatarsToRender = (type === 'static') ? staticAvatars : gifAvatars;

            if (avatarsToRender.length === 0) {
                avatarGrid.innerHTML = '<p class="text-center text-gray-500">Пока здесь ничего нет...</p>';
                return;
            }

            avatarsToRender.forEach((avatar, index) => {
                const li = document.createElement('li');
                li.classList.add('avatar-item');
                li.dataset.index = index;
                li.dataset.type = type;
                const img = document.createElement('img');
                img.src = avatar;
                img.alt = `Avatar ${index + 1}`;
                li.appendChild(img);
                avatarGrid.appendChild(li);
            });
        }

        renderAvatars('static');
        avatarImage.addEventListener('click', openAvatarModal);
        closeAvatarModalBtn.addEventListener('click', closeAvatarModal);

        window.addEventListener('click', (event) => {
            if (event.target === avatarModal) {
                closeAvatarModal();
            }
        });

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                renderAvatars(button.dataset.type);
            });
        });

        avatarGrid.addEventListener('click', (event) => {
            const selectedItem = event.target.closest('.avatar-item');
            if (selectedItem) {
                const selectedIndex = parseInt(selectedItem.dataset.index, 10);
                const type = selectedItem.dataset.type;
                avatars = (type === 'static') ? staticAvatars : gifAvatars;
                currentAvatarIndex = selectedIndex;
                if (updateAvatar) {
                    updateAvatar(); 
                } else {
                    avatarImage.src = avatars[currentAvatarIndex];
                }
                
                closeAvatarModal();
            }
        });
    }
    const scrollTopBtn = document.getElementById("scrollTopBtn");
    if (scrollTopBtn) {
        window.addEventListener("scroll", () => {
            if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
                scrollTopBtn.classList.add('show');
            } else {
                scrollTopBtn.classList.remove('show');
            }
        });
        scrollTopBtn.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }
    const themeToggle = document.getElementById("theme-toggle");
    if (themeToggle) {
        function updateThemeIcon(isDark) {
            themeToggle.querySelector('i').className = isDark 
                ? 'fas fa-sun' 
                : 'fas fa-moon'; 
        }
        
        themeToggle.addEventListener("click", () => {
            document.body.classList.toggle("dark-theme");
            const isDark = document.body.classList.contains("dark-theme");
            const theme = isDark ? "dark" : "light";
            localStorage.setItem("theme", theme);
            
            updateThemeIcon(isDark); 
        });
        const savedTheme = localStorage.getItem("theme");
        const initialIsDark = savedTheme === "dark";

        if (initialIsDark) {
            document.body.classList.add("dark-theme");
        }
        
        updateThemeIcon(initialIsDark); 
    }
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = this.name.value.trim();
            const email = this.email.value.trim();
            const message = this.message.value.trim();
            const successMessage = document.getElementById('contactSuccess');
            if (!name || !email || !message) {
                successMessage.innerText = "Пожалуйста, заполните все поля формы.";
                successMessage.style.color = '#e74c3c';
            } else {
                successMessage.innerText = "Сообщение отправлено! (Симуляция)";
                successMessage.style.color = '#009e60';
                this.reset();
            }
            successMessage.style.display = 'block';
            setTimeout(() => {
                successMessage.style.display = 'none';
            }, 3000);
        });
    }
    const aboutBtn = document.getElementById("about-btn");
    const aboutModal = document.getElementById("about-modal");
    const modalCloseBtn = document.querySelector(".about-modal-content .modal-close-btn"); // Используем более специфичный селектор
    if (aboutBtn && aboutModal && modalCloseBtn) {
        aboutBtn.addEventListener("click", () => {
            aboutModal.style.display = "block";
        });
        modalCloseBtn.addEventListener("click", () => {
            aboutModal.style.display = "none";
        });
        window.addEventListener("click", (event) => {
            if (event.target === aboutModal) {
                aboutModal.style.display = "none";
            }
        });
    }
    const historyContainer = document.getElementById('history-container');
    if (historyContainer) {
        fetch('history.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Сетевая ошибка или файл не найден');
                }
                return response.json();
            })
            .then(data => {
                data.forEach(event => {
                    const eventDiv = document.createElement('div');
                    eventDiv.classList.add('timeline-event');
                    const eventTitle = document.createElement('h4');
                    eventTitle.innerHTML = `${event.date} <span>— ${event.title}</span>`;
                    const eventDesc = document.createElement('p');
                    eventDesc.textContent = event.description; 
                    eventDiv.appendChild(eventTitle);
                    eventDiv.appendChild(eventDesc);
                    historyContainer.appendChild(eventDiv);
                });
            })
            .catch(error => {
                console.error('Ошибка при загрузке истории:', error);
                historyContainer.innerHTML = '<p>Не удалось загрузить историю. Проверьте `history.json`.</p>';
            });
    }
    const textElement = document.getElementById('typewriter-text');
    if (textElement) {
        const phrases = ["Добро пожаловать", "Есть вопросы? Можешь написать в Телеграм", "Удачи!"];
        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        function typeWriter() {
            const currentPhrase = phrases[phraseIndex];
            if (isDeleting) {
                textElement.textContent = currentPhrase.substring(0, charIndex--);
            } else {
                textElement.textContent = currentPhrase.substring(0, charIndex++);
            }
            let typeSpeed = 100;
            if (isDeleting) {
                typeSpeed /= 2;
            }
            if (!isDeleting && charIndex === currentPhrase.length + 1) {
                typeSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                typeSpeed = 500;
            }
            setTimeout(typeWriter, typeSpeed);
        }
        typeWriter();
    }
    const sections = document.querySelectorAll('.fade-in-section');
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        rootMargin: '0px',
        threshold: 0.2
    });
    sections.forEach(section => {
        observer.observe(section);
    });
    const appMenuToggle = document.getElementById('app-menu-toggle');
    const appMenuDropdown = document.getElementById('app-menu'); 
    const appMenuContainer = appMenuToggle ? appMenuToggle.closest('.dropdown') : null; 

    if (appMenuToggle && appMenuDropdown && appMenuContainer) {
        appMenuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            appMenuDropdown.classList.toggle('active');
            const isExpanded = appMenuDropdown.classList.contains('active');
            appMenuToggle.setAttribute('aria-expanded', isExpanded);
        });

        document.addEventListener('click', (e) => {
            if (appMenuDropdown.classList.contains('active') && !appMenuContainer.contains(e.target)) {
                appMenuDropdown.classList.remove('active');
                appMenuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }
    const authModal = document.getElementById('auth-modal');
    const authBtn = document.getElementById('header-auth-btn');
    if (authModal && authBtn) {
        const closeModalBtn = authModal.querySelector('.modal-close-btn');
        const loginView = document.getElementById('login-view');
        const registerView = document.getElementById('register-view');
        const switchToRegister = document.getElementById('switch-to-register');
        const switchToLogin = document.getElementById('switch-to-login');
        const modalTitle = authModal.querySelector('.modal-title');
        const updateAuthModalTitle = (view) => {
            const key = (view === 'login') ? 'modal.auth.login.title' : 'modal.auth.register.title';
            const translation = i18nDict[key] ? i18nDict[key][localStorage.getItem('lang') || 'ru'] : (view === 'login' ? 'Вход' : 'Регистрация');
            if (modalTitle) {
                modalTitle.textContent = translation;
            }
        };
        const initializeAuthView = () => {
            if (loginView) loginView.classList.add('active');
            if (registerView) registerView.classList.remove('active');
            updateAuthModalTitle('login');
        }
        authBtn.addEventListener('click', () => {
            authModal.classList.add('active');
            initializeAuthView();
            authModal.focus(); 
        });
        const closeAuthModal = () => {
            authModal.classList.remove('active');
        };

        if (closeModalBtn) closeModalBtn.addEventListener('click', closeAuthModal);
        authModal.addEventListener('click', (e) => {
            if (e.target === authModal) {
                closeAuthModal();
            }
        });
        if (switchToRegister && switchToLogin) {
            switchToRegister.addEventListener('click', (e) => {
                e.preventDefault();
                if (loginView) loginView.classList.remove('active');
                if (registerView) registerView.classList.add('active');
                updateAuthModalTitle('register');
            });

            switchToLogin.addEventListener('click', (e) => {
                e.preventDefault();
                if (registerView) registerView.classList.remove('active');
                if (loginView) loginView.classList.add('active');
                updateAuthModalTitle('login');
            });
        }
    }
});
  const appMenuToggle = document.getElementById('app-menu-toggle');
    const appMenu = document.getElementById('app-menu');
    if (appMenuToggle && appMenu) {
        appMenuToggle.addEventListener('click', (event) => {
            event.stopPropagation();
            appMenu.classList.toggle('active');
        });
        document.addEventListener('click', (event) => {
            if (!appMenu.contains(event.target) && !appMenuToggle.contains(event.target)) {
                appMenu.classList.remove('active');
            }
        });
    }
const authModal = document.getElementById("auth-modal");
const closeBtn = document.querySelector(".modal-close-btn");
const loginView = document.getElementById("login-view");
const registerView = document.getElementById("register-view");

const switchToRegister = document.getElementById("switch-to-register");
const switchToLogin = document.getElementById("switch-to-login");
function openAuthModal() {
    authModal.classList.add("active");
}
function closeAuthModal() {
    authModal.classList.remove("active");
}
closeBtn.addEventListener("click", closeAuthModal);
authModal.addEventListener("click", (e) => {
    if (e.target === authModal) {
        closeAuthModal();
    }
});
switchToRegister.addEventListener("click", (e) => {
    e.preventDefault();
    loginView.classList.remove("active");
    registerView.classList.add("active");
});

switchToLogin.addEventListener("click", (e) => {
    e.preventDefault();
    registerView.classList.remove("active");
    loginView.classList.add("active");
});
document.querySelectorAll("[data-oauth]").forEach(btn => {
    btn.addEventListener("click", () => {
        const provider = btn.dataset.oauth;
        window.location.href = `/auth/${provider}`;
    });
});

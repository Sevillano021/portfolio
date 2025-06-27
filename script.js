// Portfolio Script - Interactividad y animaciones

document.addEventListener('DOMContentLoaded', function() {
    // Variables globales
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const header = document.querySelector('.header');
    const sections = document.querySelectorAll('section[id]');
    
    // Menú hamburguesa para móviles
    function toggleMobileMenu() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : 'auto';
    }

    // Event listener para el hamburger
    if (hamburger) {
        hamburger.addEventListener('click', toggleMobileMenu);
    }

    // Cerrar menú al hacer click en un enlace
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                toggleMobileMenu();
            }
        });
    });

    // Cerrar menú al hacer click fuera de él
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('active') && 
            !navMenu.contains(e.target) && 
            !hamburger.contains(e.target)) {
            toggleMobileMenu();
        }
    });

    // Header con fondo al hacer scroll
    function handleScroll() {
        const scrolled = window.scrollY > 50;
        
        if (scrolled) {
            header.style.background = 'rgba(10, 14, 39, 0.98)';
            header.style.backdropFilter = 'blur(20px)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
        } else {
            header.style.background = 'rgba(10, 14, 39, 0.95)';
            header.style.backdropFilter = 'blur(20px)';
            header.style.boxShadow = 'none';
        }
    }

    // Navegación activa basada en scroll
    function updateActiveNavigation() {
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const correspondingNavLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (correspondingNavLink) {
                    correspondingNavLink.classList.add('active');
                }
            }
        });
    }

    // Event listeners para scroll
    window.addEventListener('scroll', () => {
        handleScroll();
        updateActiveNavigation();
    });

    // Smooth scroll para enlaces internos
    function smoothScroll(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const headerHeight = header.offsetHeight;
            const targetPosition = targetSection.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }

    // Aplicar smooth scroll a enlaces de navegación
    navLinks.forEach(link => {
        if (link.getAttribute('href').startsWith('#')) {
            link.addEventListener('click', smoothScroll);
        }
    });

    // Animaciones de entrada al hacer scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Animación especial para cards
                if (entry.target.classList.contains('project-card') || 
                    entry.target.classList.contains('service-card') ||
                    entry.target.classList.contains('about-card')) {
                    entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
                }
            }
        });
    }, observerOptions);

    // Observar elementos para animaciones
    const animatedElements = document.querySelectorAll('.project-card, .service-card, .about-card, .contact-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Manejo del formulario de contacto
    const contactForm = document.querySelector('.contact-form form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Obtener datos del formulario
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const subject = formData.get('subject');
            const message = formData.get('message');
            
            // Validación básica
            if (!name || !email || !subject || !message) {
                showNotification('Por favor, completa todos los campos.', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('Por favor, ingresa un email válido.', 'error');
                return;
            }
            
            // Simular envío (aquí integrarías con tu backend)
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            submitButton.textContent = 'Enviando...';
            submitButton.disabled = true;
            
            setTimeout(() => {
                showNotification('¡Mensaje enviado con éxito! Te contactaré pronto.', 'success');
                this.reset();
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }, 2000);
        });
    }

    // Función para validar email
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Sistema de notificaciones
    function showNotification(message, type = 'info') {
        // Crear elemento de notificación
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">
                    ${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}
                </span>
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        // Estilos inline para la notificación
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 400px;
            font-family: var(--font-primary);
        `;
        
        // Agregar al DOM
        document.body.appendChild(notification);
        
        // Animar entrada
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Manejar cierre
        const closeButton = notification.querySelector('.notification-close');
        closeButton.addEventListener('click', () => {
            removeNotification(notification);
        });
        
        // Auto-remover después de 5 segundos
        setTimeout(() => {
            if (document.body.contains(notification)) {
                removeNotification(notification);
            }
        }, 5000);
    }

    function removeNotification(notification) {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }

    // Efecto parallax sutil en el hero
    function handleParallax() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        const parallaxSpeed = 0.5;
        
        if (hero && scrolled < hero.offsetHeight) {
            hero.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
        }
    }

    // Aplicar parallax solo en pantallas grandes
    if (window.innerWidth > 768) {
        window.addEventListener('scroll', handleParallax);
    }

    // Animación de typing para el título principal
    function typeWriter() {
        const title = document.querySelector('.main-title');
        if (!title) return;
        
        const text = title.textContent;
        title.textContent = '';
        title.style.borderRight = '2px solid var(--primary-color)';
        
        let i = 0;
        const timer = setInterval(() => {
            title.textContent += text[i];
            i++;
            
            if (i >= text.length) {
                clearInterval(timer);
                setTimeout(() => {
                    title.style.borderRight = 'none';
                }, 1000);
            }
        }, 100);
    }

    // Iniciar animación de typing después de un delay
    setTimeout(typeWriter, 1000);

    // Lazy loading para imágenes (si las tienes)
    function lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }

    lazyLoadImages();

    // Detectar preferencias de motion reducido
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (prefersReducedMotion.matches) {
        // Desactivar animaciones complejas para usuarios que prefieren menos movimiento
        document.documentElement.style.setProperty('--transition', 'none');
        document.documentElement.style.setProperty('--transition-fast', 'none');
    }

    // Manejar resize de ventana
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            // Cerrar menú móvil si está abierto al cambiar a desktop
            if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
                toggleMobileMenu();
            }
        }, 250);
    });

    // Debug: Log de inicialización
    console.log('Portfolio script loaded successfully! 🚀');
});

// Función para cambiar tema (para futura implementación)
function toggleTheme() {
    const body = document.body;
    body.classList.toggle('light-theme');
    
    const isDark = !body.classList.contains('light-theme');
    localStorage.setItem('dark-theme', isDark);
}

// Cargar preferencia de tema guardada
function loadThemePreference() {
    const savedTheme = localStorage.getItem('dark-theme');
    if (savedTheme === 'false') {
        document.body.classList.add('light-theme');
    }
}

// Cargar tema al iniciar
loadThemePreference();

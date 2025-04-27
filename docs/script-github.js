// Custom cursor effect
function initCustomCursor() {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);

    let cursorX = 0;
    let cursorY = 0;
    let targetX = 0;
    let targetY = 0;

    document.addEventListener('mousemove', (e) => {
        targetX = e.clientX;
        targetY = e.clientY;
    });

    function updateCursor() {
        const dx = targetX - cursorX;
        const dy = targetY - cursorY;
        
        cursorX += dx * 0.1;
        cursorY += dy * 0.1;
        
        cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
        requestAnimationFrame(updateCursor);
    }
    
    updateCursor();
}

// Initialize Tableau dashboards with loading animation
function initTableauDashboards() {
    const dashboardConfigs = {
        'customer-dashboard': {
            url: 'YOUR_CUSTOMER_DASHBOARD_URL',
            options: { hideTabs: true, hideToolbar: true, width: '100%', height: '100%' }
        },
        'product-dashboard': {
            url: 'YOUR_PRODUCT_DASHBOARD_URL',
            options: { hideTabs: true, hideToolbar: true, width: '100%', height: '100%' }
        },
        'regional-dashboard': {
            url: 'YOUR_REGIONAL_DASHBOARD_URL',
            options: { hideTabs: true, hideToolbar: true, width: '100%', height: '100%' }
        }
    };

    Object.entries(dashboardConfigs).forEach(([id, config]) => {
        const container = document.getElementById(id);
        if (container) {
            const loadingAnimation = createLoadingAnimation();
            container.appendChild(loadingAnimation);
            
            try {
                new tableau.Viz(container, config.url, config.options);
            } catch (error) {
                console.error(`Error initializing dashboard ${id}:`, error);
                container.innerHTML = createErrorMessage();
            }
        }
    });
}

function createLoadingAnimation() {
    const loader = document.createElement('div');
    loader.className = 'dashboard-loader';
    loader.innerHTML = '<div class="loader-circle"></div>';
    return loader;
}

function createErrorMessage() {
    return `
        <div class="error-message">
            <span class="error-icon">⚠️</span>
            <p>Unable to load dashboard</p>
            <button onclick="retryLoading(this)">Retry</button>
        </div>
    `;
}

// Enhanced smooth scroll with custom easing
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const navHeight = document.querySelector('.nav-github').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
                
                customScrollTo(targetPosition, 1000);
            }
        });
    });
}

function customScrollTo(to, duration) {
    const start = window.pageYOffset;
    const change = to - start;
    let currentTime = 0;
    const increment = 20;

    function easeInOutQuart(t) {
        return t < .5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
    }

    function animateScroll() {
        currentTime += increment;
        const val = easeInOutQuart(currentTime / duration);
        window.scrollTo(0, start + change * val);
        
        if (currentTime < duration) {
            requestAnimationFrame(animateScroll);
        }
    }
    
    animateScroll();
}

// Navigation behavior
function initNavigation() {
    const nav = document.querySelector('.nav-github');
    const navLinks = document.querySelectorAll('.nav-link');
    let lastScroll = 0;
    let isScrolling = false;

    // Scroll handling with throttling
    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            window.requestAnimationFrame(() => {
                const currentScroll = window.pageYOffset;
                
                // Auto-hide navigation
                if (currentScroll > lastScroll && currentScroll > 100) {
                    nav.style.transform = 'translateY(-100%)';
                } else {
                    nav.style.transform = 'translateY(0)';
                }
                
                // Update active section
                updateActiveSection();
                
                lastScroll = currentScroll;
                isScrolling = false;
            });
            isScrolling = true;
        }
    });

    function updateActiveSection() {
        const sections = document.querySelectorAll('section');
        const scrollPosition = window.pageYOffset;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${section.id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
}

// Section animations with custom transitions
function initSectionAnimations() {
    const sections = document.querySelectorAll('.section-github');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateSection(entry.target);
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '-50px'
    });

    sections.forEach(section => observer.observe(section));
}

function animateSection(section) {
    const elements = section.querySelectorAll('.section-header, .text-content, .dashboard-container');
    
    elements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = `translateY(30px) scale(0.95)`;
        
        setTimeout(() => {
            el.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0) scale(1)';
        }, index * 150);
    });
}

// Parallax effect for header
function initParallax() {
    const header = document.querySelector('.header-github');
    const title = document.querySelector('.main-title');
    const badge = document.querySelector('.project-badge');
    const techStack = document.querySelector('.tech-stack');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        if (scrolled < window.innerHeight) {
            title.style.transform = `translateY(${scrolled * 0.3}px)`;
            badge.style.transform = `translateY(${scrolled * 0.2}px)`;
            techStack.style.transform = `translateY(${scrolled * 0.1}px)`;
        }
    });
}

// Stars background animation
function initStarsAnimation() {
    const stars = document.querySelector('.stars');
    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 20;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 20;
        
        stars.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    });
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    initCustomCursor();
    initTableauDashboards();
    initSmoothScroll();
    initNavigation();
    initSectionAnimations();
    initParallax();
    initStarsAnimation();
}); 
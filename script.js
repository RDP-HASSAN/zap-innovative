// ========================================
// ZapInnovative - JavaScript
// Interactive Features & Form Validation
// ========================================

// ========================================
// DOM Elements
// ========================================
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const contactForm = document.getElementById('contactForm');
const successMessage = document.getElementById('successMessage');
const closeSuccess = document.getElementById('closeSuccess');
const scrollTopBtn = document.getElementById('scrollTop');
const themeToggle = document.getElementById('themeToggle');

// ========================================
// Theme Toggle (Day/Night Mode)
// ========================================
// Check for saved theme preference or default to dark theme
const currentTheme = localStorage.getItem('theme') || 'dark';

// Apply theme on page load
if (currentTheme === 'light') {
    document.body.classList.add('light-theme');
}

// Theme toggle functionality
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');

    // Save preference to localStorage
    const theme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
    localStorage.setItem('theme', theme);

    // Add animation effect
    themeToggle.style.transform = 'rotate(360deg)';
    setTimeout(() => {
        themeToggle.style.transform = '';
    }, 300);
});

// ========================================
// Navigation Scroll Effect
// ========================================
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    // Add scrolled class for navbar styling
    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Show/hide scroll to top button
    if (currentScroll > 300) {
        scrollTopBtn.classList.add('show');
    } else {
        scrollTopBtn.classList.remove('show');
    }

    lastScroll = currentScroll;
});

// ========================================
// Mobile Menu Toggle
// ========================================
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// ========================================
// Smooth Scroll for Anchor Links
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));

        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ========================================
// Scroll to Top Button
// ========================================
scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ========================================
// Form Validation
// ========================================

// Validation patterns
const patterns = {
    name: /^[a-zA-Z\s]{2,50}$/,
    phone: /^[6-9]\d{9}$/,  // Indian phone number format
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
};

// Error messages
const errorMessages = {
    name: 'Please enter a valid name (2-50 characters, letters only)',
    phone: 'Please enter a valid 10-digit Indian phone number',
    service: 'Please select a service'
};

// Validate individual field
function validateField(field) {
    const fieldName = field.name;
    const fieldValue = field.value.trim();
    const errorElement = document.getElementById(`${fieldName}Error`);

    // Reset error state
    field.classList.remove('error');
    errorElement.classList.remove('show');
    errorElement.textContent = '';

    // Check if field is empty
    if (!fieldValue && field.hasAttribute('required')) {
        field.classList.add('error');
        errorElement.textContent = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
        errorElement.classList.add('show');
        return false;
    }

    // Validate against pattern if exists
    if (fieldValue && patterns[fieldName]) {
        if (!patterns[fieldName].test(fieldValue)) {
            field.classList.add('error');
            errorElement.textContent = errorMessages[fieldName];
            errorElement.classList.add('show');
            return false;
        }
    }

    // Special validation for select
    if (field.tagName === 'SELECT' && !fieldValue) {
        field.classList.add('error');
        errorElement.textContent = errorMessages[fieldName];
        errorElement.classList.add('show');
        return false;
    }

    return true;
}

// Add real-time validation on blur
const formFields = contactForm.querySelectorAll('input[required], select[required]');
formFields.forEach(field => {
    field.addEventListener('blur', () => {
        validateField(field);
    });

    // Remove error on input
    field.addEventListener('input', () => {
        if (field.classList.contains('error')) {
            field.classList.remove('error');
            const errorElement = document.getElementById(`${field.name}Error`);
            errorElement.classList.remove('show');
        }
    });
});

// ========================================
// Form Submission
// ========================================
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Validate all fields
    let isValid = true;
    formFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });

    // If form is valid, show success message
    if (isValid) {
        // Get form data
        const formData = {
            name: document.getElementById('name').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            service: document.getElementById('service').value,
            message: document.getElementById('message').value.trim()
        };

        // Log form data (in production, this would be sent to a server)
        console.log('Form submitted with data:', formData);

        // Show success message
        successMessage.classList.add('show');

        // Reset form
        contactForm.reset();

        // Optional: Send data to server
        // sendFormData(formData);
    } else {
        // Scroll to first error
        const firstError = contactForm.querySelector('.error');
        if (firstError) {
            const offsetTop = firstError.offsetTop - 100;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }
});

// Close success message
closeSuccess.addEventListener('click', () => {
    successMessage.classList.remove('show');
});

// ========================================
// Intersection Observer for Animations
// ========================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe service cards
const serviceCards = document.querySelectorAll('.service-card');
serviceCards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = `all 0.6s ease ${index * 0.1}s`;
    observer.observe(card);
});

// Observe about features
const featureItems = document.querySelectorAll('.feature-item');
featureItems.forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateX(-30px)';
    item.style.transition = `all 0.6s ease ${index * 0.1}s`;
    observer.observe(item);
});

// Observe why choose items
const chooseItems = document.querySelectorAll('.choose-item');
chooseItems.forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'scale(0.9)';
    item.style.transition = `all 0.5s ease ${index * 0.05}s`;
    observer.observe(item);
});

// ========================================
// Active Navigation Link on Scroll
// ========================================
const sections = document.querySelectorAll('section[id]');

function highlightNavigation() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (navLink) {
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLink.style.color = 'var(--neon-blue)';
            } else {
                navLink.style.color = '';
            }
        }
    });
}

window.addEventListener('scroll', highlightNavigation);

// ========================================
// Parallax Effect for Hero Section
// ========================================
const heroVisual = document.querySelector('.hero-visual');

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const rate = scrolled * 0.3;

    if (heroVisual && scrolled < window.innerHeight) {
        heroVisual.style.transform = `translateY(${rate}px)`;
    }
});

// ========================================
// Dynamic Stats Counter Animation
// ========================================
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16); // 60fps
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Trigger counter animation when stats are visible
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const text = stat.textContent;
                const number = parseInt(text.replace(/\D/g, ''));
                if (number && !stat.classList.contains('animated')) {
                    stat.classList.add('animated');
                    animateCounter(stat, number, 1500);
                    // Re-add the suffix after animation
                    setTimeout(() => {
                        stat.textContent = text;
                    }, 1500);
                }
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
    statsObserver.observe(heroStats);
}

// ========================================
// Prevent Form Resubmission on Refresh
// ========================================
if (window.history.replaceState) {
    window.history.replaceState(null, null, window.location.href);
}

// ========================================
// Enhanced 3D Laptop Interaction
// ========================================
const laptopContainer = document.querySelector('.laptop-container');

if (laptopContainer) {
    // Mouse move effect for 3D laptop
    document.addEventListener('mousemove', (e) => {
        if (window.innerWidth > 768) {
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;

            const rotateY = (mouseX - 0.5) * 20;
            const rotateX = (mouseY - 0.5) * -20;

            laptopContainer.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
        }
    });

    // Reset on mouse leave
    document.addEventListener('mouseleave', () => {
        if (window.innerWidth > 768) {
            laptopContainer.style.transform = '';
        }
    });
}

// ========================================
// Service Card Click to Contact
// ========================================
const serviceCtas = document.querySelectorAll('.service-cta');
serviceCtas.forEach(cta => {
    cta.addEventListener('click', (e) => {
        e.preventDefault();

        // Get the service title
        const serviceCard = cta.closest('.service-card');
        const serviceTitle = serviceCard.querySelector('.service-title').textContent;

        // Pre-select the service in the form
        const serviceSelect = document.getElementById('service');
        const serviceValue = serviceTitle.toLowerCase().replace(/\s+/g, '-');

        // Find matching option
        const options = Array.from(serviceSelect.options);
        const matchingOption = options.find(option =>
            option.value.toLowerCase().includes(serviceValue.split('-')[0])
        );

        if (matchingOption) {
            serviceSelect.value = matchingOption.value;
        }

        // Scroll to contact form
        const contactSection = document.getElementById('contact');
        const offsetTop = contactSection.offsetTop - 80;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });

        // Focus on name field after scroll
        setTimeout(() => {
            document.getElementById('name').focus();
        }, 800);
    });
});

// ========================================
// Phone Number Formatting
// ========================================
const phoneInput = document.getElementById('phone');

phoneInput.addEventListener('input', (e) => {
    // Remove non-numeric characters
    let value = e.target.value.replace(/\D/g, '');

    // Limit to 10 digits
    if (value.length > 10) {
        value = value.slice(0, 10);
    }

    e.target.value = value;
});

// ========================================
// Lazy Loading for Performance
// ========================================
if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.dataset.src;
    });
} else {
    // Fallback for browsers that don't support lazy loading
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
}

// ========================================
// Console Welcome Message
// ========================================
console.log('%c⚡ ZapInnovative', 'font-size: 24px; font-weight: bold; color: #0ea5e9;');
console.log('%cSmart IT Solutions at Your Doorstep', 'font-size: 14px; color: #22d3ee;');
console.log('%cWebsite developed with ❤️ using Vanilla JavaScript', 'font-size: 12px; color: #a3a3a3;');

// ========================================
// Performance Monitoring (Development)
// ========================================
if (window.performance) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = window.performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log(`%cPage Load Time: ${pageLoadTime}ms`, 'color: #22d3ee; font-weight: bold;');
        }, 0);
    });
}

// ========================================
// Accessibility: Keyboard Navigation
// ========================================
document.addEventListener('keydown', (e) => {
    // Close mobile menu with Escape key
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Close success message with Escape key
    if (e.key === 'Escape' && successMessage.classList.contains('show')) {
        successMessage.classList.remove('show');
    }
});

// ========================================
// Initialize on DOM Load
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('ZapInnovative website loaded successfully!');

    // Add loaded class to body for CSS animations
    document.body.classList.add('loaded');

    // Trigger initial navigation highlight
    highlightNavigation();
});

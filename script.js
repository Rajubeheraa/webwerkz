// DOM Elements
const navbar = document.querySelector('.navbar');
const mobileMenubtn = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// 1. Navbar Scroll Effect (Glassmorphism on scroll)
window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// 2. Mobile Menu Toggle
if (mobileMenubtn) {
    mobileMenubtn.addEventListener('click', () => {
        mobileMenubtn.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    });
}

// Close mobile menu when a link is clicked
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenubtn.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('no-scroll');
    });
});

// 3. Scroll Reveal Animations (Intersection Observer)
const revealElements = document.querySelectorAll('.scroll-reveal, .fade-up, .reveal-left, .reveal-right, .reveal-zoom');

const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target); // Only animate once
        }
    });
}, {
    root: null,
    threshold: 0.1, // Trigger when 10% visible
    rootMargin: "0px 0px -50px 0px"
});

revealElements.forEach(el => revealObserver.observe(el));

// 4. Hero Typing Effect
const heroTitleSpan = document.querySelector('.hero-title .gradient-text');
if (heroTitleSpan) {
    const words = ["Powerful Websites", "Creative Designs", "Digital Brands", "Premium UI/UX"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function typeEffect() {
        const currentWord = words[wordIndex];

        if (isDeleting) {
            heroTitleSpan.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 50;
        } else {
            heroTitleSpan.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 150;
        }

        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            typeSpeed = 2000; // Pause at end
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeSpeed = 500;
        }

        setTimeout(typeEffect, typeSpeed);
    }

    // Initialize typing effect after a small delay
    setTimeout(typeEffect, 1000);
}

// 5. Smooth Scroll for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#' || targetId === '') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const headerOffset = 80;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
    });
});

// 6. Particle Mouse Movement (Parallax)
document.addEventListener('mousemove', (e) => {
    const shapes = document.querySelectorAll('.shape');
    // Guard against missing shapes
    if (shapes.length === 0) return;

    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;

    shapes.forEach((shape, index) => {
        const speed = (index + 1) * 20;
        const xOffset = (window.innerWidth / 2 - e.clientX) / speed;
        const yOffset = (window.innerHeight / 2 - e.clientY) / speed;

        // Apply smooth transition via CSS, so just set transform
        shape.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
    });
});


// 7. Tech Marquee Pause on Hover (handled in CSS mostly, but ensuring JS doesn't interfere)
const techMarquee = document.querySelector('.tech-marquee');
if (techMarquee) {
    techMarquee.addEventListener('mouseenter', () => {
        techMarquee.style.animationPlayState = 'paused';
    });
    techMarquee.addEventListener('mouseleave', () => {
        techMarquee.style.animationPlayState = 'running';
    });
}

// 8. Contact Form Handling (EmailJS)
const contactForm = document.querySelector('.contact-form');
const submitBtn = document.getElementById('submit-btn');
const formStatus = document.getElementById('form-status');

if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Basic Validation
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const number = document.getElementById('number').value.trim();
        const message = document.getElementById('message').value.trim();

        if (!name || !email || !number || !message) {
            showStatus('Please fill in all fields.', 'error');
            return;
        }

        // Loading State
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        // formStatus.textContent = '';
        // formStatus.className = 'form-status';

        // EmailJS Send
        const serviceID = 'service_16itptf';
        const templateID = 'template_xv6km13';

        const templateParams = {
            name: name,
            email: email,
            number: number,
            message: message,
            to_email: 'raju.7032.r@gmail.com'
        };

        emailjs.send(serviceID, templateID, templateParams)
            .then((response) => {
                showStatus('Message sent successfully! We will contact you soon.', 'success');
                contactForm.reset();
            })
            .catch((err) => {
                console.error('EmailJS FAILED...', err);
                showStatus('Email service failed. Opening your default email client...', 'error');

                // Mailto Fallback
                const subject = `New Contact Request from ${name}`;
                const body = `Name: ${name}\nEmail: ${email}\nPhone: ${number}\nMessage: ${message}`;
                const mailtoLink = `mailto:raju.7032.r@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

                setTimeout(() => {
                    window.location.href = mailtoLink;
                }, 1500);
            })
            .finally(() => {
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            });
    });
}

function showStatus(message, type) {
    if (formStatus) {
        formStatus.textContent = message;
        formStatus.className = `form-status ${type}`;

        // Style for status (can be moved to CSS)
        formStatus.style.padding = "10px";
        formStatus.style.marginTop = "15px";
        formStatus.style.borderRadius = "8px";

        if (type === 'success') {
            formStatus.style.backgroundColor = "rgba(40, 167, 69, 0.2)";
            formStatus.style.color = "#28a745";
            formStatus.style.border = "1px solid #28a745";

            // Auto clear success message
            setTimeout(() => {
                formStatus.textContent = '';
                formStatus.className = 'form-status';
                formStatus.style.padding = "0";
                formStatus.style.border = "none";
            }, 5000);
        } else {
            formStatus.style.backgroundColor = "rgba(220, 53, 69, 0.2)";
            formStatus.style.color = "#dc3545";
            formStatus.style.border = "1px solid #dc3545";
        }
    }
}

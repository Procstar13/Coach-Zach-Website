// Smooth scrolling function
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Mobile navigation toggle
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });
    
    // Form handling
    const contactForm = document.getElementById('contactForm');
    console.log('Contact form found:', !!contactForm);
    if (contactForm) {
        console.log('Attaching contact form submit listener');
        contactForm.addEventListener('submit', handleFormSubmit);
        
        // Also add click listener to submit button for debugging
        const submitButton = contactForm.querySelector('button[type="submit"]');
        if (submitButton) {
            console.log('Contact form submit button found');
            submitButton.addEventListener('click', function() {
                console.log('Contact form submit button clicked');
                
                // Check form validation state
                console.log('Form valid:', contactForm.checkValidity());
                console.log('Form validation message:', contactForm.validationMessage);
                
                // Check individual field values
                const nameField = contactForm.querySelector('#name');
                const emailField = contactForm.querySelector('#email');
                const playerNameField = contactForm.querySelector('#playerName');
                const playerAgeField = contactForm.querySelector('#playerAge');
                
                console.log('Field values:', {
                    name: nameField?.value,
                    email: emailField?.value,
                    playerName: playerNameField?.value,
                    playerAge: playerAgeField?.value
                });
                
                console.log('Field validity:', {
                    name: nameField?.validity?.valid,
                    email: emailField?.validity?.valid,
                    playerName: playerNameField?.validity?.valid,
                    playerAge: playerAgeField?.validity?.valid
                });
                
                // Test form submission manually if form is valid
                if (contactForm.checkValidity()) {
                    console.log('Form is valid, testing manual submission...');
                    // Create a fake event to test our handler
                    const fakeEvent = {
                        preventDefault: () => console.log('preventDefault called'),
                        target: contactForm
                    };
                    handleFormSubmit(fakeEvent);
                }
            });
        } else {
            console.log('Contact form submit button not found');
        }
        
        // Test form submission handler manually
        console.log('Testing form submission handler...');
        const testEvent = { preventDefault: () => console.log('preventDefault called') };
        const testForm = { 
            target: contactForm,
            querySelector: (selector) => contactForm.querySelector(selector)
        };
        console.log('Form submission handler test completed');
    } else {
        console.log('Contact form not found!');
    }
    
    // Add scroll effect to navbar
    window.addEventListener('scroll', handleNavbarScroll);
});

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();
    
    console.log('Contact form submission started');
    
    // Get form data
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    console.log('Contact form data:', data);
    
    // Basic validation
    if (!data.name || !data.email || !data.playerName || !data.playerAge) {
        console.log('Contact form validation failed - missing required fields');
        showMessage('Please fill in all required fields.', 'error');
        return;
    }
    
    console.log('Contact form validation passed, sending request to /api/send-email');
    
    // Show loading state
    const submitButton = e.target.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
    // Send to our API endpoint
    fetch('/api/send-email', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        console.log('Contact form response received:', response.status, response.statusText);
        return response.json();
    })
    .then(result => {
        console.log('Contact form response data:', result);
        if (result.message === 'Email sent successfully') {
            showMessage('Thank you for your message! We will get back to you within 24 hours.', 'success');
            e.target.reset();
        } else {
            throw new Error(result.message || 'Failed to send message');
        }
    })
    .catch(error => {
        console.error('Contact form error:', error);
        showMessage('Sorry, there was an error sending your message. Please try again or call us directly.', 'error');
    })
    .finally(() => {
        // Reset button state
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    });
}

// Show message to user
function showMessage(message, type = 'info') {
    // Remove existing messages
    const existingMessage = document.querySelector('.message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${type}`;
    messageDiv.textContent = message;
    
    // Style the message
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        max-width: 400px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    // Set background color based on type
    if (type === 'success') {
        messageDiv.style.backgroundColor = '#16a34a';
    } else if (type === 'error') {
        messageDiv.style.backgroundColor = '#dc2626';
    } else {
        messageDiv.style.backgroundColor = '#3b82f6';
    }
    
    // Add to page
    document.body.appendChild(messageDiv);
    
    // Animate in
    setTimeout(() => {
        messageDiv.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        messageDiv.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 300);
    }, 5000);
}

// Handle navbar scroll effect
function handleNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

// Add CSS for mobile menu and scroll effects
const additionalCSS = `
    .nav-menu.active {
        display: flex !important;
        flex-direction: column;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        border-top: 1px solid #e5e7eb;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        padding: 1rem;
    }
    
    .nav-toggle.active span:nth-child(1) {
        transform: rotate(-45deg) translate(-5px, 6px);
    }
    
    .nav-toggle.active span:nth-child(2) {
        opacity: 0;
    }
    
    .nav-toggle.active span:nth-child(3) {
        transform: rotate(45deg) translate(-5px, -6px);
    }
    
    .navbar.scrolled {
        background: rgba(255, 255, 255, 0.98);
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    
    @media (max-width: 768px) {
        .nav-menu {
            display: none;
        }
        
        .nav-menu.active {
            display: flex !important;
        }
    }
`;

// Inject additional CSS
const style = document.createElement('style');
style.textContent = additionalCSS;
document.head.appendChild(style);

// Example function for sending to Formspree (uncomment and configure when ready)
/*
function sendToFormspree(data) {
    fetch('https://formspree.io/f/YOUR_FORM_ID', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}
*/

// Add loading animation for buttons
document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Add loading state
            const originalText = this.textContent;
            this.textContent = 'Loading...';
            this.disabled = true;
            
            // Reset after a short delay (remove this in production)
            setTimeout(() => {
                this.textContent = originalText;
                this.disabled = false;
            }, 1000);
        });
    });
});

// Add intersection observer for animations
document.addEventListener('DOMContentLoaded', function() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe all sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        observer.observe(section);
    });
});

// Add CSS for animations
const animationCSS = `
    section {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    section.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .service-card {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .services-grid:hover .service-card {
        opacity: 1;
        transform: translateY(0);
    }
    
    .service-card:nth-child(1) { transition-delay: 0.1s; }
    .service-card:nth-child(2) { transition-delay: 0.2s; }
    .service-card:nth-child(3) { transition-delay: 0.3s; }
`;

// Inject animation CSS
const animationStyle = document.createElement('style');
animationStyle.textContent = animationCSS;
document.head.appendChild(animationStyle);

// Calendly fallback detection
document.addEventListener('DOMContentLoaded', function() {
    // Check if Calendly widget loads properly
    setTimeout(() => {
        const calendlyWidget = document.querySelector('.calendly-inline-widget iframe');
        const fallback = document.getElementById('calendly-fallback');
        
        if (!calendlyWidget && fallback) {
            // If no Calendly iframe is found after 3 seconds, show fallback
            fallback.style.display = 'block';
        }
    }, 3000);
}); 
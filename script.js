// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Gallery Filter Functionality
document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            galleryItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                    item.style.animation = 'fadeInUp 0.6s ease-out';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
});

// Form Validation and Submission
document.addEventListener('DOMContentLoaded', function() {
    const bookingForm = document.getElementById('bookingForm');
    const contactForm = document.getElementById('contactForm');
    
    // Booking Form Submission
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Validate required fields
            const requiredFields = ['fullName', 'email', 'phone', 'service', 'date', 'time', 'location'];
            let isValid = true;
            
            requiredFields.forEach(field => {
                const input = document.getElementById(field);
                if (!data[field] || data[field].trim() === '') {
                    showFieldError(input, 'This field is required');
                    isValid = false;
                } else {
                    clearFieldError(input);
                }
            });
            
            // Email validation
            if (data.email && !isValidEmail(data.email)) {
                showFieldError(document.getElementById('email'), 'Please enter a valid email address');
                isValid = false;
            }
            
            // Phone validation
            if (data.phone && !isValidPhone(data.phone)) {
                showFieldError(document.getElementById('phone'), 'Please enter a valid phone number');
                isValid = false;
            }
            
            // Date validation (not in the past)
            if (data.date && new Date(data.date) < new Date().setHours(0,0,0,0)) {
                showFieldError(document.getElementById('date'), 'Please select a future date');
                isValid = false;
            }
            
            if (isValid) {
                // Create WhatsApp message
                const message = createBookingWhatsAppMessage(data);
                const whatsappUrl = `https://wa.me/2347040023236?text=${encodeURIComponent(message)}`;
                
                // Show success message
                showMessage('Booking request prepared! You will be redirected to WhatsApp to send your booking details.', 'success');
                
                // Redirect to WhatsApp after a short delay
                setTimeout(() => {
                    window.open(whatsappUrl, '_blank');
                }, 2000);
                
                // Reset form
                this.reset();
            }
        });
    }
    
    // Contact Form Submission
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Validate required fields
            const requiredFields = ['contactName', 'contactEmail', 'subject', 'message'];
            let isValid = true;
            
            requiredFields.forEach(field => {
                const input = document.getElementById(field);
                if (!data[field] || data[field].trim() === '') {
                    showFieldError(input, 'This field is required');
                    isValid = false;
                } else {
                    clearFieldError(input);
                }
            });
            
            // Email validation
            if (data.contactEmail && !isValidEmail(data.contactEmail)) {
                showFieldError(document.getElementById('contactEmail'), 'Please enter a valid email address');
                isValid = false;
            }
            
            if (isValid) {
                // Create WhatsApp message
                const message = createContactWhatsAppMessage(data);
                const whatsappUrl = `https://wa.me/2347040023236?text=${encodeURIComponent(message)}`;
                
                // Show success message
                showMessage('Message prepared! You will be redirected to WhatsApp to send your message.', 'success');
                
                // Redirect to WhatsApp after a short delay
                setTimeout(() => {
                    window.open(whatsappUrl, '_blank');
                }, 2000);
                
                // Reset form
                this.reset();
            }
        });
    }
});

// Helper Functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
}

function showFieldError(input, message) {
    clearFieldError(input);
    
    input.style.borderColor = '#ef4444';
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.style.color = '#ef4444';
    errorDiv.style.fontSize = '14px';
    errorDiv.style.marginTop = '4px';
    errorDiv.textContent = message;
    
    input.parentNode.appendChild(errorDiv);
}

function clearFieldError(input) {
    input.style.borderColor = '';
    const existingError = input.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

function showMessage(message, type) {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.message');
    existingMessages.forEach(msg => msg.remove());
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    
    // Insert message at the top of the form
    const activeForm = document.querySelector('form:hover') || document.querySelector('#bookingForm');
    if (activeForm) {
        activeForm.insertBefore(messageDiv, activeForm.firstChild);
        
        // Auto-remove message after 5 seconds
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }
}

function createBookingWhatsAppMessage(data) {
    const serviceNames = {
        'aerial-photography': 'Aerial Photography',
        'surveying': 'Land Surveying',
        'inspections': 'Inspections',
        'delivery': 'Delivery Services'
    };
    
    const budgetRanges = {
        'under-500': 'Under $500',
        '500-1000': '$500 - $1,000',
        '1000-2500': '$1,000 - $2,500',
        '2500-5000': '$2,500 - $5,000',
        'over-5000': 'Over $5,000'
    };
    
    let message = `🚁 *DRONE SERVICE BOOKING REQUEST*\n\n`;
    message += `*Client Information:*\n`;
    message += `Name: ${data.fullName}\n`;
    message += `Email: ${data.email}\n`;
    message += `Phone: ${data.phone}\n\n`;
    
    message += `*Service Details:*\n`;
    message += `Service: ${serviceNames[data.service] || data.service}\n`;
    message += `Date: ${data.date}\n`;
    message += `Time: ${data.time}\n`;
    message += `Location: ${data.location}\n\n`;
    
    if (data.description) {
        message += `*Project Description:*\n${data.description}\n\n`;
    }
    
    if (data.budget) {
        message += `*Budget Range:* ${budgetRanges[data.budget] || data.budget}\n\n`;
    }
    
    message += `Please confirm availability and provide a detailed quote for this project.\n\n`;
    message += `Thank you!\n`;
    message += `- Gat Tech Hub Ltd Website`;
    
    return message;
}

function createContactWhatsAppMessage(data) {
    let message = `📧 *CONTACT MESSAGE*\n\n`;
    message += `*From:* ${data.contactName}\n`;
    message += `*Email:* ${data.contactEmail}\n`;
    message += `*Subject:* ${data.subject}\n\n`;
    message += `*Message:*\n${data.message}\n\n`;
    message += `- Sent via Gat Tech Hub Ltd Website`;
    
    return message;
}

// Navbar Background on Scroll
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.backdropFilter = 'blur(20px)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
    }
});

// Animate elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
    const elementsToAnimate = document.querySelectorAll('.service-card, .gallery-item, .contact-item');
    elementsToAnimate.forEach(el => observer.observe(el));
});

// Set minimum date for booking form to today
document.addEventListener('DOMContentLoaded', function() {
    const dateInput = document.getElementById('date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }
});

// Gallery Image Modal (Optional Enhancement)
document.addEventListener('DOMContentLoaded', function() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            const overlay = this.querySelector('.gallery-overlay');
            
            // Create modal
            const modal = document.createElement('div');
            modal.className = 'image-modal';
            modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 450px;
                background: rgba(0, 0, 0, 0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                cursor: pointer;
            `;
            
            const modalImg = document.createElement('img');
            modalImg.src = img.src;
            modalImg.alt = img.alt;
            modalImg.style.cssText = `
                max-width: 100%;
                max-height: 100%;
                object-fit: contain;
                border-radius: 12px;
            `;
            
            modal.appendChild(modalImg);
            document.body.appendChild(modal);
            
            // Close modal on click
            modal.addEventListener('click', function() {
                document.body.removeChild(modal);
            });
            
            // Close modal on escape key
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && document.body.contains(modal)) {
                    document.body.removeChild(modal);
                }
            });
        });
    });
});

// Loading animation for forms
function showFormLoading(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'Processing...';
    submitBtn.disabled = true;
    form.classList.add('loading');
    
    return function hideLoading() {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        form.classList.remove('loading');
    };
}

// Add CSS for image modal
const modalStyles = document.createElement('style');
modalStyles.textContent = `
    .image-modal {
        animation: fadeIn 0.3s ease-out;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    .field-error {
        animation: slideDown 0.3s ease-out;
    }
    
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(modalStyles);
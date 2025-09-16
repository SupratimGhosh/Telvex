// Contact form functionality
class ContactForm {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.init();
    }

    init() {
        if (!this.form) return;
        
        this.setupFormValidation();
        this.setupFormSubmission();
        this.setupInputAnimations();
    }

    // Form validation
    setupFormValidation() {
        const inputs = this.form.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            // Real-time validation
            input.addEventListener('blur', () => {
                this.validateField(input);
            });

            // Remove error state on input
            input.addEventListener('input', () => {
                this.clearFieldError(input);
            });
        });
    }

    // Form submission handling
    setupFormSubmission() {
        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (!this.validateForm()) {
                return;
            }

            const submitBtn = this.form.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;
            
            // Show loading state
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;

            try {
                // Simulate form submission (replace with actual API call)
                await this.simulateFormSubmission();
                
                // Show success message
                this.showSuccessMessage();
                this.form.reset();
                
            } catch (error) {
                console.error('Form submission error:', error);
                this.showErrorMessage('Failed to send message. Please try again.');
                
            } finally {
                // Reset button state
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    // Input animations and effects
    setupInputAnimations() {
        const formGroups = this.form.querySelectorAll('.form-group');
        
        formGroups.forEach(group => {
            const input = group.querySelector('input, textarea');
            
            if (!input) return;
            
            // Focus effect
            input.addEventListener('focus', () => {
                group.style.transform = 'scale(1.02)';
                group.style.boxShadow = '0 0 0 3px hsl(var(--accent-primary)/0.1)';
                
                // Add glow effect
                input.style.borderColor = 'hsl(var(--accent-primary))';
                input.style.boxShadow = '0 0 20px hsl(var(--accent-primary)/0.2)';
            });

            // Blur effect
            input.addEventListener('blur', () => {
                group.style.transform = 'scale(1)';
                group.style.boxShadow = 'none';
                
                if (!input.value) {
                    input.style.borderColor = 'hsl(var(--accent-primary)/0.2)';
                    input.style.boxShadow = 'none';
                }
            });
        });
    }

    // Validate individual field
    validateField(field) {
        const value = field.value.trim();
        const fieldType = field.type;
        const fieldName = field.name;
        
        let isValid = true;
        let errorMessage = '';

        // Required field validation
        if (!value) {
            isValid = false;
            errorMessage = `${this.capitalize(fieldName)} is required`;
        }
        // Email validation
        else if (fieldType === 'email' && !this.isValidEmail(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
        // Minimum length validation
        else if (fieldName === 'message' && value.length < 10) {
            isValid = false;
            errorMessage = 'Message must be at least 10 characters long';
        }

        if (!isValid) {
            this.showFieldError(field, errorMessage);
        } else {
            this.clearFieldError(field);
        }

        return isValid;
    }

    // Validate entire form
    validateForm() {
        const inputs = this.form.querySelectorAll('input[required], textarea[required]');
        let isFormValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isFormValid = false;
            }
        });

        return isFormValid;
    }

    // Show field error
    showFieldError(field, message) {
        this.clearFieldError(field);
        
        field.style.borderColor = 'hsl(0, 70%, 60%)';
        field.style.boxShadow = '0 0 0 3px hsl(0, 70%, 60%, 0.1)';
        
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.style.cssText = `
            color: hsl(0, 70%, 60%);
            font-size: 0.8rem;
            margin-top: 0.5rem;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        errorElement.textContent = message;
        
        field.parentNode.appendChild(errorElement);
        
        // Animate in
        requestAnimationFrame(() => {
            errorElement.style.opacity = '1';
        });
    }

    // Clear field error
    clearFieldError(field) {
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        
        field.style.borderColor = 'hsl(var(--accent-primary)/0.2)';
        field.style.boxShadow = 'none';
    }

    // Show success message
    showSuccessMessage() {
        this.showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
    }

    // Show error message
    showErrorMessage(message) {
        this.showNotification(message, 'error');
    }

    // Show notification (toast-like)
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            max-width: 400px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        `;

        // Set background color based on type
        const colors = {
            success: 'hsl(120, 70%, 50%)',
            error: 'hsl(0, 70%, 60%)',
            info: 'hsl(var(--accent-primary))'
        };
        notification.style.background = colors[type] || colors.info;

        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;

        document.body.appendChild(notification);

        // Animate in
        requestAnimationFrame(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        });

        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);

        // Click to dismiss
        notification.addEventListener('click', () => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        });
    }

    // Simulate form submission (replace with actual API call)
    async simulateFormSubmission() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate 90% success rate
                if (Math.random() > 0.1) {
                    resolve({ success: true });
                } else {
                    reject(new Error('Simulated network error'));
                }
            }, 2000);
        });
    }

    // Utility functions
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}

// Initialize contact form when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = new ContactForm();
    
    // Make available globally
    window.TelvexContact = contactForm;
});
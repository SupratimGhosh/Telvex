// Animation controller for scroll-triggered animations
class AnimationController {
    constructor() {
        this.observers = [];
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.setupParallaxEffects();
        this.setupHoverAnimations();
    }

    // Set up scroll-triggered animations using Intersection Observer
    setupIntersectionObserver() {
        const options = {
            root: null,
            rootMargin: '0px 0px -100px 0px',
            threshold: 0.1
        };

        // Observer for fade-in elements
        const fadeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in-up');
                }
            });
        }, options);

        // Observe all fade-in elements
        const fadeElements = document.querySelectorAll('.fade-in-element');
        fadeElements.forEach(element => {
            fadeObserver.observe(element);
        });

        this.observers.push(fadeObserver);

        // Observer for service cards with staggered animation
        const serviceObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const serviceCards = entry.target.querySelectorAll('.service-card');
                    serviceCards.forEach((card, index) => {
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, index * 100);
                    });
                    serviceObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        const servicesSection = document.getElementById('services');
        if (servicesSection) {
            // Initially hide service cards
            const serviceCards = servicesSection.querySelectorAll('.service-card');
            serviceCards.forEach(card => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(30px)';
                card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            });
            
            serviceObserver.observe(servicesSection);
        }

        this.observers.push(serviceObserver);

        // Observer for portfolio items
        const portfolioObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const portfolioItems = entry.target.querySelectorAll('.portfolio-item');
                    portfolioItems.forEach((item, index) => {
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0) scale(1)';
                        }, index * 150);
                    });
                    portfolioObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        const portfolioSection = document.getElementById('portfolio');
        if (portfolioSection) {
            // Initially hide portfolio items
            const portfolioItems = portfolioSection.querySelectorAll('.portfolio-item');
            portfolioItems.forEach(item => {
                item.style.opacity = '0';
                item.style.transform = 'translateY(50px) scale(0.9)';
                item.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            });
            
            portfolioObserver.observe(portfolioSection);
        }

        this.observers.push(portfolioObserver);
    }

    // Set up parallax scrolling effects
    setupParallaxEffects() {
        const parallaxElements = document.querySelectorAll('.glow-orb, .orbit-ring');
        
        const handleScroll = window.TelvexUtils.throttle(() => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            parallaxElements.forEach(element => {
                element.style.transform = `translateY(${rate}px)`;
            });
        }, 16); // ~60fps

        window.addEventListener('scroll', handleScroll);
    }

    // Set up hover animations and effects
    setupHoverAnimations() {
        // Enhanced service card hover effects
        const serviceCards = document.querySelectorAll('.service-card');
        serviceCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                // Add glow effect to icon
                const icon = card.querySelector('.service-icon');
                if (icon) {
                    icon.style.filter = 'drop-shadow(0 0 20px hsl(var(--accent-primary)))';
                    icon.style.transform = 'scale(1.1)';
                }

                // Animate background gradient
                card.style.background = `
                    linear-gradient(135deg, 
                        hsl(var(--surface)) 0%, 
                        hsl(var(--surface-elevated)) 50%, 
                        hsl(var(--accent-primary)/0.1) 100%
                    )
                `;
            });

            card.addEventListener('mouseleave', () => {
                const icon = card.querySelector('.service-icon');
                if (icon) {
                    icon.style.filter = 'none';
                    icon.style.transform = 'scale(1)';
                }

                card.style.background = `
                    linear-gradient(135deg, 
                        hsl(var(--surface)), 
                        hsl(var(--surface-elevated))
                    )
                `;
            });
        });

        // Portfolio item hover effects
        const portfolioItems = document.querySelectorAll('.portfolio-item');
        portfolioItems.forEach(item => {
            const image = item.querySelector('.portfolio-image');
            
            item.addEventListener('mouseenter', () => {
                if (image) {
                    image.style.transform = 'scale(1.05)';
                    image.style.filter = 'brightness(1.1)';
                }
            });

            item.addEventListener('mouseleave', () => {
                if (image) {
                    image.style.transform = 'scale(1)';
                    image.style.filter = 'brightness(1)';
                }
            });
        });

        // Social link hover effects
        const socialLinks = document.querySelectorAll('.social-link');
        socialLinks.forEach(link => {
            link.addEventListener('mouseenter', () => {
                link.style.background = `
                    linear-gradient(135deg, 
                        hsl(var(--accent-primary)/0.2), 
                        hsl(var(--accent-glow)/0.1)
                    )
                `;
                link.style.color = 'hsl(var(--accent-glow))';
            });

            link.addEventListener('mouseleave', () => {
                link.style.background = `
                    linear-gradient(135deg, 
                        hsl(var(--surface)), 
                        hsl(var(--surface-elevated))
                    )
                `;
                link.style.color = 'hsl(var(--accent-primary))';
            });
        });
    }

    // Method to trigger custom animations
    triggerAnimation(element, animationType) {
        switch (animationType) {
            case 'fadeInUp':
                element.style.animation = 'fadeInUp 0.6s ease-out forwards';
                break;
            case 'scaleIn':
                element.style.animation = 'scaleIn 0.4s ease-out forwards';
                break;
            case 'slideInRight':
                element.style.animation = 'slideInRight 0.5s ease-out forwards';
                break;
            default:
                console.warn(`Animation type '${animationType}' not recognized`);
        }
    }

    // Cleanup method
    destroy() {
        this.observers.forEach(observer => {
            observer.disconnect();
        });
        this.observers = [];
    }
}

// Custom CSS animations (injected into page)
const customAnimations = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes scaleIn {
        from {
            opacity: 0;
            transform: scale(0.9);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }

    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(50px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    @keyframes float {
        0%, 100% {
            transform: translateY(0);
        }
        50% {
            transform: translateY(-10px);
        }
    }

    .float-animation {
        animation: float 3s ease-in-out infinite;
    }
`;

// Inject custom animations
const styleSheet = document.createElement('style');
styleSheet.textContent = customAnimations;
document.head.appendChild(styleSheet);

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const animationController = new AnimationController();
    
    // Make available globally for other scripts
    window.TelvexAnimations = animationController;
});

// Page visibility API for performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations when tab is not visible
        document.body.style.animationPlayState = 'paused';
    } else {
        // Resume animations when tab becomes visible
        document.body.style.animationPlayState = 'running';
    }
});
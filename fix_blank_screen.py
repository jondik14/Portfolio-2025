# -*- coding: utf-8 -*-
import re

path = r'c:\Users\61431\Desktop\Luke stuff\Work\Portfolios\portfolio 291225\last one\Portfolio-2025-main\index.html'

with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the script section
script_pattern = r'// Initialize Theme[\s\S]*?// Initialize scroll animations[\s\S]*?if \(document\.readyState === \'loading\'\) \{[\s\S]*?document\.addEventListener\(\'DOMContentLoaded\', initScrollAnimations\);[\s\S]*?\} else \{[\s\S]*?initScrollAnimations\(\);[\s\S]*?\}'

replacement = """// Initialize Theme
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
        
        // Mark JS as enabled for animations
        document.documentElement.classList.add('js-enabled');

        // ===== SCROLL ANIMATION OBSERVER =====
        function initScrollAnimations() {
            // Register ScrollTrigger if available
            if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
                gsap.registerPlugin(ScrollTrigger);
            }
            
            // Select all elements with animation classes
            const animatedElements = document.querySelectorAll('.animate-on-scroll, .heading-animate, .animate-from-left, .animate-from-right, .animate-scale');
            
            if (animatedElements.length === 0) return;

            // Create intersection observer
            const observerOptions = {
                root: null,
                rootMargin: '0px 0px -10% 0px',
                threshold: 0.05
            };
            
            const animationObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                    }
                });
            }, observerOptions);
            
            // Observe all animated elements
            animatedElements.forEach(el => {
                animationObserver.observe(el);
            });
            
            // Force hero animations to trigger quickly
            const triggerHero = () => {
                const heroElements = document.querySelectorAll('#about .heading-animate, #about .animate-on-scroll, #about .animate-scale');
                heroElements.forEach(el => el.classList.add('is-visible'));
            };

            // Trigger hero on load
            if (document.readyState === 'complete') {
                triggerHero();
            } else {
                window.addEventListener('load', triggerHero);
            }
            
            // Backup trigger for hero
            setTimeout(triggerHero, 500);
            
            // Add staggered delays to tool cards
            const toolCards = document.querySelectorAll('.tool-card');
            toolCards.forEach((card, index) => {
                if (card.classList.contains('animate-on-scroll')) {
                    card.style.transitionDelay = `${0.1 + (index % 4 * 0.1)}s`;
                }
            });
        }
        
        // Initialize scroll animations
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initScrollAnimations);
        } else {
            initScrollAnimations();
        }"""

content = re.sub(script_pattern, replacement, content)

# Remove the duplicated mutation observer if it exists
mutation_observer_pattern = r'// Also remove any that might be created dynamically[\s\S]*?observer\.observe\(document\.body, \{[\s\S]*?childList: true,[\s\S]*?subtree: true[\s\S]*?\}\);'
content = re.sub(mutation_observer_pattern, '', content)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print('Updated script for stability and fallbacks')

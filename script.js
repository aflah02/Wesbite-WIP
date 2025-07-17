// Data population function
function populatePageData(data) {
    if (!data) return;

    // Populate personal information
    if (data.personal) {
        // Update title and meta information
        document.title = `${data.personal.name} - Personal Portfolio`;
        
        // Update hero section
        const heroTitle = document.querySelector('.hero-title');
        const heroSubtitle = document.querySelector('.hero-subtitle');
        const heroDescription = document.querySelector('.hero-description');
        const profilePhoto = document.querySelector('.profile-photo');
        
        if (heroTitle) heroTitle.textContent = data.personal.name;
        if (heroSubtitle) heroSubtitle.textContent = data.personal.title;
        if (heroDescription) heroDescription.textContent = data.personal.description;
        if (profilePhoto) {
            profilePhoto.src = data.personal.photo;
            profilePhoto.alt = data.personal.name;
        }

        // Update footer
        const footerText = document.querySelector('.footer p');
        if (footerText) {
            footerText.innerHTML = `&copy; 2025 ${data.personal.name}. All rights reserved.`;
        }
    }

    // Populate social links
    if (data.social_links) {
        console.log('Social links data:', data.social_links);
        const socialContainer = document.querySelector('.social-icons');
        console.log('Social container found:', socialContainer);
        if (socialContainer) {
            const socialHTML = portfolioData.renderSocialLinks(data.social_links);
            console.log('Generated social HTML:', socialHTML);
            socialContainer.innerHTML = socialHTML;
        }
    }

    // Populate featured publications (homepage)
    if (data.featured_publications) {
        const publicationsGrid = document.querySelector('.publications-grid');
        if (publicationsGrid) {
            publicationsGrid.innerHTML = portfolioData.renderFeaturedPublications(data.featured_publications);
        }
    }

    // Populate recent updates (homepage)
    if (data.recent_updates) {
        const updatesTimeline = document.querySelector('.updates-timeline');
        if (updatesTimeline) {
            updatesTimeline.innerHTML = portfolioData.renderRecentUpdates(data.recent_updates);
        }
    }

    // Populate all publications (publications page)
    if (data.publications) {
        const publicationsContainer = document.querySelector('.publications-container');
        if (publicationsContainer) {
            publicationsContainer.innerHTML = portfolioData.renderAllPublications(data.publications);
        }
    }

    // Populate education timeline (education page)
    if (data.education) {
        const educationTimeline = document.querySelector('.education-timeline');
        if (educationTimeline) {
            educationTimeline.innerHTML = portfolioData.renderEducationTimeline(data.education);
        }
    }

    // Populate career timeline (education page)
    if (data.career) {
        const careerTimeline = document.querySelector('.career-timeline');
        if (careerTimeline) {
            careerTimeline.innerHTML = portfolioData.renderCareerTimeline(data.career);
        }
    }

    // Populate skills (education page)
    if (data.skills) {
        const skillsContainer = document.querySelector('.skills-container');
        if (skillsContainer) {
            skillsContainer.innerHTML = portfolioData.renderSkills(data.skills);
        }
    }

    // Populate news items (news page)
    if (data.news_updates) {
        const newsContainer = document.querySelector('.news-container');
        if (newsContainer) {
            newsContainer.innerHTML = portfolioData.renderNewsItems(data.news_updates);
        }
    }

    // Populate awards content (awards page)
    if (data.awards_extended) {
        const awardsContent = portfolioData.renderAwardsContent(data.awards_extended);
        
        // Populate each awards section
        Object.keys(awardsContent).forEach(sectionKey => {
            const sectionContainer = document.querySelector(`#${sectionKey} .awards-timeline`);
            if (sectionContainer) {
                sectionContainer.innerHTML = awardsContent[sectionKey];
            }
        });
    }

    // Reinitialize event listeners after content is populated
    reinitializeEventListeners();
}

// Reinitialize event listeners for dynamically loaded content
function reinitializeEventListeners() {
    // Reinitialize publication filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const publicationItems = document.querySelectorAll('.publication-item');
    
    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.replaceWith(button.cloneNode(true));
        });
        
        // Re-add event listeners
        const newFilterButtons = document.querySelectorAll('.filter-btn');
        newFilterButtons.forEach(button => {
            button.addEventListener('click', function() {
                newFilterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                const filterType = this.getAttribute('data-filter');
                
                publicationItems.forEach(item => {
                    item.style.opacity = '';
                    item.style.transform = '';
                    item.style.transition = '';
                    
                    if (filterType === 'all' || item.getAttribute('data-type') === filterType) {
                        item.style.display = 'grid';
                        item.classList.add('fade-in');
                    } else {
                        item.style.display = 'none';
                        item.classList.remove('fade-in');
                    }
                });
            });
        });
    }

    // Reinitialize update filtering
    initializeUpdateFilters();

    // Reinitialize publication and social links
    const pubLinks = document.querySelectorAll('.pub-link');
    const socialLinks = document.querySelectorAll('.social-link');
    
    pubLinks.forEach(link => {
        if (link.getAttribute('href') === '#' || !link.getAttribute('href')) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const linkType = this.textContent.trim();
                alert(`${linkType} link would open here. Please update the YAML data file with the actual URL.`);
            });
        }
    });
    
    socialLinks.forEach(link => {
        if (link.getAttribute('href') === '#' || !link.getAttribute('href')) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const platform = this.getAttribute('title');
                alert(`${platform} link would open here. Please update the YAML data file with your actual profile URL.`);
            });
        }
    });
}

// Initialize portfolio data handler (moved to individual pages)
// const portfolioData = new PortfolioData();

// Load data and initialize the page (moved to individual pages)
/*
document.addEventListener('DOMContentLoaded', async function() {
    console.log('DOM Content Loaded - starting data load');
    
    // Load JSON data
    const data = await portfolioData.loadData();
    
    console.log('Data loaded:', data);
    
    if (data) {
        console.log('Populating page data...');
        populatePageData(data);
    } else {
        console.error('Failed to load data');
    }

    // Continue with existing initialization code...
});
*/

// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', function() {
            navLinks.classList.toggle('mobile-active');
            mobileToggle.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a link
    const navLinkItems = document.querySelectorAll('.nav-link');
    navLinkItems.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('mobile-active');
            mobileToggle.classList.remove('active');
        });
    });
});

// Publication Filtering (for publications page)
document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const publicationItems = document.querySelectorAll('.publication-item');
    const searchInput = document.getElementById('searchInput');

    // Filter functionality
    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                this.classList.add('active');
                
                const filterType = this.getAttribute('data-filter');
                
                publicationItems.forEach(item => {
                    // Reset any previous styles that might cause hiding
                    item.style.opacity = '';
                    item.style.transform = '';
                    item.style.transition = '';
                    
                    if (filterType === 'all' || item.getAttribute('data-type') === filterType) {
                        item.style.display = 'grid';
                        item.classList.add('fade-in');
                    } else {
                        item.style.display = 'none';
                        item.classList.remove('fade-in');
                    }
                });
            });
        });
    }

    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            
            publicationItems.forEach(item => {
                const title = item.querySelector('.publication-title')?.textContent.toLowerCase() || '';
                const authors = item.querySelector('.publication-authors')?.textContent.toLowerCase() || '';
                const venue = item.querySelector('.publication-venue')?.textContent.toLowerCase() || '';
                const abstract = item.querySelector('.publication-abstract')?.textContent.toLowerCase() || '';
                
                // Reset any previous styles
                item.style.opacity = '';
                item.style.transform = '';
                item.style.transition = '';
                
                if (searchTerm === '' || title.includes(searchTerm) || authors.includes(searchTerm) || 
                    venue.includes(searchTerm) || abstract.includes(searchTerm)) {
                    item.style.display = 'grid';
                    item.classList.add('fade-in');
                } else {
                    item.style.display = 'none';
                    item.classList.remove('fade-in');
                }
            });
        });
    }
});

// Load More Publications functionality
document.addEventListener('DOMContentLoaded', function() {
    const loadMoreBtn = document.querySelector('.load-more-btn');
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            // This is a placeholder for loading more publications
            // In a real implementation, you would fetch more data from a server
            alert('Load more functionality would be implemented here with actual data loading.');
        });
    }
});

// Smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', function() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.offsetTop - navbarHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Updates timeline scroll indicator
document.addEventListener('DOMContentLoaded', function() {
    const updatesTimeline = document.querySelector('.updates-timeline');
    const scrollIndicator = document.querySelector('.scroll-indicator');
    const updateItems = document.querySelectorAll('.update-item');
    
    // Ensure all update items are visible by default
    updateItems.forEach(item => {
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
        item.style.display = 'grid';
    });
    
    if (updatesTimeline && scrollIndicator) {
        // Check if content is scrollable
        function checkScrollable() {
            if (updatesTimeline.scrollHeight <= updatesTimeline.clientHeight) {
                scrollIndicator.style.display = 'none';
            } else {
                scrollIndicator.style.display = 'flex';
            }
        }
        
        // Hide indicator when scrolled to bottom
        updatesTimeline.addEventListener('scroll', function() {
            const isScrolledToBottom = updatesTimeline.scrollTop + updatesTimeline.clientHeight >= updatesTimeline.scrollHeight - 10;
            
            if (isScrolledToBottom) {
                scrollIndicator.style.opacity = '0';
            } else {
                scrollIndicator.style.opacity = '0.7';
            }
        });
        
        // Click indicator to scroll down
        scrollIndicator.addEventListener('click', function() {
            updatesTimeline.scrollBy({
                top: 200,
                behavior: 'smooth'
            });
        });
        
        // Initial check
        checkScrollable();
        
        // Check on window resize
        window.addEventListener('resize', checkScrollable);
    }
});

// Update Filtering (for recent updates section)
document.addEventListener('DOMContentLoaded', function() {
    const updateFilterButtons = document.querySelectorAll('.update-filter-btn');
    const updateItems = document.querySelectorAll('.update-item');
    const updatesTimeline = document.querySelector('.updates-timeline');
    const scrollIndicator = document.querySelector('.scroll-indicator');

    // Filter functionality for updates
    if (updateFilterButtons.length > 0) {
        updateFilterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                updateFilterButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                this.classList.add('active');
                
                const filterType = this.getAttribute('data-filter');
                
                updateItems.forEach(item => {
                    // Reset any previous styles that might cause hiding
                    item.style.opacity = '';
                    item.style.transform = '';
                    item.style.transition = '';
                    
                    if (filterType === 'all' || item.getAttribute('data-type') === filterType) {
                        item.style.display = 'grid';
                        // Add a subtle animation when items appear
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0)';
                        }, 50);
                    } else {
                        item.style.display = 'none';
                    }
                });
                
                // Recheck scrollability after filtering
                setTimeout(() => {
                    if (updatesTimeline && scrollIndicator) {
                        if (updatesTimeline.scrollHeight <= updatesTimeline.clientHeight) {
                            scrollIndicator.style.display = 'none';
                        } else {
                            scrollIndicator.style.display = 'flex';
                        }
                    }
                }, 100);
            });
        });
    }
});

// Intersection Observer for animations
document.addEventListener('DOMContentLoaded', function() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Only add animation class if element doesn't already have it
                if (!entry.target.classList.contains('fade-in')) {
                    entry.target.classList.add('fade-in');
                }
                // Ensure element is visible
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation - but make sure they're visible first
    const animatedElements = document.querySelectorAll('.publication-card, .update-item, .timeline-item, .award-card, .collaborator-card');
    animatedElements.forEach(el => {
        // Ensure elements are visible by default
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
        observer.observe(el);
    });
});

// Social media link tracking (for analytics)
document.addEventListener('DOMContentLoaded', function() {
    const socialLinks = document.querySelectorAll('.social-link');
    
    socialLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Analytics tracking would go here
            // Example: gtag('event', 'social_click', { platform: platform });
        });
    });
});

// Publication link tracking
document.addEventListener('DOMContentLoaded', function() {
    const pubLinks = document.querySelectorAll('.pub-link');
    
    pubLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Prevent default if no href is set (placeholder links)
            if (this.getAttribute('href') === '#') {
                e.preventDefault();
                const linkType = this.textContent.trim();
                alert(`${linkType} link would open here. Please update the href attribute with the actual URL.`);
            }
            
            // Analytics tracking would go here
            // Example: gtag('event', 'publication_link_click', { link_type: linkType });
        });
    });
});

// Navbar scroll effect
document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add shadow when scrolled
        if (scrollTop > 0) {
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
        } else {
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
        
        lastScrollTop = scrollTop;
    });
});

// Form validation (if contact forms are added later)
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Utility function for copying text to clipboard
function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text);
    } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            document.execCommand('copy');
        } catch (err) {
            console.error('Unable to copy to clipboard', err);
        }
        document.body.removeChild(textArea);
    }
}

// Add copy citation functionality (could be added to publication items)
document.addEventListener('DOMContentLoaded', function() {
    // This would be used if you add "Copy Citation" buttons to publications
    const copyCitationBtns = document.querySelectorAll('.copy-citation-btn');
    
    copyCitationBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const citation = this.getAttribute('data-citation');
            copyToClipboard(citation);
            
            // Show feedback
            const originalText = this.textContent;
            this.textContent = 'Copied!';
            setTimeout(() => {
                this.textContent = originalText;
            }, 2000);
        });
    });
});

// Theme toggle functionality (if you want to add dark mode later)
function toggleTheme() {
    const body = document.body;
    const isDark = body.classList.contains('dark-theme');
    
    if (isDark) {
        body.classList.remove('dark-theme');
        localStorage.setItem('theme', 'light');
    } else {
        body.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark');
    }
}

// Load saved theme preference
document.addEventListener('DOMContentLoaded', function() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }
});

// Performance optimization: Lazy loading for images
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
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
});

// Back to top button functionality
document.addEventListener('DOMContentLoaded', function() {
    // Create back to top button
    const backToTopBtn = document.createElement('button');
    backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        background: #4f46e5;
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        display: none;
        z-index: 1000;
        transition: all 0.3s ease;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    `;
    
    document.body.appendChild(backToTopBtn);
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.style.display = 'block';
        } else {
            backToTopBtn.style.display = 'none';
        }
    });
    
    // Smooth scroll to top
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});

// Console message for developers
console.log(`
🚀 Personal Portfolio Website
Built with modern web technologies
Feel free to explore the code!

To customize:
1. Update personal information in HTML files
2. Replace placeholder images and links
3. Modify colors in CSS variables
4. Add your actual social media and publication links
`);

// Export functions for testing or external use
window.portfolioUtils = {
    validateEmail,
    copyToClipboard,
    toggleTheme
};

// Service Page Tab Functionality
document.addEventListener('DOMContentLoaded', function() {
    const serviceTabs = document.querySelectorAll('.service-tab');
    const serviceContents = document.querySelectorAll('.service-content');
    
    if (serviceTabs.length > 0) {
        serviceTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                // Remove active class from all tabs and contents
                serviceTabs.forEach(t => t.classList.remove('active'));
                serviceContents.forEach(c => c.style.display = 'none');
                
                // Add active class to clicked tab
                this.classList.add('active');
                
                // Show corresponding content
                const tabId = this.getAttribute('data-tab');
                const targetContent = document.getElementById(tabId);
                if (targetContent) {
                    targetContent.style.display = 'block';
                }
            });
        });
    }
});

// Awards Page Tab Functionality
document.addEventListener('DOMContentLoaded', function() {
    const awardsTabs = document.querySelectorAll('.filter-btn[data-tab]');
    const awardsContents = document.querySelectorAll('.awards-content');
    
    if (awardsTabs.length > 0) {
        awardsTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                // Remove active class from all tabs and contents
                awardsTabs.forEach(t => t.classList.remove('active'));
                awardsContents.forEach(c => c.style.display = 'none');
                
                // Add active class to clicked tab
                this.classList.add('active');
                
                // Show corresponding content
                const tabId = this.getAttribute('data-tab');
                const targetContent = document.getElementById(tabId);
                if (targetContent) {
                    targetContent.style.display = 'block';
                }
            });
        });
    }
});

// News Page Filtering
document.addEventListener('DOMContentLoaded', function() {
    const newsFilterButtons = document.querySelectorAll('.filter-btn[data-filter]');
    const newsItems = document.querySelectorAll('.news-item');
    const newsSearchInput = document.getElementById('newsSearchInput');

    // Filter functionality for news
    if (newsFilterButtons.length > 0) {
        newsFilterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                newsFilterButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                this.classList.add('active');
                
                const filterType = this.getAttribute('data-filter');
                
                newsItems.forEach(item => {
                    // Reset any previous styles
                    item.style.opacity = '';
                    item.style.transform = '';
                    item.style.transition = '';
                    
                    if (filterType === 'all' || item.getAttribute('data-type') === filterType) {
                        item.style.display = 'grid';
                        // Add a subtle animation when items appear
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0)';
                        }, 50);
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }

    // Search functionality for news
    if (newsSearchInput) {
        newsSearchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            
            newsItems.forEach(item => {
                const title = item.querySelector('.news-title')?.textContent.toLowerCase() || '';
                const description = item.querySelector('.news-description')?.textContent.toLowerCase() || '';
                const category = item.querySelector('.news-category')?.textContent.toLowerCase() || '';
                
                // Reset any previous styles
                item.style.opacity = '';
                item.style.transform = '';
                item.style.transition = '';
                
                if (searchTerm === '' || title.includes(searchTerm) || description.includes(searchTerm) || 
                    category.includes(searchTerm)) {
                    item.style.display = 'grid';
                    item.classList.add('fade-in');
                } else {
                    item.style.display = 'none';
                    item.classList.remove('fade-in');
                }
            });
        });
    }
});

// Initialize update filters function
function initializeUpdateFilters() {
    const updateFilterButtons = document.querySelectorAll('.update-filter-btn');
    const updateItems = document.querySelectorAll('.update-item');
    
    if (updateFilterButtons.length > 0 && updateItems.length > 0) {
        // Remove existing event listeners by cloning nodes
        updateFilterButtons.forEach(button => {
            button.replaceWith(button.cloneNode(true));
        });
        
        // Re-select after cloning
        const newUpdateFilterButtons = document.querySelectorAll('.update-filter-btn');
        newUpdateFilterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                newUpdateFilterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                const filterType = this.getAttribute('data-filter');
                
                // Filter update items
                updateItems.forEach(item => {
                    item.style.opacity = '';
                    item.style.transform = '';
                    item.style.transition = 'all 0.3s ease';
                    
                    if (filterType === 'all' || item.getAttribute('data-type') === filterType) {
                        item.style.display = 'grid';
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0)';
                        }, 50);
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'translateY(-10px)';
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
        
        console.log('Update filters initialized successfully');
    } else {
        console.log('Update filter buttons or items not found');
    }
}

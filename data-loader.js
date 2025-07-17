// Data loader and utility functions for the portfolio website

class PortfolioData {
    constructor() {
        this.data = null;
        this.authorName = null;
    }

    // Load data from JSON file
    async loadData() {
        try {
            const response = await fetch('data.json');
            const data = await response.json();
            this.data = data;
            // Store author name for highlighting
            this.authorName = data.personal?.author_name || data.personal?.name;
            return this.data;
        } catch (error) {
            console.error('Error loading data:', error);
            return null;
        }
    }

    // Utility function to highlight author name in author lists
    highlightAuthorName(authorString) {
        if (!this.authorName || !authorString) return authorString;
        
        // Create variations of the author name to match different formats
        const fullName = this.authorName;
        const nameParts = fullName.split(' ');
        const firstName = nameParts[0];
        const lastName = nameParts[nameParts.length - 1];
        
        // Different name format variations to look for
        const nameVariations = [
            fullName, // "Mohammad Aflah Khan"
            `${firstName} ${lastName}`, // "Mohammad Khan" (if middle name is omitted)
            `${lastName}, ${firstName}`, // "Khan, Mohammad" (lastname, firstname format)
            fullName.replace(/\s+/g, '\\s+'), // Allow flexible spacing
        ];
        
        let highlightedString = authorString;
        
        // Apply highlighting for each variation
        nameVariations.forEach(variation => {
            // Escape special regex characters and create word boundary regex
            const escapedVariation = variation.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(`\\b${escapedVariation}\\b`, 'gi');
            highlightedString = highlightedString.replace(regex, '<strong>$&</strong>');
        });
        
        return highlightedString;
    }

    // Utility function to render publication links
    renderPublicationLinks(links) {
        if (!links) return '';
        
        const linkElements = [];
        const linkConfig = {
            'pdf': { icon: 'fas fa-file-pdf', label: 'PDF' },
            'doi': { icon: 'fas fa-external-link-alt', label: 'DOI' },
            'arxiv': { icon: 'fas fa-external-link-alt', label: 'arXiv' },
            'code': { icon: 'fab fa-github', label: 'Code' },
            'data': { icon: 'fas fa-database', label: 'Data' },
            'slides': { icon: 'fas fa-presentation', label: 'Slides' },
            'video': { icon: 'fas fa-video', label: 'Video' },
            'poster': { icon: 'fas fa-presentation', label: 'Poster' },
            'huggingface': { icon: 'fas fa-box', label: 'Hugging Face' }
        };
        
        Object.keys(linkConfig).forEach(linkType => {
            if (links[linkType] && links[linkType].trim() && links[linkType] !== '#') {
                const config = linkConfig[linkType];
                linkElements.push(`<a href="${links[linkType]}" class="pub-link" target="_blank"><i class="${config.icon}"></i> ${config.label}</a>`);
            }
        });
        
        return linkElements.length > 0 ? 
            `<div class="publication-links">${linkElements.join('')}</div>` : '';
    }

    // Utility function to render featured publications
    renderFeaturedPublications(publications) {
        if (!publications || !Array.isArray(publications)) return '';
        
        return publications.map(pub => `
            <article class="publication-card">
                <div class="publication-content">
                    <h3 class="publication-title">${pub.title}</h3>
                    <p class="publication-authors">${this.highlightAuthorName(pub.authors)}</p>
                    <p class="publication-venue">${pub.venue}</p>
                    <p class="publication-description">${pub.description}</p>
                    ${this.renderPublicationLinks(pub.links)}
                </div>
            </article>
        `).join('');
    }

    // Utility function to render all publications
    renderAllPublications(publications) {
        if (!publications) return '';
        
        const years = Object.keys(publications).sort((a, b) => b - a);
        
        return years.map(year => {
            const yearPubs = publications[year];
            if (!Array.isArray(yearPubs)) return '';
            
            const pubsHtml = yearPubs.map((pub, index) => `
                <article class="publication-item" data-type="${pub.type}">
                    <div class="publication-details">
                        <h3 class="publication-title">${pub.title}</h3>
                        <p class="publication-authors">${this.highlightAuthorName(pub.authors)}</p>
                        <p class="publication-venue">
                            <strong>${pub.venue}</strong>
                        </p>
                        <div class="abstract-section">
                            <button class="abstract-toggle" data-target="abstract-${year}-${index}">
                                <i class="fas fa-chevron-down"></i> Show Abstract
                            </button>
                            <div class="publication-abstract" id="abstract-${year}-${index}" style="display: none;">
                                ${pub.abstract || ''}
                            </div>
                        </div>
                        ${this.renderPublicationLinks(pub.links)}
                    </div>
                </article>
            `).join('');
            
            return `
                <div class="year-section">
                    <h2 class="year-title">${year}</h2>
                    ${pubsHtml}
                </div>
            `;
        }).join('');
    }

    // Function to load publications page
    async loadPublicationsPage() {
        try {
            const data = await this.loadData();
            if (!data || !data.publications) return;
            
            const publicationsContainer = document.querySelector('.publications-container');
            if (publicationsContainer) {
                const publicationsHtml = this.renderAllPublications(data.publications);
                publicationsContainer.innerHTML = publicationsHtml;
                
                // Initialize filtering and search functionality after publications are loaded
                this.initializePublicationFiltering();
            }
        } catch (error) {
            console.error('Error loading publications page:', error);
        }
    }

    // Function to initialize publication filtering and search after publications are loaded
    initializePublicationFiltering() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const searchInput = document.getElementById('searchInput');
        const self = this; // Store reference to class instance

        // Filter functionality
        if (filterButtons.length > 0) {
            filterButtons.forEach(button => {
                button.addEventListener('click', function() {
                    // Remove active class from all buttons
                    filterButtons.forEach(btn => btn.classList.remove('active'));
                    // Add active class to clicked button
                    this.classList.add('active');
                    
                    const filterType = this.getAttribute('data-filter');
                    const publicationItems = document.querySelectorAll('.publication-item');
                    
                    publicationItems.forEach(item => {
                        // Reset any previous styles that might cause hiding
                        item.style.opacity = '';
                        item.style.transform = '';
                        item.style.transition = '';
                        
                        if (filterType === 'all' || item.getAttribute('data-type') === filterType) {
                            item.style.display = 'block';
                            item.classList.add('fade-in');
                        } else {
                            item.style.display = 'none';
                            item.classList.remove('fade-in');
                        }
                    });
                    
                    // Hide/show year sections based on visible publications
                    self.updateYearSectionVisibility();
                });
            });
        }

        // Search functionality
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                const searchTerm = this.value.toLowerCase();
                const publicationItems = document.querySelectorAll('.publication-item');
                
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
                        item.style.display = 'block';
                        item.classList.add('fade-in');
                    } else {
                        item.style.display = 'none';
                        item.classList.remove('fade-in');
                    }
                });
                
                // Hide/show year sections based on visible publications
                self.updateYearSectionVisibility();
            });
        }

        // Abstract toggle functionality
        const abstractToggleButtons = document.querySelectorAll('.abstract-toggle');
        abstractToggleButtons.forEach(button => {
            button.addEventListener('click', function() {
                const targetId = this.getAttribute('data-target');
                const abstractDiv = document.getElementById(targetId);
                const icon = this.querySelector('i');
                
                if (abstractDiv.style.display === 'none' || abstractDiv.style.display === '') {
                    // Show abstract
                    abstractDiv.style.display = 'block';
                    this.innerHTML = '<i class="fas fa-chevron-up"></i> Hide Abstract';
                    abstractDiv.classList.add('abstract-show');
                } else {
                    // Hide abstract
                    abstractDiv.style.display = 'none';
                    this.innerHTML = '<i class="fas fa-chevron-down"></i> Show Abstract';
                    abstractDiv.classList.remove('abstract-show');
                }
            });
        });
    }

    // Function to update year section visibility based on visible publications
    updateYearSectionVisibility() {
        const yearSections = document.querySelectorAll('.year-section');
        
        yearSections.forEach(yearSection => {
            const publicationItems = yearSection.querySelectorAll('.publication-item');
            let hasVisiblePublications = false;
            
            // Check if any publication in this year section is visible
            publicationItems.forEach(item => {
                if (item.style.display !== 'none') {
                    hasVisiblePublications = true;
                }
            });
            
            // Show/hide the entire year section based on whether it has visible publications
            if (hasVisiblePublications) {
                yearSection.style.display = 'block';
            } else {
                yearSection.style.display = 'none';
            }
        });
    }

    // Utility function to render recent updates
    renderRecentUpdates(updates) {
        if (!updates || !Array.isArray(updates)) return '';
        
        return updates.map(update => `
            <div class="update-item" data-type="${update.type}">
                <div class="update-date">${update.date}</div>
                <div class="update-content">
                    <h3>${update.title}</h3>
                    <p>${update.description}</p>
                </div>
            </div>
        `).join('');
    }

    // Utility function to render social links
    renderSocialLinks(socialLinks) {
        if (!socialLinks) return '';
        
        const socialIcons = {
            linkedin: 'fab fa-linkedin',
            twitter: 'fab fa-twitter',
            google_scholar: 'fas fa-graduation-cap',
            substack: 'fas fa-newspaper',
            semantic_scholar: 'fas fa-book-open',
            youtube: 'fab fa-youtube',
            github: 'fab fa-github',
            website: 'fas fa-globe'
        };

        const socialTitles = {
            linkedin: 'LinkedIn',
            twitter: 'Twitter',
            google_scholar: 'Google Scholar',
            substack: 'Substack',
            semantic_scholar: 'Semantic Scholar',
            youtube: 'YouTube',
            github: 'GitHub',
            website: 'Website'
        };

        return Object.keys(socialLinks).map(platform => {
            const url = socialLinks[platform];
            // Only render links that have actual URLs (not empty strings)
            if (!url || !url.trim()) {
                return '';
            }
            return `<a href="${url}" class="social-link" title="${socialTitles[platform]}" target="_blank"><i class="${socialIcons[platform]}"></i></a>`;
        }).filter(link => link !== '').join('');
    }

    // Utility function to render education timeline
    renderEducationTimeline(education) {
        if (!education || !Array.isArray(education)) return '';
        
        return education.map(edu => `
            <div class="timeline-item">
                <div class="timeline-date">${edu.date}</div>
                <div class="timeline-content">
                    <div class="timeline-header">
                        <h3 class="timeline-title">${edu.degree}</h3>
                        <div class="timeline-subtitle">${edu.institution}</div>
                    </div>
                    <div class="timeline-description">
                        ${edu.thesis || edu.dissertation ? `<p><strong>Thesis/Dissertation:</strong> ${edu.thesis || edu.dissertation}</p>` : ''}
                        ${edu.advisor ? `<p><strong>Advisor:</strong> ${edu.advisor}</p>` : ''}
                        <p>${edu.description}</p>
                    </div>
                    ${edu.achievements ? `
                        <div class="timeline-tags">
                            ${edu.achievements.map(achievement => `<span class="tag">${achievement}</span>`).join('')}
                        </div>
                    ` : ''}
                </div>
            </div>
        `).join('');
    }

    // Utility function to render career timeline
    renderCareerTimeline(career) {
        if (!career || !Array.isArray(career)) return '';
        
        return career.map(job => `
            <div class="timeline-item">
                <div class="timeline-date">${job.date}</div>
                <div class="timeline-content">
                    <div class="timeline-header">
                        <h3 class="timeline-title">${job.position}</h3>
                        <div class="timeline-subtitle">${job.institution}</div>
                    </div>
                    <div class="timeline-description">
                        <p>${job.description}</p>
                        ${job.responsibilities ? `
                            <ul class="timeline-list">
                                ${job.responsibilities.map(resp => `<li>${resp}</li>`).join('')}
                            </ul>
                        ` : ''}
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Utility function to render skills
    renderSkills(skills) {
        if (!skills) return '';
        
        return Object.keys(skills).map(category => {
            const categoryTitle = category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            return `
                <div class="skills-category">
                    <h4 class="skills-category-title">${categoryTitle}</h4>
                    <div class="skills-tags">
                        ${skills[category].map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                    </div>
                </div>
            `;
        }).join('');
    }

    // Utility function to render news items
    renderNewsItems(newsUpdates) {
        if (!newsUpdates || !Array.isArray(newsUpdates)) return '';
        
        return newsUpdates.map(news => {
            const [month, year] = news.date.split(' ');
            const tags = news.tags ? news.tags.map(tag => `<span class="tag">${tag}</span>`).join('') : '';
            
            return `
                <div class="news-item" data-type="${news.type}">
                    <div class="news-date">
                        <span class="month">${month}</span>
                        <span class="year">${year}</span>
                    </div>
                    <div class="news-content">
                        <div class="news-category">${news.category}</div>
                        <h3 class="news-title">${news.title}</h3>
                        <p class="news-description">${news.description}</p>
                        <div class="news-tags">${tags}</div>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Utility function to render service content
    renderServiceContent(serviceData) {
        if (!serviceData) return '';
        
        // This would be used to populate service page sections
        // Implementation would depend on the specific structure needed
        return '';
    }

    // Utility function to render awards content
    renderAwardsContent(awardsData) {
        if (!awardsData) return '';
        
        const renderAwardSection = (awards, sectionId) => {
            if (!awards || !Array.isArray(awards)) return '';
            
            return awards.map(award => `
                <div class="award-item">
                    <div class="award-year">${award.year}</div>
                    <div class="award-content">
                        <div class="award-header">
                            <h3 class="award-title">${award.title}</h3>
                            <div class="award-organization">${award.organization}</div>
                        </div>
                        <p class="award-description">${award.description}</p>
                        <div class="award-details">
                            ${award.value ? `<span class="award-value">${award.value}</span>` : ''}
                            ${award.level ? `<span class="award-level">${award.level}</span>` : ''}
                            ${award.category ? `<span class="award-category">${award.category}</span>` : ''}
                            ${award.duration ? `<span class="award-duration">${award.duration}</span>` : ''}
                        </div>
                    </div>
                </div>
            `).join('');
        };

        return {
            research: renderAwardSection(awardsData.research),
            academic: renderAwardSection(awardsData.academic),
            teaching: renderAwardSection(awardsData.teaching),
            service: renderAwardSection(awardsData.service),
            fellowships: renderAwardSection(awardsData.fellowships)
        };
    }
}

// Global instance
const portfolioData = new PortfolioData();

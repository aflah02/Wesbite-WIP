// Data loader and utility functions for the portfolio website

class PortfolioData {
    constructor() {
        this.data = null;
    }

    // Load data (JSON for now, can be switched back to YAML later)
    async loadData() {
        try {
            const response = await fetch('data.json');
            const data = await response.json();
            this.data = data;
            return this.data;
        } catch (error) {
            console.error('Error loading data:', error);
            return null;
        }
    }

    // Simple YAML parser for the portfolio data structure
    parseYAML(yamlText) {
        const lines = yamlText.split('\n');
        const result = {};
        let currentSection = null;
        let currentSubsection = null;
        let currentItem = null;
        let indentLevel = 0;

        for (let line of lines) {
            // Skip empty lines and comments
            if (line.trim() === '' || line.trim().startsWith('#')) continue;

            const trimmedLine = line.trim();
            const currentIndent = line.length - line.trimStart().length;

            // Main sections (no indent)
            if (currentIndent === 0 && trimmedLine.includes(':')) {
                const [key, value] = trimmedLine.split(':');
                currentSection = key.trim();
                if (value && value.trim()) {
                    result[currentSection] = value.trim().replace(/"/g, '');
                } else {
                    result[currentSection] = {};
                }
                currentSubsection = null;
                currentItem = null;
            }
            // Subsections (2 spaces)
            else if (currentIndent === 2 && trimmedLine.includes(':')) {
                const [key, value] = trimmedLine.split(':');
                currentSubsection = key.trim();
                if (value && value.trim()) {
                    result[currentSection][currentSubsection] = value.trim().replace(/"/g, '');
                } else {
                    result[currentSection][currentSubsection] = Array.isArray(result[currentSection]) ? 
                        result[currentSection] : (result[currentSection][currentSubsection] || {});
                }
                currentItem = null;
            }
            // Array items (4 spaces, starts with -)
            else if (currentIndent === 4 && trimmedLine.startsWith('- ')) {
                if (!Array.isArray(result[currentSection])) {
                    if (currentSubsection) {
                        if (!Array.isArray(result[currentSection][currentSubsection])) {
                            result[currentSection][currentSubsection] = [];
                        }
                    } else {
                        result[currentSection] = [];
                    }
                }

                const itemText = trimmedLine.substring(2);
                if (itemText.includes(':')) {
                    const [key, value] = itemText.split(':');
                    currentItem = { [key.trim()]: value.trim().replace(/"/g, '') };
                    if (currentSubsection) {
                        result[currentSection][currentSubsection].push(currentItem);
                    } else {
                        result[currentSection].push(currentItem);
                    }
                } else {
                    if (currentSubsection) {
                        result[currentSection][currentSubsection].push(itemText.replace(/"/g, ''));
                    } else {
                        result[currentSection].push(itemText.replace(/"/g, ''));
                    }
                }
            }
            // Properties of items (6+ spaces)
            else if (currentIndent >= 6 && trimmedLine.includes(':')) {
                const [key, value] = trimmedLine.split(':');
                const keyName = key.trim();
                const keyValue = value.trim().replace(/"/g, '');

                if (currentItem) {
                    if (currentIndent === 6) {
                        currentItem[keyName] = keyValue;
                    } else if (currentIndent === 8) {
                        // Handle nested objects like links
                        if (!currentItem[Object.keys(currentItem)[Object.keys(currentItem).length - 1]] || 
                            typeof currentItem[Object.keys(currentItem)[Object.keys(currentItem).length - 1]] === 'string') {
                            const lastKey = Object.keys(currentItem).find(k => k !== keyName) || keyName;
                            if (keyName !== lastKey) {
                                currentItem[lastKey] = {};
                            }
                        }
                        const parentKey = this.findParentKey(currentItem, currentIndent);
                        if (parentKey && typeof currentItem[parentKey] === 'object') {
                            currentItem[parentKey][keyName] = keyValue;
                        } else {
                            currentItem[keyName] = keyValue;
                        }
                    }
                }
            }
            // Array items within nested structures
            else if (currentIndent >= 6 && trimmedLine.startsWith('- ')) {
                const itemText = trimmedLine.substring(2).replace(/"/g, '');
                const parentKey = this.findParentKey(currentItem, currentIndent);
                if (parentKey) {
                    if (!Array.isArray(currentItem[parentKey])) {
                        currentItem[parentKey] = [];
                    }
                    currentItem[parentKey].push(itemText);
                }
            }
        }

        // Post-process the data to handle special cases
        this.postProcessData(result);
        return result;
    }

    findParentKey(item, indentLevel) {
        const keys = Object.keys(item);
        return keys[keys.length - 1];
    }

    postProcessData(data) {
        // Convert publications object to proper structure
        if (data.publications) {
            const years = Object.keys(data.publications);
            const processedPublications = {};
            
            years.forEach(year => {
                if (Array.isArray(data.publications[year])) {
                    processedPublications[year] = data.publications[year];
                }
            });
            data.publications = processedPublications;
        }
    }

    // Utility function to render publication links
    renderPublicationLinks(links) {
        if (!links) return '';
        
        const linkElements = [];
        const linkOrder = ['pdf', 'doi', 'arxiv', 'code', 'data', 'slides', 'video', 'poster'];
        
        linkOrder.forEach(linkType => {
            if (links[linkType] && links[linkType].trim()) {
                const displayName = linkType.toUpperCase();
                linkElements.push(`<a href="${links[linkType]}" class="pub-link">${displayName}</a>`);
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
                    <p class="publication-authors">${pub.authors}</p>
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
            
            const pubsHtml = yearPubs.map(pub => `
                <div class="publication-item" data-type="${pub.type}">
                    <div class="publication-number">${pub.number || ''}</div>
                    <div class="publication-details">
                        <h3 class="publication-title">${pub.title}</h3>
                        <p class="publication-authors">${pub.authors}</p>
                        <p class="publication-venue">${pub.venue}</p>
                        <p class="publication-abstract">${pub.abstract || ''}</p>
                        ${this.renderPublicationLinks(pub.links)}
                    </div>
                </div>
            `).join('');
            
            return `
                <div class="year-section" data-year="${year}">
                    <h3 class="year-title">${year}</h3>
                    <div class="publications-list">
                        ${pubsHtml}
                    </div>
                </div>
            `;
        }).join('');
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

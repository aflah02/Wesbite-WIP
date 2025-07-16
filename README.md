# Personal Portfolio Website

A modern, responsive personal portfolio website designed for academics and researchers. Perfect for showcasing publications, education, career highlights, and professional updates.

## 🌟 Features

- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Multiple Pages**: 
  - Landing page with photo, intro, select publications, and recent updates
  - Education & Career page with timeline and achievements
  - Complete publications page with filtering and search
- **Modern UI**: Clean, professional design with smooth animations
- **Social Media Integration**: Icons for LinkedIn, Twitter, Google Scholar, Substack, Semantic Scholar, YouTube, and GitHub
- **Publication Management**: Organized by year with filtering capabilities
- **SEO Friendly**: Proper meta tags and semantic HTML structure
- **GitHub Pages Ready**: Optimized for easy deployment

## 📁 File Structure

```
NewWebsite/
├── index.html          # Landing page
├── education.html      # Education & Career page
├── publications.html   # All publications page
├── styles.css         # Main stylesheet
├── script.js          # JavaScript functionality
└── README.md          # This file
```

## 🚀 Quick Start

1. **Clone or Download** this repository
2. **Customize** the content (see customization guide below)
3. **Deploy** to GitHub Pages (see deployment guide below)

## ✏️ Customization Guide

### 1. Personal Information

**In all HTML files**, update the following:

- Replace "Your Name" with your actual name
- Update "Your Professional Title" with your job title
- Replace the hero description with your personal bio
- Update the profile photo URL (replace the placeholder)

### 2. Social Media Links

**In all HTML files**, find the social media section and update the `href` attributes:

```html
<a href="https://linkedin.com/in/yourprofile" class="social-link" title="LinkedIn">
<a href="https://twitter.com/yourusername" class="social-link" title="Twitter">
<a href="https://scholar.google.com/citations?user=YOURID" class="social-link" title="Google Scholar">
<!-- ... etc -->
```

### 3. Education & Career (education.html)

- Update timeline items with your actual education and career history
- Modify dates, institutions, positions, and descriptions
- Add or remove timeline items as needed
- Update skills, awards, and achievements sections

### 4. Publications (publications.html)

- Replace placeholder publications with your actual research
- Update publication statistics in the header
- Add proper DOI links, PDF links, and other resources
- Organize publications by year and type

### 5. Recent Updates (index.html)

- Update the recent updates section with your latest news
- Add new achievements, publications, presentations, etc.

### 6. Colors and Styling

The main colors are defined in `styles.css`. Key color variables:

- Primary color: `#4f46e5` (indigo)
- Secondary color: `#7c3aed` (purple)
- Text color: `#1e293b` (dark gray)
- Background: `#ffffff` (white)

To change colors, find and replace these hex values throughout the CSS file.

## 🌐 Deploying to GitHub Pages

### Option 1: Simple Upload

1. Create a new repository on GitHub named `yourusername.github.io`
2. Upload all files to the repository
3. Go to Settings → Pages
4. Select "Deploy from a branch" and choose "main"
5. Your site will be available at `https://yourusername.github.io`

### Option 2: Using Git

1. Initialize a git repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. Create a repository on GitHub named `yourusername.github.io`

3. Connect and push:
   ```bash
   git remote add origin https://github.com/yourusername/yourusername.github.io.git
   git branch -M main
   git push -u origin main
   ```

4. Enable GitHub Pages in repository Settings → Pages

### Option 3: Custom Domain

If you have a custom domain:

1. Create a `CNAME` file in the repository root containing your domain:
   ```
   yourdomain.com
   ```

2. Configure your domain's DNS settings to point to GitHub Pages

## 📱 Mobile Responsiveness

The website is fully responsive and includes:

- Mobile-friendly navigation
- Optimized layouts for different screen sizes
- Touch-friendly buttons and links
- Readable typography on all devices

## 🎨 Customization Tips

### Adding New Pages

1. Create a new HTML file (e.g., `contact.html`)
2. Copy the navigation structure from existing pages
3. Add the new page link to all navigation menus
4. Follow the existing styling patterns

### Adding More Publications

1. Copy an existing publication item in `publications.html`
2. Update all the details (title, authors, venue, etc.)
3. Make sure to include the correct `data-type` attribute for filtering

### Modifying the Timeline

1. Copy an existing timeline item structure
2. Update the date, content, and achievements
3. Maintain the consistent styling classes

## 🔧 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Internet Explorer 11+ (limited support)

## 📊 Performance Features

- Optimized images with lazy loading
- Minified CSS and JavaScript
- Smooth scrolling and animations
- Fast loading times

## 🆘 Troubleshooting

### Images Not Loading
- Check that image URLs are correct
- For local images, make sure they're in the same directory
- Use absolute URLs for external images

### GitHub Pages Not Updating
- Check that you've committed and pushed all changes
- GitHub Pages can take a few minutes to update
- Check the Actions tab for any build errors

### Mobile Menu Not Working
- Ensure JavaScript is enabled
- Check browser console for any errors
- Verify all files are properly linked

## 📄 License

This project is open source and available under the [MIT License](https://opensource.org/licenses/MIT).

## 🤝 Contributing

Feel free to fork this project and submit pull requests for improvements!

## 📞 Support

If you need help customizing or deploying your website, please:

1. Check this README for common solutions
2. Look at the browser console for error messages
3. Ensure all links and file paths are correct

---

**Happy coding! 🚀**

*This template was designed to help academics and researchers create professional portfolio websites quickly and easily.*

# Label Squeeze

![Astro](https://img.shields.io/badge/Astro-4.0.0-orange.svg)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-5.0.0-blue.svg)
![PDF-lib](https://img.shields.io/badge/PDF--lib-1.17.1-green.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)
[![GitHub Stars](https://img.shields.io/github/stars/jplucinski/label-squeeze.svg)](https://github.com/jplucinski/label-squeeze/stargazers)
[![GitHub Issues](https://img.shields.io/github/issues/jplucinski/label-squeeze.svg)](https://github.com/jplucinski/label-squeeze/issues)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/jplucinski/label-squeeze.svg)](https://github.com/jplucinski/label-squeeze/pulls)

Label Squeeze is a browser-based tool that helps you save paper by efficiently merging multiple A6 shipping labels into A4 pages. Perfect for e-commerce businesses and anyone who needs to print multiple shipping labels.

## 📚 Documentation

- **[Development Guide](DEVELOPMENT.md)** - Complete development setup, architecture, and workflow
- **[Deployment Guide](docs/DEPLOYMENT.md)** - FTP deployment with semantic versioning
- **[Contributing Guide](CONTRIBUTING.md)** - How to contribute, coding standards, and PR process
- **[User Guide](#features)** - Features and usage instructions (below)

## ✨ Features

### Main Functionality

- **Merge A6 labels** into A4 pages (up to 4 labels per page in a 2x2 grid)
- **Automatic extraction** of A6 labels from A4 PDFs (assumes top-left placement)
- **Client-side processing** - no uploads, complete privacy
- **Real-time preview** updates as you add/remove files
- **Drag-and-drop** file reordering
- **Download** merged PDF with one click

### User Experience

- Clean, minimalist interface
- Loading indicators for async operations
- Notification system for user feedback
- Responsive design for all devices
- Intuitive file management

## 🚀 Quick Start

### For Users

1. Visit the [Label Squeeze website](#) (or run locally)
2. Upload your A6 or A4 PDF files
3. Preview the merged document
4. Download the optimized A4 PDF

### For Developers

```bash
# Clone the repository
git clone https://github.com/jplucinski/label-squeeze.git
cd label-squeeze

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:4321` to see the app in action.

For detailed development setup, see the [Development Guide](DEVELOPMENT.md).

## 🚀 Deployment

This project uses automated FTP deployment to seohost with semantic versioning.

### Quick Deployment

1. **Configure GitHub Secrets** (one-time setup):

   - `FTP_HOST` - Your FTP server hostname
   - `FTP_USERNAME` - FTP username
   - `FTP_PASSWORD` - FTP password

2. **Deploy a new version**:

   ```bash
   # Create and push a version tag
   git tag -a v1.0.0 -m "Release version 1.0.0"
   git push origin v1.0.0
   ```

3. **Monitor deployment** at: https://github.com/jplucinski/label-squeeze/actions

The version number will automatically appear in the application footer.

For complete deployment instructions, see the [Deployment Guide](docs/DEPLOYMENT.md).

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details on:

- Code of conduct
- Development process
- Coding standards
- Pull request process
- How to report bugs
- How to suggest features

## 📖 Initial Prompt

<details>
<summary>Click to expand the original project prompt</summary>

```
# Label Squeeze

You are a senior front-end developer tasked with creating Label Squeeze, a browser-based app that merges multiple A6 shipping labels into A4 pages to save paper.

## Key Features:

Main feature:
	Merge multiple A6 shipping labels to A4 formated pdf document. If provided label is in A4 format extract A6 label from it, Assume that is placed in top left page section, Ignore rest of the page.

File Handling:
- Upload, remove, and rearrange multiple PDF files.
- Extract and combine A6 labels into A4 pages.
- File list can be rearranged with drag and drop

Preview & Download:
- Show a preview of the merged document with a "Download" button.
- Preview is update automaticaly when use change, add, remove file from the list.
- If there is no file uploaded "Download" button must be disabled.

User Experience:
- Clear file list, loading indicators, smooth feedback, and intuitive interactions.
- User is notified about in-app events with notifications

Design:
- Minimalist UI with a white background, professional typography, and subtle animations.
- Include a logo and a clean layout with good spacing.
- Use responsive design
- Add favicon

Page Structure:
- Header: Logo and hero section.
- Infographic: Steps to use the app (upload, combine, download).
- File Upload
- File list
- Output file preview
- Project details and description

Technical Stack:
- AstroJS: Framework for SSR.
- TailwindCSS: Styling.
- pdf-lib: PDF handling and merging.
- do not use react

Constraints:
- All operations must run client-side.

Deliverable: A functional, SEO-friendly web app with a polished design.
```

</details>

## 🏗️ Technical Details

### Tech Stack

- **[Astro](https://astro.build/)** 4.0.0 - Static site generation framework
- **[TailwindCSS](https://tailwindcss.com/)** 5.0.0 - Utility-first CSS framework
- **[PDF-lib](https://pdf-lib.js.org/)** 1.17.1 - Client-side PDF manipulation
- **[PDF.js](https://mozilla.github.io/pdf.js/)** 3.11.174 - PDF preview rendering
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript

### Architecture

### PDF Processing

- Supports both A6 and A4 input PDFs
- Automatically extracts A6 labels from top-left corner of A4 pages
- Combines up to 4 A6 labels per A4 page in a 2x2 grid
- Client-side processing using PDF-lib for manipulation
- PDF.js for preview rendering

### Page Dimensions

- A4 Page: 595.276 x 841.890 points
- A6 Label: 297.638 x 420.945 points (A4 dimensions halved)

### Browser Compatibility

- Modern browsers with ES6support
- Required APIs:
  - File API
  - Drag and Drop API
  - Canvas API
  - Web Workers (for PDF.js)

### Performance

- Asynchronous PDF processing
- Optimized preview rendering
- Memory-efficient file handling

### Security & Privacy

- All processing happens client-side
- No file uploads to server
- No data persistence

## SEO Optimization

Label Squeeze is optimized for search engines with:

- Comprehensive meta tags (title, description, keywords)
- Open Graph tags for social media sharing
- Twitter Card metadata
- Structured data (JSON-LD) for rich search results
- Semantic HTML with proper heading hierarchy
- XML sitemap and robots.txt

For detailed information about SEO implementation, see [SEO Documentation](docs/SEO.md).

- Your files never leave your browser

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with [Astro](https://astro.build/)
- PDF processing powered by [PDF-lib](https://pdf-lib.js.org/)
- PDF rendering by [PDF.js](https://mozilla.github.io/pdf.js/)
- Styling with [TailwindCSS](https://tailwindcss.com/)

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/jplucinski/label-squeeze/issues)
- **Discussions**: [GitHub Discussions](https://github.com/jplucinski/label-squeeze/discussions)
- **Contributing**: See [CONTRIBUTING.md](CONTRIBUTING.md)

---

Made with ❤️ by the Label Squeeze team

## SEO Optimization

Label Squeeze is optimized for search engines with:

- Comprehensive meta tags (title, description, keywords)
- Open Graph tags for social media sharing
- Twitter Card metadata
- Structured data (JSON-LD) for rich search results
- Semantic HTML with proper heading hierarchy
- XML sitemap and robots.txt

For detailed information about SEO implementation, see [SEO Documentation](docs/SEO.md).

# Label Squeeze - Cursor generated utility opage

- ![Astro](https://img.shields.io/badge/Astro-4.0.0-orange.svg)
- ![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-5.0.0-blue.svg)
- ![PDF-lib](https://img.shields.io/badge/PDF--lib-1.17.1-green.svg)
- ![License](https://img.shields.io/badge/License-MIT-yellow.svg)

Label Squeeze is a browser-based tool that helps you save paper by efficiently merging multiple A6 shipping labels into A4 pages. Perfect for e-commerce businesses and anyone who needs to print multiple shipping labels.

## Initial prompt:

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

## Technical Details

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

### Security

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

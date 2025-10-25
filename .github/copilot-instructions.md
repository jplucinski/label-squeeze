# GitHub Copilot Instructions for Label Squeeze

## Project Overview

Label Squeeze is a browser-based tool that merges multiple A6 shipping labels into A4 pages to save paper. All processing happens client-side with no server-side operations.

## Technical Stack

### Core Technologies

- **Astro 4.0.0**: Static site generation and SSR framework
- **TailwindCSS 5.0.0**: Utility-first CSS framework for styling
- **PDF-lib 1.17.1**: Client-side PDF manipulation and merging
- **PDF.js 3.11.174**: PDF preview rendering (loaded via CDN)
- **TypeScript**: Type-safe JavaScript with strict null checks enabled

### Build Tools

- **Node.js**: Runtime environment
- **npm**: Package manager
- **Prettier**: Code formatter with Astro plugin

## Architecture Best Practices

### 1. Astro Component Structure

- Use `.astro` file extension for components
- Place components in `src/components/` directory
- Use Astro's component syntax with frontmatter (---) for logic
- Avoid React/Vue/Svelte - use vanilla JavaScript with Astro
- Leverage Astro's built-in features (slots, props, etc.)

### 2. Client-Side Processing

- **ALL operations must run client-side** - no backend processing
- Use `client:*` directives for interactive components when needed
- Process PDFs entirely in the browser using pdf-lib
- Use Web Workers for PDF.js to avoid blocking the main thread
- No file uploads to servers - all data stays in the browser

### 3. Styling with TailwindCSS

- Use Tailwind utility classes for all styling
- Follow mobile-first responsive design approach
- Maintain consistent spacing and color schemes
- Use Tailwind's configuration in `tailwind.config.mjs` for customization
- Prefer utility classes over custom CSS

### 4. TypeScript Usage

- Enable strict null checks (`strictNullChecks: true`)
- Use explicit type annotations for function parameters
- Define interfaces for component props
- Use `src/env.d.ts` for global type definitions
- Leverage path aliases: `@/*` maps to `src/*`

### 5. PDF Processing Guidelines

#### PDF Dimensions

- A4 Page: 595.276 x 841.890 points
- A6 Label: 297.638 x 420.945 points (A4 halved)

#### PDF Operations

- Support both A6 and A4 input PDFs
- Extract A6 labels from top-left corner of A4 pages
- Combine up to 4 A6 labels per A4 page in 2x2 grid
- Use async operations for PDF processing to avoid blocking UI
- Handle errors gracefully with user-friendly notifications

#### Libraries

- Use `pdf-lib` for PDF manipulation (merging, extracting)
- Use `PDF.js` (via CDN) for rendering previews
- Access PDF.js via `window.pdfjsLib` global

### 6. Code Style and Formatting

- Use Prettier for code formatting (run `npm run format`)
- Configuration in `.prettierrc.mjs` with Astro plugin
- Format before committing changes
- Maintain consistent indentation and line breaks

### 7. File Organization

```
src/
├── components/     # Reusable Astro components
├── layouts/        # Page layouts
├── pages/          # Route pages (index.astro)
├── env.d.ts        # TypeScript global definitions
public/             # Static assets (favicon, etc.)
```

### 8. User Experience Principles

- Show loading indicators for async operations
- Provide clear feedback for user actions via notifications
- Enable/disable buttons based on state (e.g., Download button)
- Auto-update previews when files change
- Support drag-and-drop for file reordering
- Maintain responsive design for all screen sizes

### 9. Performance Optimization

- Use asynchronous PDF processing to avoid blocking
- Optimize preview rendering with proper scaling
- Implement memory-efficient file handling
- Minimize unnecessary re-renders
- Use appropriate canvas scaling for previews

### 10. Security Considerations

- No data persistence - everything is ephemeral
- No server uploads - all processing in browser
- Use Content Security Policy headers if deploying
- Validate PDF inputs before processing
- Handle malformed PDFs gracefully

## Common Patterns

### Adding a New Component

```astro
---
// Frontmatter: TypeScript/JavaScript logic
interface Props {
  title: string;
  description?: string;
}

const { title, description } = Astro.props;
---

<!-- Template: HTML with Astro syntax -->
<div class="container mx-auto px-4">
  <h1 class="text-2xl font-bold">{title}</h1>
  {description && <p class="text-gray-600">{description}</p>}
</div>

<script>
  // Client-side JavaScript
  // Runs once on page load
</script>

<style>
  /* Scoped CSS - use sparingly, prefer Tailwind */
</style>
```

### PDF Processing Pattern

```typescript
// Use async/await for PDF operations
async function processPDF(file: ArrayBuffer) {
  const doc = await PDFDocument.load(file);
  const page = doc.getPage(0);
  // Process page...
  return await doc.save();
}
```

### Notification Pattern

```javascript
// Show user notifications for feedback
function showNotification(message, type = "info") {
  const container = document.getElementById("notifications");
  // Create and append notification element
  // Auto-remove after timeout
}
```

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run format` - Format code with Prettier

## Testing Guidelines

### Current State

This project currently has **no automated test infrastructure**. All testing is manual.

### Manual Testing Checklist

When making changes, test the following manually:

1. **PDF Upload**

   - Upload single A6 PDF
   - Upload single A4 PDF
   - Upload multiple mixed PDFs
   - Test with large files (>10MB)
   - Test with corrupted/invalid PDFs

2. **PDF Processing**

   - Verify A6 extraction from top-left of A4 pages
   - Test with rotated PDFs
   - Test with PDFs of different versions
   - Verify 2x2 grid layout is correct

3. **File Management**

   - Drag and drop file reordering
   - Remove individual files
   - Clear all files
   - Add files after clearing

4. **Preview Functionality**

   - Preview updates automatically on file changes
   - Preview renders correctly
   - Canvas scaling is appropriate
   - Multiple pages are handled correctly

5. **Download**

   - Downloaded PDF opens correctly
   - Labels are positioned correctly
   - All labels are included
   - File size is reasonable

6. **User Experience**

   - Loading indicators appear during processing
   - Notifications show for user actions
   - Buttons enable/disable appropriately
   - Error messages are clear and helpful

7. **Responsive Design**

   - Test on mobile (320px - 768px)
   - Test on tablet (768px - 1024px)
   - Test on desktop (1024px+)
   - Test portrait and landscape orientations

8. **Browser Compatibility**
   - Chrome/Chromium (latest)
   - Firefox (latest)
   - Safari (latest)
   - Edge (latest)

### Test Data

Use various PDF files for testing:

- Small PDFs (< 1MB)
- Large PDFs (> 10MB)
- Single-page and multi-page documents
- PDFs with different orientations
- PDFs created by different tools

## Constraints and Limitations

1. **No React**: Project explicitly avoids React framework
2. **Client-side only**: No server-side processing or API calls
3. **Browser APIs**: Relies on File API, Drag/Drop API, Canvas API
4. **Modern browsers**: Requires ES6+ support
5. **A6 extraction assumption**: Assumes A6 labels are in top-left of A4 pages

## Development Workflow

### Setting Up Development Environment

```bash
# Clone repository
git clone https://github.com/jplucinski/label-squeeze.git
cd label-squeeze

# Install dependencies
npm install

# Start development server
npm run dev
```

### Making Changes

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make focused, incremental changes
3. Test changes manually (see Testing Guidelines)
4. Format code: `npm run format`
5. Build and verify: `npm run build`
6. Commit with descriptive message following Conventional Commits
7. Push and create pull request

### Code Review Checklist

Before submitting a PR:

- [ ] Code follows project conventions
- [ ] All manual tests pass
- [ ] Code is formatted with Prettier
- [ ] Build completes successfully
- [ ] No new console errors or warnings
- [ ] Changes are minimal and focused
- [ ] User experience is maintained or improved
- [ ] Responsive design works correctly
- [ ] Error handling is comprehensive

## Git Commit Conventions

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Feature
git commit -m "feat: add support for custom label sizes"

# Bug fix
git commit -m "fix: resolve A6 extraction for rotated PDFs"

# Documentation
git commit -m "docs: update README with new features"

# Style/Formatting
git commit -m "style: format code with Prettier"

# Refactor
git commit -m "refactor: simplify PDF processing logic"

# Performance
git commit -m "perf: optimize canvas rendering for large PDFs"

# Tests
git commit -m "test: add manual test cases for edge scenarios"

# Chore
git commit -m "chore: update dependencies"
```

## Resources and References

### Documentation Links

- [Astro Documentation](https://docs.astro.build/) - Framework docs
- [TailwindCSS Documentation](https://tailwindcss.com/docs) - Styling reference
- [PDF-lib Documentation](https://pdf-lib.js.org/) - PDF manipulation API
- [PDF.js Documentation](https://mozilla.github.io/pdf.js/) - PDF rendering API
- [TypeScript Handbook](https://www.typescriptlang.org/docs/) - TypeScript guide
- [MDN Web Docs](https://developer.mozilla.org/) - Web APIs reference

### Project Documentation

- `README.md` - Project overview and quick start
- `DEVELOPMENT.md` - Detailed development guide
- `CONTRIBUTING.md` - Contribution guidelines
- `.github/copilot-instructions.md` - This file

### Example Code References

For examples of proper implementation:

- `src/components/FileUpload.astro` - File handling patterns
- `src/components/Preview.astro` - PDF rendering with PDF.js
- `src/utils/pdfHandler.ts` - PDF processing with pdf-lib
- `src/pages/index.astro` - Main application structure

## Security Best Practices

### Client-Side Security

Since all processing is client-side:

1. **No Data Persistence**

   - Never store uploaded files
   - Clear data from memory when no longer needed
   - No cookies, localStorage, or sessionStorage for user files

2. **Input Validation**

   ```typescript
   function validatePDFFile(file: File): boolean {
     // Check file type
     if (file.type !== "application/pdf") {
       showNotification("Please upload a PDF file", "error");
       return false;
     }

     // Check file size (e.g., max 50MB)
     const maxSize = 50 * 1024 * 1024;
     if (file.size > maxSize) {
       showNotification("File is too large. Maximum size is 50MB", "error");
       return false;
     }

     return true;
   }
   ```

3. **PDF Sanitization**

   ```typescript
   async function sanitizePDF(arrayBuffer: ArrayBuffer) {
     try {
       // Load with pdf-lib (validates structure)
       const pdfDoc = await PDFDocument.load(arrayBuffer);

       // Remove potentially harmful elements
       // (pdf-lib automatically sanitizes during load)

       return await pdfDoc.save();
     } catch (error) {
       throw new Error("Invalid or corrupted PDF file");
     }
   }
   ```

4. **XSS Prevention**

   - Never use `innerHTML` with user-provided content
   - Always use `textContent` for displaying user input
   - Sanitize any user-generated content before display

5. **Content Security Policy**
   ```html
   <!-- Recommended CSP headers for deployment -->
   <meta
     http-equiv="Content-Security-Policy"
     content="default-src 'self'; 
                  script-src 'self' https://cdn.jsdelivr.net; 
                  style-src 'self' 'unsafe-inline'; 
                  img-src 'self' data:;"
   />
   ```

### Privacy Considerations

- **No Tracking**: No analytics or tracking scripts
- **No External Requests**: Except for PDF.js CDN
- **Local Processing**: All PDFs processed in browser
- **No Logs**: No server logs of user activity

### Dependency Security

```bash
# Regularly check for vulnerabilities
npm audit

# Update dependencies carefully
npm update

# Review security advisories
npm audit fix
```

## When Suggesting Code

1. Follow the existing project structure and patterns
2. Use Astro-specific syntax and features
3. Maintain type safety with TypeScript
4. Apply TailwindCSS utilities for styling
5. Ensure client-side processing for all PDF operations
6. Add appropriate error handling and user feedback
7. Keep the minimalist, clean UI design philosophy
8. Test suggestions work with the existing codebase
9. Consider performance implications for browser-based processing
10. Maintain accessibility standards in UI components

## Debugging and Troubleshooting

### Common Issues and Solutions

#### PDF Processing Errors

**Issue**: PDF fails to load or process

```typescript
// Solution: Add comprehensive error handling
try {
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  // Process PDF
} catch (error) {
  console.error("PDF loading failed:", error);
  showNotification(
    "Failed to load PDF. Please ensure it's a valid PDF file.",
    "error",
  );
  return null;
}
```

**Issue**: A6 extraction produces incorrect results

- Verify PDF dimensions match expected A4 size (595.276 x 841.890 points)
- Check for page rotation (handle 0°, 90°, 180°, 270°)
- Ensure extraction coordinates are correct (top-left corner)

**Issue**: Preview not rendering

- Check that PDF.js is loaded: `console.log(window.pdfjsLib)`
- Verify canvas element exists in DOM
- Check browser console for CORS or loading errors
- Ensure PDF data is valid Uint8Array

#### Performance Issues

**Issue**: Large PDFs freeze the browser

```typescript
// Solution: Use async/await with progress indicators
async function processLargePDF(file: File) {
  showLoadingIndicator();
  try {
    // Break processing into chunks with setTimeout
    await processInChunks(file);
  } finally {
    hideLoadingIndicator();
  }
}
```

**Issue**: Preview rendering is slow

- Reduce canvas resolution for large PDFs
- Implement lazy loading for multi-page previews
- Use PDF.js Web Worker for off-main-thread rendering

#### Browser Compatibility

**Issue**: Features not working in specific browsers

- Check for required Web API support (File API, Canvas, etc.)
- Add polyfills if necessary
- Provide clear error messages for unsupported browsers

### Debugging Tips

1. **Use Browser DevTools**

   - Console: Check for errors and warnings
   - Network: Verify PDF.js loads from CDN
   - Performance: Profile PDF processing operations
   - Memory: Monitor for memory leaks with large PDFs

2. **Enable Verbose Logging**

   ```typescript
   const DEBUG = true;

   function debugLog(message: string, data?: any) {
     if (DEBUG) {
       console.log(`[DEBUG] ${message}`, data);
     }
   }
   ```

3. **Test with Sample PDFs**

   - Create minimal test cases
   - Use known-good PDFs for comparison
   - Test edge cases (empty PDFs, single page, 100+ pages)

4. **Validate PDF Structure**

   ```typescript
   async function validatePDF(arrayBuffer: ArrayBuffer) {
     const pdfDoc = await PDFDocument.load(arrayBuffer);
     const pages = pdfDoc.getPages();

     console.log("PDF Info:", {
       pageCount: pages.length,
       firstPageSize: {
         width: pages[0].getWidth(),
         height: pages[0].getHeight(),
       },
     });
   }
   ```

## Error Handling Best Practices

### User-Facing Errors

Always provide clear, actionable error messages:

```typescript
// Bad: Generic error
throw new Error("Failed");

// Good: Specific, actionable error
throw new Error(
  "Unable to extract A6 label. The PDF might not be A4-sized or the label might not be in the top-left corner.",
);
```

### Error Notification Pattern

```typescript
type NotificationType = "success" | "error" | "warning" | "info";

function showNotification(message: string, type: NotificationType = "info") {
  // Create notification element
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.textContent = message;

  // Add to DOM
  document.getElementById("notifications")?.appendChild(notification);

  // Auto-remove after 5 seconds
  setTimeout(() => notification.remove(), 5000);
}

// Usage
try {
  await processFiles();
  showNotification("Files processed successfully!", "success");
} catch (error) {
  showNotification(`Error: ${error.message}`, "error");
}
```

### Error Recovery

Implement graceful degradation:

```typescript
async function robustPDFProcessing(file: File) {
  try {
    // Try primary method
    return await processPDFWithLib(file);
  } catch (error) {
    console.warn("Primary method failed, trying fallback", error);
    try {
      // Try fallback method
      return await processPDFWithFallback(file);
    } catch (fallbackError) {
      // Both failed, inform user
      showNotification(
        "Unable to process this PDF. Please try a different file.",
        "error",
      );
      return null;
    }
  }
}
```

## Accessibility Guidelines

### Keyboard Navigation

All interactive elements must be keyboard accessible:

```astro
<!-- Bad: div with click handler -->
<div onclick="handleClick()">Click me</div>

<!-- Good: button with proper semantics -->
<button type="button" onclick="handleClick()"> Click me </button>
```

### ARIA Labels

Provide descriptive labels for screen readers:

```astro
<button type="button" aria-label="Upload PDF files" class="btn-primary">
  <UploadIcon />
  <span class="sr-only">Upload</span>
</button>
```

### Focus Management

Ensure visible focus indicators:

```css
/* Add to Tailwind config or use Tailwind classes */
.btn:focus {
  outline: 2px solid blue;
  outline-offset: 2px;
}
```

### Screen Reader Announcements

Announce dynamic content changes:

```typescript
function announceToScreenReader(message: string) {
  const announcement = document.createElement("div");
  announcement.setAttribute("role", "status");
  announcement.setAttribute("aria-live", "polite");
  announcement.className = "sr-only";
  announcement.textContent = message;
  document.body.appendChild(announcement);

  // Remove after announcement
  setTimeout(() => announcement.remove(), 1000);
}

// Usage
announceToScreenReader("File uploaded successfully");
```

## Performance Optimization Guidelines

### Memory Management

Be mindful of memory usage with large PDFs:

```typescript
// Bad: Loading all PDFs into memory at once
const allPDFs = await Promise.all(files.map((f) => loadPDF(f)));

// Good: Process one at a time and release memory
for (const file of files) {
  const pdf = await loadPDF(file);
  await processPDF(pdf);
  // PDF is garbage collected after this iteration
}
```

### Lazy Loading

Load resources only when needed:

```typescript
// Load PDF.js only when first PDF is uploaded
let pdfjsLoaded = false;

async function ensurePDFjsLoaded() {
  if (!pdfjsLoaded) {
    await loadPDFjsFromCDN();
    pdfjsLoaded = true;
  }
}
```

### Canvas Optimization

Optimize canvas rendering:

```typescript
function renderPDFPreview(pdf: PDFDocument, maxWidth: number = 800) {
  const page = pdf.getPages()[0];
  const { width, height } = page.getSize();

  // Scale down if too large
  const scale = Math.min(maxWidth / width, 1);

  canvas.width = width * scale;
  canvas.height = height * scale;

  // Render at scaled size
  renderPage(page, scale);
}
```

## Browser Compatibility Requirements

### Required APIs

This application requires:

- **File API**: For file upload and handling
- **Canvas API**: For PDF preview rendering
- **Promises/Async-Await**: For asynchronous operations
- **ES6+ Features**: Arrow functions, const/let, template literals

### Minimum Browser Versions

- Chrome/Edge: 90+
- Firefox: 88+
- Safari: 14+

### Feature Detection

Check for required features:

```typescript
function checkBrowserSupport(): boolean {
  const required = {
    fileAPI: "File" in window,
    canvas: "HTMLCanvasElement" in window,
    promises: "Promise" in window,
  };

  const unsupported = Object.entries(required)
    .filter(([_, supported]) => !supported)
    .map(([feature]) => feature);

  if (unsupported.length > 0) {
    console.error("Unsupported features:", unsupported);
    return false;
  }

  return true;
}
```

## CI/CD Considerations

### Build Validation

Ensure builds are validated before deployment:

```bash
# Install dependencies
npm install

# Format check
npm run format -- --check

# Build
npm run build

# Build should succeed with no errors
```

### Deployment Checklist

Before deploying:

- [ ] All code is formatted with Prettier
- [ ] Build completes successfully
- [ ] Manual testing completed
- [ ] No console errors in production build
- [ ] All assets load correctly
- [ ] PDF.js loads from CDN
- [ ] Responsive design works on all breakpoints

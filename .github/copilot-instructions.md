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
function showNotification(message, type = 'info') {
  const container = document.getElementById('notifications');
  // Create and append notification element
  // Auto-remove after timeout
}
```

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run format` - Format code with Prettier

## Testing Considerations

- Test with various PDF sizes and formats
- Verify A6 extraction from A4 pages works correctly
- Test drag-and-drop functionality
- Check responsive design on different screen sizes
- Test with multiple files (edge cases: 0 files, 1 file, many files)
- Verify download functionality generates valid PDFs

## Constraints and Limitations

1. **No React**: Project explicitly avoids React framework
2. **Client-side only**: No server-side processing or API calls
3. **Browser APIs**: Relies on File API, Drag/Drop API, Canvas API
4. **Modern browsers**: Requires ES6+ support
5. **A6 extraction assumption**: Assumes A6 labels are in top-left of A4 pages

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

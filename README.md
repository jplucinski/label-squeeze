# Label Squeeze

- ![Astro](https://img.shields.io/badge/Astro-4.0.0-orange.svg)
- ![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-5.0.0-blue.svg)
- ![PDF-lib](https://img.shields.io/badge/PDF--lib-1.17.1-green.svg)
- ![License](https://img.shields.io/badge/License-MIT-yellow.svg)

Label Squeeze is a browser-based tool that helps you save paper by efficiently merging multiple A6 shipping labels into A4 pages. Perfect for e-commerce businesses and anyone who needs to print multiple shipping labels.

- ## Technical Details
-
- ### PDF Processing
- - Supports both A6 and A4 input PDFs
- - Automatically extracts A6 labels from top-left corner of A4 pages
- - Combines up to 4 A6 labels per A4 page in a 2x2 grid
- - Client-side processing using PDF-lib for manipulation
- - PDF.js for preview rendering
-
- ### Page Dimensions
- - A4 Page: 595.276 x 841.890 points
- - A6 Label: 297.638 x 420.945 points (A4 dimensions halved)
-
- ### Browser Compatibility
- - Modern browsers with ES6+ support
- - Required APIs:
- - File API
- - Drag and Drop API
- - Canvas API
- - Web Workers (for PDF.js)
-
- ### Performance
- - Asynchronous PDF processing
- - Optimized preview rendering
- - Memory-efficient file handling
-
- ### Security
- - All processing happens client-side
- - No file uploads to server
- - No data persistence

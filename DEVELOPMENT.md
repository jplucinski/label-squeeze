# Development Guide

This guide provides comprehensive information for developers working on Label Squeeze.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Code Style](#code-style)
- [Building and Testing](#building-and-testing)
- [Technical Architecture](#technical-architecture)
- [Common Tasks](#common-tasks)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v20 or later)
- **npm** (comes with Node.js)
- **Git**
- A modern web browser (Chrome, Firefox, Safari, or Edge)

### Recommended Tools

- **VS Code** with the following extensions:
  - Astro
  - Tailwind CSS IntelliSense
  - Prettier - Code formatter
  - ESLint

## Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/jplucinski/label-squeeze.git
cd label-squeeze
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:4321`

### Using Dev Containers (Optional)

If you're using VS Code, you can use the included Dev Container configuration for a consistent development environment:

1. Install the **Dev Containers** extension
2. Open the project in VS Code
3. Click "Reopen in Container" when prompted
4. The environment will automatically install dependencies

## Project Structure

```
label-squeeze/
├── .devcontainer/          # Dev container configuration
├── .github/                # GitHub configuration
│   └── copilot-instructions.md
├── .vscode/                # VS Code workspace settings
├── public/                 # Static assets (favicon, etc.)
├── src/
│   ├── components/         # Reusable Astro components
│   │   ├── FileList.astro
│   │   ├── FileUpload.astro
│   │   ├── Footer.astro
│   │   ├── Header.astro
│   │   ├── Modal.astro
│   │   ├── Preview.astro
│   │   └── Steps.astro
│   ├── layouts/            # Page layouts
│   ├── pages/              # Route pages
│   │   └── index.astro
│   ├── utils/              # Utility functions
│   │   └── pdfHandler.ts
│   └── env.d.ts            # TypeScript type definitions
├── .gitignore
├── .prettierrc.mjs         # Prettier configuration
├── astro.config.mjs        # Astro configuration
├── package.json            # Project dependencies
├── tailwind.config.mjs     # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
├── CONTRIBUTING.md         # Contribution guidelines
├── DEVELOPMENT.md          # This file
└── README.md               # Project documentation
```

## Development Workflow

### Daily Development

1. **Pull latest changes**

   ```bash
   git pull origin main
   ```

2. **Create a feature branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**

   - Edit files in `src/` directory
   - The dev server will auto-reload on changes

4. **Format your code**

   ```bash
   npm run format
   ```

5. **Build and test**

   ```bash
   npm run build
   npm run preview
   ```

6. **Commit and push**
   ```bash
   git add .
   git commit -m "feat: description of your changes"
   git push origin feature/your-feature-name
   ```

## Code Style

### Formatting

We use **Prettier** for consistent code formatting:

```bash
npm run format
```

This will format all files according to `.prettierrc.mjs` configuration.

### Style Guidelines

- Use **TypeScript** for type safety
- Use **Astro components** (`.astro` files) for UI components
- Use **Tailwind CSS** utility classes for styling
- Avoid custom CSS unless absolutely necessary
- Keep components small and focused
- Use semantic HTML elements
- Ensure responsive design for all screen sizes

### File Naming Conventions

- Components: PascalCase (e.g., `FileUpload.astro`)
- Utilities: camelCase (e.g., `pdfHandler.ts`)
- Configuration: kebab-case (e.g., `astro.config.mjs`)

## Building and Testing

### Available Commands

| Command           | Description                          |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start development server (port 4321) |
| `npm run build`   | Build for production                 |
| `npm run preview` | Preview production build locally     |
| `npm run format`  | Format code with Prettier            |

### Manual Testing

Since this is a client-side application, testing is primarily manual:

1. **Test file upload**

   - Upload A6 PDFs
   - Upload A4 PDFs with A6 labels
   - Test drag-and-drop functionality

2. **Test file management**

   - Reorder files via drag-and-drop
   - Remove files
   - Clear all files

3. **Test preview**

   - Verify preview updates automatically
   - Check preview accuracy

4. **Test download**

   - Verify merged PDF is correct
   - Check 2x2 grid layout
   - Ensure A6 labels are properly extracted

5. **Test responsive design**
   - Mobile devices
   - Tablets
   - Desktop screens

## Technical Architecture

### Tech Stack

- **Astro 4.0.0**: Static site generation framework
- **TailwindCSS 5.0.0**: Utility-first CSS framework
- **PDF-lib 1.17.1**: Client-side PDF manipulation
- **PDF.js 3.11.174**: PDF preview rendering (loaded via CDN)
- **TypeScript**: Type-safe JavaScript

### Key Principles

1. **Client-Side Only**: All PDF processing happens in the browser
2. **No Server**: No backend, no file uploads to servers
3. **Privacy First**: No data persistence, everything is ephemeral
4. **Modern Web APIs**: Uses File API, Drag/Drop API, Canvas API

### PDF Processing

#### Page Dimensions

- A4 Page: 595.276 x 841.890 points
- A6 Label: 297.638 x 420.945 points (A4 halved)

#### Processing Flow

1. User uploads PDF files
2. System detects if file is A4 or A6
3. If A4, extract A6 label from top-left corner
4. Combine up to 4 A6 labels per A4 page in 2x2 grid
5. Generate merged PDF
6. Render preview using PDF.js
7. Allow user to download

### Component Architecture

```
index.astro (Main Page)
├── Header.astro (Logo & Hero)
├── Steps.astro (Infographic)
├── FileUpload.astro (Upload Interface)
├── FileList.astro (File Management)
├── Preview.astro (PDF Preview)
├── Modal.astro (Notifications)
└── Footer.astro (Project Info)
```

## Common Tasks

### Adding a New Component

1. Create a new `.astro` file in `src/components/`
2. Follow the Astro component structure:

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
```

3. Import and use in `src/pages/index.astro`

### Modifying PDF Processing

The main PDF handling logic is in `src/utils/pdfHandler.ts`. This module:

- Loads PDF files
- Extracts A6 labels from A4 pages
- Merges labels into new A4 pages
- Exports the final PDF

When modifying:

- Use async/await for all PDF operations
- Handle errors gracefully
- Provide user feedback via notifications
- Test with various PDF sizes and formats

### Updating Styles

We use Tailwind CSS exclusively. To modify styles:

1. Use Tailwind utility classes in component templates
2. Configure custom values in `tailwind.config.mjs` if needed
3. Avoid writing custom CSS unless absolutely necessary

Example:

```astro
<button
  class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
>
  Click Me
</button>
```

## Troubleshooting

### Build Fails

**Problem**: `astro: not found`

```bash
# Solution: Install dependencies
npm install
```

**Problem**: TypeScript errors during build

```bash
# Solution: Check type definitions
npm run build --verbose
```

### Development Server Issues

**Problem**: Port 4321 already in use

```bash
# Solution: Kill the process or use a different port
npx astro dev --port 3000
```

**Problem**: Changes not reflecting

```bash
# Solution: Clear cache and restart
rm -rf .astro dist node_modules/.vite
npm run dev
```

### PDF Processing Issues

**Problem**: Preview not rendering

- Check browser console for errors
- Verify PDF.js is loaded from CDN
- Ensure PDF files are valid

**Problem**: Incorrect A6 extraction

- Verify A6 dimensions (297.638 x 420.945 points)
- Check extraction logic in `pdfHandler.ts`
- Test with different PDF formats

### Prettier/Formatting Issues

**Problem**: Code not formatting

```bash
# Solution: Install Prettier extension or run manually
npm run format
```

## Additional Resources

- [Astro Documentation](https://docs.astro.build/)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [PDF-lib Documentation](https://pdf-lib.js.org/)
- [PDF.js Documentation](https://mozilla.github.io/pdf.js/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## Getting Help

- Check existing [GitHub Issues](https://github.com/jplucinski/label-squeeze/issues)
- Create a new issue with detailed description
- Join discussions in Pull Requests
- Review the [Contributing Guidelines](CONTRIBUTING.md)

---

Happy coding! 🚀

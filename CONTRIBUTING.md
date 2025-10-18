# Contributing to Label Squeeze

Thank you for your interest in contributing to Label Squeeze! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How to Contribute](#how-to-contribute)
- [Development Process](#development-process)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive experience for everyone. We expect all contributors to:

- Be respectful and considerate
- Welcome newcomers and help them get started
- Focus on constructive feedback
- Accept constructive criticism gracefully
- Prioritize the community's best interests

### Unacceptable Behavior

- Harassment, discrimination, or offensive comments
- Personal attacks or trolling
- Publishing others' private information
- Any conduct that could be considered inappropriate in a professional setting

## Getting Started

### Prerequisites

Before you start contributing, ensure you have:

1. A GitHub account
2. Git installed locally
3. Node.js (v20 or later)
4. Familiarity with TypeScript and Astro (or willingness to learn)

### First-Time Setup

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/label-squeeze.git
   cd label-squeeze
   ```
3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/jplucinski/label-squeeze.git
   ```
4. **Install dependencies**:
   ```bash
   npm install
   ```
5. **Verify setup**:
   ```bash
   npm run dev
   ```
   Visit http://localhost:4321 to see the app running

### Staying Up to Date

Keep your fork synchronized with the main repository:

```bash
git fetch upstream
git checkout main
git merge upstream/main
git push origin main
```

## How to Contribute

### Areas for Contribution

We welcome contributions in several areas:

- **Bug Fixes**: Fix issues reported in GitHub Issues
- **Features**: Implement new features from the roadmap
- **Documentation**: Improve or add documentation
- **Testing**: Add test coverage or improve testing infrastructure
- **Performance**: Optimize PDF processing or UI rendering
- **UI/UX**: Enhance user interface and experience
- **Accessibility**: Improve accessibility features

### Good First Issues

Look for issues labeled `good first issue` or `beginner-friendly` to get started.

## Development Process

### 1. Create a Branch

Always create a new branch for your work:

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

Branch naming conventions:

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Test additions or fixes
- `chore/` - Maintenance tasks

### 2. Make Changes

- Follow the [Coding Standards](#coding-standards)
- Keep changes focused and atomic
- Write clear, self-documenting code
- Add comments only when necessary to explain complex logic
- Ensure responsive design for UI changes
- Test thoroughly before committing

### 3. Format Code

Before committing, format your code:

```bash
npm run format
```

### 4. Test Your Changes

- Run the build to ensure no errors:
  ```bash
  npm run build
  ```
- Test the application manually:
  ```bash
  npm run preview
  ```
- Test with different PDF files and scenarios
- Verify responsive design on different screen sizes

### 5. Commit Changes

Follow our [Commit Message Guidelines](#commit-message-guidelines):

```bash
git add .
git commit -m "feat: add support for custom page sizes"
```

### 6. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

## Pull Request Process

### Before Submitting

- [ ] Code is formatted with Prettier (`npm run format`)
- [ ] Build succeeds without errors (`npm run build`)
- [ ] Changes have been tested manually
- [ ] Documentation is updated if needed
- [ ] Commit messages follow guidelines
- [ ] Branch is up to date with main

### Submitting a Pull Request

1. **Go to your fork** on GitHub
2. **Click "New Pull Request"**
3. **Select your branch** to merge into `main`
4. **Fill out the PR template** with:
   - Clear description of changes
   - Reference to related issues (e.g., "Fixes #123")
   - Screenshots for UI changes
   - Testing steps performed
   - Breaking changes (if any)

### PR Title Format

Use conventional commit format:

- `feat: add new feature`
- `fix: resolve bug in PDF processing`
- `docs: update development guide`
- `refactor: simplify file upload logic`
- `style: improve button styling`
- `test: add PDF extraction tests`
- `chore: update dependencies`

### Review Process

- A maintainer will review your PR
- Address any requested changes
- Once approved, a maintainer will merge your PR
- Your contribution will be credited in the release notes

### After Your PR is Merged

1. Delete your feature branch:
   ```bash
   git branch -d feature/your-feature-name
   git push origin --delete feature/your-feature-name
   ```
2. Sync your fork with upstream:
   ```bash
   git checkout main
   git pull upstream main
   git push origin main
   ```

## Coding Standards

### TypeScript

- Use TypeScript for type safety
- Enable strict null checks
- Define interfaces for component props
- Avoid `any` types when possible
- Use meaningful variable and function names

Example:

```typescript
interface ProcessPDFOptions {
  extractA6: boolean;
  maxLabelsPerPage: number;
}

async function processPDF(
  file: File,
  options: ProcessPDFOptions,
): Promise<Uint8Array> {
  // Implementation
}
```

### Astro Components

- Use `.astro` extension for components
- Place TypeScript logic in frontmatter (---)
- Use props for component configuration
- Keep components small and focused
- Avoid client-side frameworks (no React, Vue, Svelte)

Example:

```astro
---
interface Props {
  title: string;
  onClick?: () => void;
}

const { title, onClick } = Astro.props;
---

<button class="btn-primary" onclick={onClick}>
  {title}
</button>
```

### CSS/Styling

- Use **Tailwind CSS** utility classes exclusively
- Follow mobile-first responsive design
- Use semantic class names when needed
- Maintain consistent spacing and colors
- Avoid custom CSS unless absolutely necessary

Example:

```astro
<div class="container mx-auto px-4 sm:px-6 lg:px-8">
  <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
    Title
  </h1>
</div>
```

### File Organization

- Components in `src/components/`
- Pages in `src/pages/`
- Utilities in `src/utils/`
- Layouts in `src/layouts/`
- Static assets in `public/`

### Code Quality

- Write self-documenting code
- Add comments for complex logic only
- Keep functions small and focused
- Use meaningful variable names
- Handle errors gracefully
- Provide user feedback for async operations

## Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `perf`: Performance improvements

### Examples

```bash
feat: add support for custom page sizes

- Add configuration option for custom dimensions
- Update PDF processing logic
- Add UI controls for size selection

Closes #45
```

```bash
fix: resolve incorrect A6 extraction on rotated PDFs

The extraction logic now properly handles rotated pages
by checking the page rotation property.

Fixes #67
```

```bash
docs: update README with new features

- Add section on custom page sizes
- Update screenshots
- Fix broken links
```

## Reporting Bugs

### Before Reporting

1. Check existing [GitHub Issues](https://github.com/jplucinski/label-squeeze/issues)
2. Verify you're using the latest version
3. Test in different browsers if applicable
4. Gather detailed information about the bug

### Bug Report Template

When creating a bug report, include:

- **Title**: Clear, descriptive summary
- **Description**: Detailed explanation of the issue
- **Steps to Reproduce**: Numbered list of exact steps
- **Expected Behavior**: What should happen
- **Actual Behavior**: What actually happens
- **Screenshots**: If applicable
- **Environment**:
  - Browser and version
  - Operating system
  - Node.js version (if relevant)
- **Additional Context**: Any other relevant information

## Suggesting Features

We welcome feature suggestions! When proposing a new feature:

### Feature Request Template

- **Title**: Clear feature summary
- **Problem Statement**: What problem does this solve?
- **Proposed Solution**: How should it work?
- **Alternatives Considered**: Other approaches you've thought about
- **Use Cases**: Real-world scenarios where this is useful
- **Additional Context**: Mockups, examples, references

### Feature Discussion

- Features are discussed in GitHub Issues
- Maintainers will label proposals with `enhancement`
- Community feedback helps prioritize features
- Implementation may be done by maintainers or contributors

## Questions?

If you have questions about contributing:

- Check the [Development Guide](DEVELOPMENT.md)
- Review existing issues and PRs
- Create a new issue with the `question` label
- Reach out to maintainers via GitHub discussions

## Recognition

All contributors will be:

- Listed in the project's contributors
- Credited in release notes
- Appreciated for their valuable contributions!

---

Thank you for contributing to Label Squeeze! 🎉

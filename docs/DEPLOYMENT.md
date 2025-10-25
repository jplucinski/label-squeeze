# Deployment Guide

This guide explains how to deploy Label Squeeze to seohost via FTP using GitHub Actions and semantic versioning.

## Overview

The deployment process uses:
- **GitHub Actions** for CI/CD automation
- **FTP** to upload files to seohost
- **Semantic Versioning** (SemVer) for version management
- **GitHub Releases** for version tracking

## Prerequisites

Before deploying, ensure you have:

1. Access to the GitHub repository with write permissions
2. FTP credentials for seohost
3. Configured GitHub secrets (see below)

## GitHub Secrets Configuration

The deployment workflow requires the following secrets to be configured in the GitHub repository:

### Required Secrets

Go to your repository settings → Secrets and variables → Actions → New repository secret

1. **FTP_HOST**
   - Description: FTP server hostname
   - Example: `ftp.seohost.com` or `123.45.67.89`

2. **FTP_USERNAME**
   - Description: FTP username for authentication
   - Example: `your-ftp-username`

3. **FTP_PASSWORD**
   - Description: FTP password for authentication
   - Example: `your-secure-password`

4. **FTP_ROOT_PATH**
   - Description: FTP server directory path where files should be deployed
   - Example: `./public_html/` or `./www/` or `./`

### How to Add Secrets

```bash
# Navigate to: https://github.com/jplucinski/label-squeeze/settings/secrets/actions
# Click "New repository secret"
# Add each secret with its name and value
```

## Semantic Versioning

This project follows [Semantic Versioning 2.0.0](https://semver.org/):

```
MAJOR.MINOR.PATCH

- MAJOR: Incompatible API changes
- MINOR: Backwards-compatible new features
- PATCH: Backwards-compatible bug fixes
```

### Version Examples

- `v1.0.0` - Initial stable release
- `v1.1.0` - New feature added
- `v1.1.1` - Bug fix
- `v2.0.0` - Breaking changes

## Deployment Process

### Deployment Methods

There are two ways to deploy:

#### Method 1: Automated Deployment via Git Tags (Recommended)

This creates a GitHub release and deploys automatically.

#### Method 2: Manual Deployment via Workflow Dispatch

This allows manual deployment without creating a Git tag or GitHub release.

### Step 1: Prepare Your Changes

1. Make your code changes on a feature branch
2. Test locally:
   ```bash
   npm install
   npm run build
   npm run preview
   ```
3. Commit and push your changes
4. Create and merge a Pull Request to `main`

### Step 2: Deploy

#### Option A: Deploy with Git Tag (Creates GitHub Release)

After merging to `main`, create a version tag:

```bash
# Pull the latest main branch
git checkout main
git pull origin main

# Create a new version tag (replace X.Y.Z with actual version)
git tag -a vX.Y.Z -m "Release version X.Y.Z"

# Push the tag to GitHub
git push origin vX.Y.Z
```

**Examples:**

```bash
# First release
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0

# Feature update
git tag -a v1.1.0 -m "Release version 1.1.0 - Add new feature"
git push origin v1.1.0

# Bug fix
git tag -a v1.1.1 -m "Release version 1.1.1 - Fix critical bug"
git push origin v1.1.1
```

#### Option B: Manual Deployment (No Git Tag or Release)

If you want to deploy without creating a Git tag or GitHub release:

1. Go to: `https://github.com/jplucinski/label-squeeze/actions`
2. Click on "Deploy to seohost via FTP" workflow
3. Click "Run workflow" button (top right)
4. Enter the version number (e.g., `1.0.0`)
5. Click "Run workflow"

This will build and deploy the current code but will **not** create a GitHub release.

### Step 3: Automated Deployment

**For Git Tag Deployments:**

Once you push a version tag, GitHub Actions automatically:

1. ✅ Checks out the code
2. ✅ Sets up Node.js environment
3. ✅ Extracts version from the tag
4. ✅ Updates `package.json` with the version
5. ✅ Installs dependencies
6. ✅ Builds the project with the version number
7. ✅ Deploys to seohost via FTP
8. ✅ Creates a GitHub Release

**For Manual Deployments:**

The workflow performs the same steps except it does **not** create a GitHub Release (step 8).

### Step 4: Monitor Deployment

Monitor the deployment progress:

1. Go to: `https://github.com/jplucinski/label-squeeze/actions`
2. Click on the latest workflow run
3. View the deployment logs
4. Verify each step completes successfully

### Step 5: Verify Deployment

After deployment completes:

1. Visit your seohost website
2. Check the footer for the version number (e.g., `v1.0.0`)
3. Test the application functionality
4. Verify the GitHub Release was created

## Version Display

The current version is automatically displayed in the application footer:

- Version badge appears next to the copyright notice
- Format: `v1.0.0` (blue badge)
- Source: `package.json` or `PUBLIC_APP_VERSION` environment variable

## Troubleshooting

### Deployment Fails

**Issue**: FTP connection fails

```
Solution:
1. Verify FTP_HOST, FTP_USERNAME, FTP_PASSWORD, FTP_ROOT_PATH secrets are correct
2. Check FTP server is accessible
3. Verify firewall settings allow GitHub Actions IP ranges
```

**Issue**: Build fails

```
Solution:
1. Run build locally: npm run build
2. Fix any build errors
3. Commit and push fixes
4. Create a new version tag
```

### Version Not Showing

**Issue**: Version displays as `0.0.1` instead of release version

```
Solution:
1. Ensure you pushed a version tag (v1.0.0 format)
2. Check GitHub Actions workflow completed successfully
3. Verify PUBLIC_APP_VERSION environment variable is set during build
4. Clear browser cache and reload the page
```

### Tag Already Exists

**Issue**: Cannot push tag because it already exists

```bash
# Delete local tag
git tag -d vX.Y.Z

# Delete remote tag
git push origin :refs/tags/vX.Y.Z

# Create new tag with updated version
git tag -a vX.Y.Z -m "Release version X.Y.Z"
git push origin vX.Y.Z
```

## Rollback

To rollback to a previous version:

1. Find the previous version tag
2. Create a new tag with incremented version
3. Deploy the old code with the new tag:

```bash
# Checkout the previous version
git checkout v1.0.0

# Create a new tag
git tag -a v1.1.0 -m "Rollback to v1.0.0 functionality"
git push origin v1.1.0
```

## Manual Deployment

If automated deployment fails, deploy manually:

```bash
# Build locally
npm install
npm run build

# Upload dist/ directory to seohost via FTP client
# Use your FTP credentials from GitHub secrets
```

## FTP Deployment Details

The workflow uses [FTP-Deploy-Action](https://github.com/SamKirkland/FTP-Deploy-Action) with these settings:

- **Local directory**: `./dist/` (Astro build output)
- **Server directory**: `./` (FTP root)
- **Clean slate**: `false` (keeps existing files)
- **Excludes**: Git files and node_modules

## Best Practices

1. **Test Before Tagging**
   - Always test locally before creating a version tag
   - Run full build and preview

2. **Meaningful Version Numbers**
   - Follow semantic versioning strictly
   - Use appropriate version bumps

3. **Tag Messages**
   - Write clear, descriptive tag messages
   - Include what changed in the release

4. **GitHub Releases**
   - Review and update release notes after automatic creation
   - Add detailed changelog

5. **Backup**
   - Keep previous versions accessible via Git tags
   - Document major changes

## Support

For deployment issues:

- Check [GitHub Actions logs](https://github.com/jplucinski/label-squeeze/actions)
- Review [GitHub Issues](https://github.com/jplucinski/label-squeeze/issues)
- Contact repository maintainers

## Related Documentation

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Semantic Versioning](https://semver.org/)
- [FTP-Deploy-Action](https://github.com/SamKirkland/FTP-Deploy-Action)

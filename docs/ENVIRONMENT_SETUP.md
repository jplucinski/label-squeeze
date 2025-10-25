# GitHub Environment Setup Guide

This guide explains how to configure the `prod` GitHub Environment for Label Squeeze deployments.

## Overview

Label Squeeze uses GitHub Environments to manage deployment configurations and secrets. The `prod` environment is used for production deployments to seohost via FTP.

## Benefits of Using GitHub Environments

- **Organized Secrets**: Environment-specific secrets are isolated from repository secrets
- **Protection Rules**: Add deployment protection rules (e.g., required reviewers, wait timers)
- **Environment Variables**: Set environment-specific variables
- **Deployment History**: Track deployments to specific environments
- **Environment URL**: Link directly to the deployed application

## Setting Up the `prod` Environment

### Step 1: Create the Environment

1. Navigate to your repository on GitHub
2. Go to **Settings** → **Environments**
3. Click **New environment**
4. Name it `prod` (exactly as written, case-sensitive)
5. Click **Configure environment**

### Step 2: Configure Environment Secrets

Add the following secrets to the `prod` environment:

#### Required Secrets

1. **FTP_HOST**
   - Description: FTP server hostname
   - Example: `ftp.seohost.com` or `123.45.67.89`
   - How to add:
     - Scroll to "Environment secrets" section
     - Click "Add secret"
     - Name: `FTP_HOST`
     - Value: Your FTP host
     - Click "Add secret"

2. **FTP_USERNAME**
   - Description: FTP username for authentication
   - Example: `your-ftp-username`

3. **FTP_PASSWORD**
   - Description: FTP password for authentication
   - Example: `your-secure-password`

4. **FTP_ROOT_PATH**
   - Description: FTP server directory path where files should be deployed
   - Example: `./public_html/` or `./www/` or `./`

### Step 3: Configure Protection Rules (Optional)

Add deployment protection rules to prevent accidental deployments:

#### Required Reviewers

1. In the environment configuration, find "Deployment protection rules"
2. Check "Required reviewers"
3. Add team members or yourself as required reviewers
4. Deployments will now require approval before proceeding

#### Wait Timer

1. Check "Wait timer"
2. Set duration (e.g., 5 minutes)
3. Deployments will wait before proceeding, allowing time to cancel if needed

#### Deployment Branches

1. Under "Deployment branches", select one of:
   - **All branches**: Allow deployments from any branch
   - **Protected branches only**: Restrict to protected branches
   - **Selected branches**: Specify allowed branches (e.g., `main`, `releases/*`)

### Step 4: Set Environment Variables (Optional)

You can set environment-specific variables:

1. Scroll to "Environment variables" section
2. Click "Add variable"
3. Add any environment-specific configuration
4. Example:
   - Name: `DEPLOY_REGION`
   - Value: `us-east-1`

### Step 5: Configure Environment URL

The workflow automatically sets the environment URL to your production site:

- Default: `https://label-squeeze.seohost.com`
- This URL appears in deployment logs and can be customized in `.github/workflows/deploy.yml`

## Verification

After setting up the environment:

1. Go to **Actions** → **Deploy to seohost via FTP**
2. Click "Run workflow"
3. Enter a version number
4. If protection rules are enabled, you'll need to approve the deployment
5. Once approved/started, view the deployment status in the "Environments" section

## Environment vs Repository Secrets

### When to Use Environment Secrets (prod environment)

- ✅ Deployment credentials (FTP, SSH)
- ✅ Production API keys
- ✅ Environment-specific tokens
- ✅ Secrets that should require review before use

### When to Use Repository Secrets

- ✅ `GITHUB_TOKEN` (automatically provided by GitHub)
- ✅ Secrets used in multiple environments
- ✅ Build-time secrets that don't need protection rules

## Migrating from Repository Secrets

If you previously used repository-level secrets:

1. **Do not delete** existing repository secrets yet
2. Add secrets to the `prod` environment (see Step 2)
3. Test a deployment to ensure it works
4. Once verified, you can optionally delete the repository-level secrets
5. The workflow will automatically use environment secrets when available

## Troubleshooting

### Deployment Fails with "Secret not found"

**Issue**: Workflow cannot access secrets

```
Solution:
1. Verify the environment name is exactly "prod" (case-sensitive)
2. Check that secrets are added to the "prod" environment, not repository secrets
3. Ensure the workflow references the correct environment name
4. Check that the deployment has been approved (if required reviewers are configured)
```

### Cannot Create Environment

**Issue**: "Environments" tab not visible in Settings

```
Solution:
1. Environments are only available for public repositories
2. For private repositories, you need GitHub Pro, Team, or Enterprise
3. Check your repository visibility and plan
```

### Workflow Pending Approval

**Issue**: Deployment is waiting for approval

```
Solution:
1. This is expected if you configured "Required reviewers"
2. A designated reviewer must approve the deployment
3. Go to Actions → Click the pending workflow run → Review deployment → Approve
```

## Best Practices

1. **Use Required Reviewers for Production**
   - Prevent accidental deployments
   - Ensure team awareness of production changes

2. **Separate Staging and Production**
   - Create a `staging` environment for pre-production testing
   - Use different FTP credentials/paths for staging

3. **Rotate Secrets Regularly**
   - Update FTP passwords periodically
   - Update environment secrets after rotation

4. **Document Environment-Specific Configuration**
   - Keep notes about why certain values are set
   - Document any special configuration in this file

5. **Use Deployment Branches Protection**
   - Restrict production deployments to `main` branch
   - Prevent deployments from feature branches

## Example: Adding a Staging Environment

To add a staging environment:

1. Create a new environment named `staging`
2. Add FTP secrets for your staging server:
   - `FTP_HOST`: staging-ftp.seohost.com
   - `FTP_USERNAME`: staging-user
   - `FTP_PASSWORD`: staging-pass
   - `FTP_ROOT_PATH`: ./staging/
3. Create a new workflow file `.github/workflows/deploy-staging.yml`
4. Modify the workflow to use `environment: staging`

## Support

For issues with environment setup:

- [GitHub Environments Documentation](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment)
- [GitHub Issues](https://github.com/jplucinski/label-squeeze/issues)
- Repository maintainers

## Related Documentation

- [DEPLOYMENT.md](DEPLOYMENT.md) - General deployment guide
- [GitHub Environments](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment)
- [GitHub Actions Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)

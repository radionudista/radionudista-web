# Deployment

This guide provides instructions for deploying the Nudista Radio Aura Glass application to a hosting service.

> **Note:** This project is currently deployed and running on Cloudflare Pages. The Cloudflare Pages deployment instructions below reflect the current production setup.


## 1. Build the Application for Production

Before deploying, you need to create a production-ready build of your application. This process will compile and optimize your code and assets for the best performance.

Run the following command in your project's root directory:

```bash
bun run build
```

This command will generate a `dist/` directory. This directory contains all the static files (HTML, CSS, JavaScript, images) that need to be deployed.

## 2. Choose a Hosting Provider

You can host your application on any service that supports static site hosting. Some popular choices include:

-   [Vercel](https://vercel.com/)
-   [Netlify](https://www.netlify.com/)
-   [Cloudflare Pages](https://pages.cloudflare.com/)
-   [GitHub Pages](https://pages.github.com/)
-   [AWS S3](https://aws.amazon.com/s3/) with [CloudFront](https://aws.amazon.com/cloudfront/)
-   [Firebase Hosting](https://firebase.google.com/docs/hosting)

For most of these providers, you can connect your Git repository (e.g., on GitHub) for continuous deployment, which automatically builds and deploys your site when you push new changes.

## 3. Configure Environment Variables

This is a critical step. Your application relies on environment variables to function correctly, especially for the Twitch player.

In your hosting provider's dashboard, you need to set the following environment variables:

-   `VITE_TWITCH_CHANNEL`: The Twitch channel you want to display.
-   `VITE_TWITCH_PARENT`: **This is very important.** You must set this to the domain where your application will be hosted (e.g., `www.nudistaradio.com` or `nudista-radio.vercel.app`). If this is not set correctly, the embedded Twitch player will not work.
-   `VITE_TARGET_DATE`: The target date for the countdown.
-   `VITE_PASSWORD_PROTECT`: Set to `'true'` or `'false'` depending on if you want to use password protection.
-   `VITE_SITE_PASSWORD`: The password if protection is enabled.
-   ...and any other variables your deployment requires.

Refer to the [Environment Variables documentation](./environment-variables.md) for a full list.

## 4. Deploy

The deployment process varies depending on the provider:

### Manual Deployment

You can manually upload the contents of the `dist/` directory to your hosting service. This is a quick way to get your site live, but it's not ideal for frequent updates.

### Continuous Deployment (Recommended)

1.  Push your project to a GitHub, GitLab, or Bitbucket repository.
2.  Connect your repository to your chosen hosting provider (e.g., Vercel, Netlify, or Cloudflare Pages).
3.  Configure the build settings:
    -   **Build Command:** `bun run build` or `npm run build` (if your provider uses npm).
    -   **Publish Directory:** `dist`
    -   **Install Command:** `bun install` or `npm install`
4.  The provider will now automatically build and deploy your site whenever you push a commit to your main branch.

## Example: Deploying to Vercel

1.  Sign up for a Vercel account and connect your GitHub account.
2.  Create a "New Project" and import your project's repository.
3.  Vercel will likely detect that it's a Vite project and configure the build settings automatically. Verify that they are correct.
4.  Go to the project's "Settings" tab and navigate to "Environment Variables".
5.  Add all the necessary `VITE_` variables, ensuring `VITE_TWITCH_PARENT` is set to the Vercel domain you will be assigned (or your custom domain).
6.  Trigger a deployment. Vercel will build and deploy your site.

## Example: Deploying to Cloudflare Pages

1.  Sign up for a Cloudflare account and navigate to the [Cloudflare Pages dashboard](https://dash.cloudflare.com/pages).
2.  Click "Create a project" and then "Connect to Git".
3.  Connect your GitHub, GitLab, or Bitbucket account and select your project repository.
4.  Configure the build settings:
    -   **Project name:** Choose a name for your project (this will be part of your `pages.dev` URL)
    -   **Production branch:** `main` (or your default branch)
    -   **Framework preset:** Select "None" or "Vite" if available
    -   **Build command:** `bun run build` (or `npm run build` if Cloudflare doesn't support Bun)
    -   **Build output directory:** `dist`
    -   **Root directory:** Leave blank (unless your project is in a subdirectory)
5.  Before deploying, click "Environment variables" and add all necessary variables:
    -   `VITE_TWITCH_CHANNEL`: Your Twitch channel name
    -   `VITE_TWITCH_PARENT`: Set this to your Cloudflare Pages domain (e.g., `your-project.pages.dev` or your custom domain)
    -   `VITE_TARGET_DATE`: The countdown target date
    -   `VITE_PASSWORD_PROTECT`: Set to `'true'` or `'false'`
    -   `VITE_SITE_PASSWORD`: The password if protection is enabled
    -   Add any other required environment variables from your configuration
6.  Click "Save and Deploy". Cloudflare Pages will build and deploy your site.
7.  Once deployed, your site will be available at `https://your-project.pages.dev`.
8.  (Optional) To use a custom domain, go to the "Custom domains" tab in your project settings and follow the instructions to add your domain.

**Note for Cloudflare Pages:** If Cloudflare doesn't support Bun in their build environment, you may need to change the build command to `npm run build` and ensure your `package.json` has the necessary npm scripts configured.

### Benefits of Cloudflare Pages

-   **Free tier with generous limits:** 500 builds per month, unlimited bandwidth
-   **Global CDN:** Fast content delivery worldwide
-   **Automatic HTTPS:** SSL certificates included
-   **Preview deployments:** Each pull request gets its own preview URL
-   **Custom domains:** Easy to set up with automatic SSL
-   **Edge functions:** Support for serverless functions at the edge (if needed in the future)

# Netlify Deployment Guide

This React app is ready to be deployed on Netlify.

## Deployment Steps

### Option 1: Deploy via Netlify CLI

1. Install Netlify CLI globally:
   ```bash
   npm install -g netlify-cli
   ```

2. Login to Netlify:
   ```bash
   netlify login
   ```

3. Initialize and deploy:
   ```bash
   netlify init
   ```
   Follow the prompts to connect to your Netlify account.

4. Deploy:
   ```bash
   netlify deploy --prod
   ```

### Option 2: Deploy via Netlify Dashboard

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)

2. Go to [Netlify](https://app.netlify.com/)

3. Click "Add new site" → "Import an existing project"

4. Connect to your Git provider and select the repository

5. Configure build settings (these should be auto-detected from netlify.toml):
   - **Build command**: `npm run build`
   - **Publish directory**: `build`
   - **Node version**: 18

6. Click "Deploy site"

### Option 3: Manual Deploy (Drag & Drop)

1. Build the production bundle:
   ```bash
   npm run build
   ```

2. Go to [Netlify Drop](https://app.netlify.com/drop)

3. Drag and drop the `build` folder

## Configuration Files

- `netlify.toml` - Netlify build configuration
- `public/_redirects` - Client-side routing configuration for React Router

## Environment Variables

If you need to add environment variables (API keys, etc.):

1. In Netlify Dashboard: Site settings → Environment variables
2. Add any necessary variables with the prefix `REACT_APP_`
3. Redeploy the site

## Custom Domain

To add a custom domain:
1. Go to Site settings → Domain management
2. Add your custom domain
3. Configure DNS settings as instructed

## Notes

- The CSV file (`visitor_recommendations.csv`) is included in the build
- All API calls (Algolia, GraphQL) work from the deployed site
- Client-side routing is configured to work with direct URL access

# 🚀 Soundsfair - Deployment Guide

## Deploying to Netlify

This guide will help you deploy Soundsfair to Netlify in just a few minutes.

### Prerequisites

- GitHub account (repository already created)
- Netlify account (free tier is fine)
- Git installed locally

---

## Step 1: Connect Repository to Netlify

1. Go to [netlify.com](https://netlify.com)
2. Click **"Sign up"** or **"Log in"**
3. Click **"New site from Git"**
4. Select **GitHub** as your Git provider
5. Authorize Netlify to access your GitHub account
6. Select the repository: **soundsfair**

---

## Step 2: Configure Build Settings

Netlify should auto-detect the following, but verify:

| Setting | Value |
|---------|-------|
| **Base directory** | `soundsfair-app` |
| **Build command** | `npm run build` |
| **Publish directory** | `.next` |
| **Node version** | `20.19.6` |

> The `netlify.toml` file in `soundsfair-app/` already contains the correct configuration.

---

## Step 3: Set Environment Variables (if needed in future)

1. Go to **Site settings** → **Build & deploy** → **Environment**
2. Add any necessary environment variables:
   - `NEXT_PUBLIC_SITE_URL` (for Netlify: automatically set)
   - `COINGECKO_API_KEY` (optional, for price data)
   - `PLAUSIBLE_DOMAIN` (optional, for analytics)

For now, you can skip this as the app works without these.

---

## Step 4: Deploy

1. Click **"Deploy site"**
2. Netlify will:
   - Clone your repository
   - Install dependencies (`npm install`)
   - Build the project (`npm run build`)
   - Deploy to their CDN

This takes **2-3 minutes** on the first deploy.

---

## Step 5: Access Your Live Site

Once deployment is complete:

- **Live URL**: `https://[your-site-name].netlify.app`
- Netlify will automatically assign a domain, or you can customize it in **Site settings** → **General** → **Site details** → **Change site name**

---

## Future Deployments

After the initial setup, deployments happen **automatically**:

1. Push changes to `main` branch on GitHub
2. Netlify automatically detects the push
3. Runs build and deploys to live site (within 2-3 minutes)

No manual steps needed!

---

## Rollback / Deploy History

To revert to a previous version:

1. Go to **Deploys** in Netlify dashboard
2. Click **"Publish deploy"** on any previous deployment
3. Site reverts instantly

---

## Custom Domain (Optional)

To use a custom domain (e.g., `soundsfair.com`):

1. **Site settings** → **Domain management** → **Add custom domain**
2. Follow DNS setup instructions (depends on your domain registrar)
3. Typically takes 5-30 minutes to propagate

---

## Monitoring & Analytics

### View Build Logs

- **Deploys** tab in Netlify dashboard
- Click on any deployment to see build output
- Useful for debugging build failures

### Performance Monitoring

- Netlify provides basic performance metrics in **Analytics**
- For detailed analytics, integrate **Plausible Analytics** (privacy-first alternative)

---

## Troubleshooting

### Build Fails with "Module not found"

**Solution**:
- Check build logs in Netlify dashboard
- Ensure all dependencies are in `package.json`
- Delete `node_modules` locally and run `npm install` again

### Site shows blank page

**Solution**:
- Check browser console for errors (F12)
- Verify `NEXT_PUBLIC_SITE_URL` is set correctly
- Clear browser cache (Cmd+Shift+Delete or Ctrl+Shift+Delete)

### Build takes too long

**Solution**:
- Netlify caches dependencies between builds
- First build is slower, subsequent builds are faster
- Monitor in **Deploys** tab

---

## Production Checklist

Before launching to production, verify:

- [ ] Build passes locally: `npm run build`
- [ ] No console errors in dev: `npm run dev`
- [ ] All links work and point to correct routes
- [ ] Images load correctly
- [ ] Responsive design works on mobile
- [ ] Quiz system works (test on Lesson 5)
- [ ] DCA Calculator generates results
- [ ] Error pages display correctly

---

## CI/CD with GitHub Actions (Optional)

To run tests before deploying:

1. Create `.github/workflows/deploy.yml` in root
2. Configure to run tests before Netlify builds
3. This prevents broken code from being deployed

(Not implemented yet, but recommended for future)

---

## Cost

- **Free tier**: Includes automatic deployments, 100GB bandwidth/month
- **Premium tier**: Custom domains, identity, forms features

The free tier is perfect for MVP and testing.

---

## Support

For issues with Netlify deployment:
- [Netlify Docs](https://docs.netlify.com/)
- [Netlify Community](https://community.netlify.com/)
- [Next.js on Netlify](https://docs.netlify.com/frameworks/next-js/overview/)

---

## Next Steps After Deployment

Once live on Netlify:

1. **Share the URL** with stakeholders
2. **Gather feedback** on design and UX
3. **Start FASE 3**: Write missing lessons (Levels 0-4)
4. **Set up analytics** (Plausible or similar)
5. **Plan FASE 4**: Database and authentication

---

**Your site will be live in 5 minutes! 🚀**

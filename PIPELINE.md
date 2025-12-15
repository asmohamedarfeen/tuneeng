# CI/CD Pipeline & Page Management Guide

## 🚀 CI/CD Pipeline

The project includes a GitHub Actions CI/CD pipeline that automatically:

1. **Lints & Type Checks** - Ensures code quality and type safety
2. **Builds** - Creates production-ready artifacts
3. **Deploys** - (Configure based on your hosting provider)

### Pipeline Workflow

The pipeline is located at `.github/workflows/ci-cd.yml` and runs on:
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches

### Current Jobs

1. **lint-and-typecheck** - Runs TypeScript type checking
2. **build** - Builds the application and creates artifacts
3. **deploy** - Deploys to production (configure as needed)

### Setting Up Deployment

To configure deployment, edit `.github/workflows/ci-cd.yml` and add your deployment steps in the `deploy` job. Examples:

**Netlify:**
```yaml
- name: Deploy to Netlify
  uses: netlify/actions/cli@master
  with:
    args: deploy --dir=dist --prod
  env:
    NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
    NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

**AWS S3:**
```yaml
- name: Deploy to S3
  uses: aws-actions/configure-aws-credentials@v2
  with:
    aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
    aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
    aws-region: us-east-1
- run: aws s3 sync dist/ s3://your-bucket-name --delete
```

## 📄 Easy Page Management

### Quick Start: Adding a New Page

#### Method 1: Using the Helper Script (Recommended)

```bash
npm run add-page <page-name> [path]
```

**Examples:**
```bash
# Creates /reading page
npm run add-page reading

# Creates custom path
npm run add-page dashboard /admin/dashboard
```

The script will:
- ✅ Create the page component file
- ✅ Register it in the page registry
- ✅ Set up routing automatically

#### Method 2: Manual Setup

1. **Create page file** in `client/src/pages/your-page.tsx`:
```typescript
export default function YourPage() {
  return (
    <div className="container mx-auto p-4">
      <h1>Your Page</h1>
    </div>
  );
}
```

2. **Register in** `client/src/config/pages.ts`:
```typescript
{
  path: "/your-page",
  component: () => import("@/pages/your-page"),
  title: "Your Page - TuneEng AI",
}
```

That's it! Your page is now connected.

### Page Registry System

All pages are managed through `client/src/config/pages.ts`. This centralized configuration provides:

- ✅ **Automatic routing** - No need to manually update App.tsx
- ✅ **Lazy loading** - Pages load on-demand for better performance
- ✅ **SEO-friendly** - Automatic document title updates
- ✅ **Type safety** - Full TypeScript support

### Page Configuration Options

```typescript
{
  path: "/your-page",           // URL path
  component: () => import(...), // Lazy-loaded component
  title: "Page Title",          // Document title (optional)
  protected: true,              // Auth flag (optional, for future use)
}
```

### Current Pages

- `/` - Home page
- `/demo` - Demo page
- `/listening` - Listening practice
- `/leaderboard` - Leaderboard
- `/tracker` - Progress tracker

## 🛠️ Development Workflow

1. **Add your pre-built page** using the helper script or manually
2. **Test locally**: `npm run dev`
3. **Build**: `npm run build`
4. **Deploy**: Push to `main` branch (pipeline handles the rest)

## 📚 Additional Resources

- See `scripts/add-page.md` for detailed page creation guide
- Check existing pages in `client/src/pages/` for examples
- Pipeline configuration: `.github/workflows/ci-cd.yml`

## 🔧 Troubleshooting

**Page not loading?**
- Check that the path in `pages.ts` matches your route
- Verify the component export is `export default`
- Check browser console for errors

**Pipeline failing?**
- Ensure all TypeScript errors are fixed: `npm run check`
- Verify build works locally: `npm run build`
- Check GitHub Actions logs for specific errors


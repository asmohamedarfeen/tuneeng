# How to Add a New Page

## Quick Guide

Adding a new page to TuneEng AI is super simple! Just follow these steps:

### Step 1: Create Your Page Component

Create a new file in `client/src/pages/` directory:

```typescript
// client/src/pages/your-page.tsx
export default function YourPage() {
  return (
    <div>
      <h1>Your Page Content</h1>
    </div>
  );
}
```

### Step 2: Register the Page

Open `client/src/config/pages.ts` and add your page configuration:

```typescript
{
  path: "/your-page",
  component: () => import("@/pages/your-page"),
  title: "Your Page - TuneEng AI",
}
```

That's it! Your page is now connected and accessible at `/your-page`.

## Full Example

Let's say you want to add a "Reading" page:

1. **Create the page file:**
   ```typescript
   // client/src/pages/reading.tsx
   export default function Reading() {
     return (
       <div className="container mx-auto p-4">
         <h1 className="text-3xl font-bold">Reading Practice</h1>
         {/* Your page content */}
       </div>
     );
   }
   ```

2. **Register it in `client/src/config/pages.ts`:**
   ```typescript
   {
     path: "/reading",
     component: () => import("@/pages/reading"),
     title: "Reading - TuneEng AI",
   },
   ```

3. **Done!** Navigate to `/reading` and your page will load.

## Advanced Options

### Protected Routes

If you need authentication, mark the route as protected:

```typescript
{
  path: "/dashboard",
  component: () => import("@/pages/dashboard"),
  title: "Dashboard - TuneEng AI",
  protected: true, // Add this flag
}
```

(Note: You'll need to implement the protection logic in your router if needed)

### Custom Page Titles

Each page can have its own title for SEO:

```typescript
{
  path: "/about",
  component: () => import("@/pages/about"),
  title: "About Us - TuneEng AI", // This sets document.title
}
```

## Tips

- ✅ Pages are lazy-loaded automatically (better performance)
- ✅ All pages get a loading spinner while loading
- ✅ Document title is automatically updated
- ✅ Use TypeScript for type safety
- ✅ Follow the existing page structure for consistency

## Need Help?

Check existing pages in `client/src/pages/` for reference:
- `home.tsx` - Landing page example
- `listening.tsx` - Feature page example
- `leaderboard.tsx` - Data display example


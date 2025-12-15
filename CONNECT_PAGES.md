# 🔗 How to Connect Pre-Built Pages

## If You Have Pre-Built Pages in a Folder

### Step 1: Locate Your Pre-Built Pages
Your pre-built pages should be React components that export a default function.

### Step 2: Copy to Pages Folder
Copy your pre-built page files to `client/src/pages/`

Example:
```
your-prebuilt-folder/
  ├── reading.tsx
  ├── speaking.tsx
  └── writing.tsx

Copy to → client/src/pages/
```

### Step 3: Register in Page Registry
Open `client/src/config/pages.ts` and add your pages:

```typescript
{
  path: "/reading",
  component: () => import("@/pages/reading"),
  title: "Reading - TuneEng AI",
},
{
  path: "/speaking",
  component: () => import("@/pages/speaking"),
  title: "Speaking - TuneEng AI",
},
{
  path: "/writing",
  component: () => import("@/pages/writing"),
  title: "Writing - TuneEng AI",
},
```

### Step 4: Verify Export Format
Make sure your pre-built pages use this format:

```typescript
export default function YourPageName() {
  return (
    <div>
      {/* Your page content */}
    </div>
  );
}
```

## Quick Connect Script

If you have multiple pages, you can use the helper script:

```bash
# For each page
npm run add-page reading
npm run add-page speaking  
npm run add-page writing
```

Then replace the generated template with your pre-built code.

## Need Help?

Tell me:
1. **Where are your pre-built pages?** (folder path)
2. **What are the page names?** (reading, speaking, writing, etc.)
3. **What routes do you want?** (/reading, /speaking, etc.)

I'll connect them all for you! 🚀


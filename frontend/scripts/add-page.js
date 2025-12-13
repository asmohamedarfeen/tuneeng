#!/usr/bin/env node

/**
 * Helper script to add a new page to the application
 * 
 * Usage: node scripts/add-page.js <page-name> [path]
 * 
 * Example:
 *   node scripts/add-page.js reading /reading
 *   node scripts/add-page.js dashboard /dashboard
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const pageName = process.argv[2];
const pagePath = process.argv[3] || `/${pageName.toLowerCase()}`;

if (!pageName) {
  console.error('❌ Error: Page name is required');
  console.log('\nUsage: node scripts/add-page.js <page-name> [path]');
  console.log('Example: node scripts/add-page.js reading /reading');
  process.exit(1);
}

// Validate page name
if (!/^[a-zA-Z][a-zA-Z0-9-]*$/.test(pageName)) {
  console.error('❌ Error: Page name must start with a letter and contain only letters, numbers, and hyphens');
  process.exit(1);
}

// Validate path
if (!pagePath.startsWith('/')) {
  console.error('❌ Error: Path must start with /');
  process.exit(1);
}

const pagesDir = path.join(rootDir, 'client', 'src', 'pages');
const configFile = path.join(rootDir, 'client', 'src', 'config', 'pages.ts');

// Create pages directory if it doesn't exist
if (!fs.existsSync(pagesDir)) {
  fs.mkdirSync(pagesDir, { recursive: true });
}

// Generate page component name (PascalCase)
const componentName = pageName
  .split('-')
  .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
  .join('');

// Create page file
const pageFile = path.join(pagesDir, `${pageName}.tsx`);
const pageTemplate = `/**
 * ${componentName} Page
 * 
 * Generated page component for ${pagePath}
 */

export default function ${componentName}() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">${componentName}</h1>
      {/* Add your page content here */}
    </div>
  );
}
`;

if (fs.existsSync(pageFile)) {
  console.error(`❌ Error: Page file already exists: ${pageFile}`);
  process.exit(1);
}

// Read current config
let configContent = fs.readFileSync(configFile, 'utf-8');

// Generate page config entry
const pageConfig = `  {
    path: "${pagePath}",
    component: () => import("@/pages/${pageName}"),
    title: "${componentName} - TuneEng AI",
  },`;

// Find the insertion point (before the closing bracket of pages array)
const pagesArrayEnd = configContent.lastIndexOf('];');
if (pagesArrayEnd === -1) {
  console.error('❌ Error: Could not find pages array in config file');
  process.exit(1);
}

// Insert the new page config
const beforeArrayEnd = configContent.substring(0, pagesArrayEnd);
const afterArrayEnd = configContent.substring(pagesArrayEnd);

// Add comma if there are existing pages
const needsComma = beforeArrayEnd.trim().endsWith('},');
const newConfig = beforeArrayEnd + (needsComma ? '\n' : '') + pageConfig + '\n' + afterArrayEnd;

// Write files
try {
  fs.writeFileSync(pageFile, pageTemplate);
  fs.writeFileSync(configFile, newConfig);
  
  console.log('✅ Success! Page added successfully');
  console.log(`\n📄 Created: ${pageFile}`);
  console.log(`🔗 Route: ${pagePath}`);
  console.log(`\n💡 Next steps:`);
  console.log(`   1. Edit ${pageFile} to add your page content`);
  console.log(`   2. Start dev server: npm run dev`);
  console.log(`   3. Navigate to: http://localhost:5000${pagePath}`);
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}


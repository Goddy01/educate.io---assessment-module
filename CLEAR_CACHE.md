# How to Fix Webpack Module Errors

If you encounter the error "Cannot find module './730.js'" or similar webpack chunk errors, follow these steps:

## Quick Fix

1. **Stop the development server** (Ctrl+C)

2. **Clear the Next.js cache:**
   ```powershell
   Remove-Item -Recurse -Force frontend\.next
   ```

3. **Clear node_modules cache (optional):**
   ```powershell
   Remove-Item -Recurse -Force frontend\node_modules\.cache
   ```

4. **Restart the development server:**
   ```powershell
   npm run dev
   ```

## Alternative: Full Clean

If the quick fix doesn't work:

1. **Stop the development server**

2. **Remove all build artifacts:**
   ```powershell
   Remove-Item -Recurse -Force frontend\.next
   Remove-Item -Recurse -Force frontend\node_modules\.cache
   ```

3. **Reinstall dependencies (if needed):**
   ```powershell
   cd frontend
   npm install
   ```

4. **Restart:**
   ```powershell
   npm run dev
   ```

## What Causes This?

This error typically occurs due to:
- Stale webpack chunks in the `.next` directory
- Build cache inconsistencies
- Module resolution issues with dynamic imports

The updated `next.config.js` now includes webpack optimizations to prevent these issues.


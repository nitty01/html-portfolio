# Centralized Theme System

This folder contains all centralized styling for the portfolio website. All theme-related code can be modified from these files.

## File Structure

- **`theme.css`** - **MAIN THEME FILE** - CSS variables and theme configuration
- **`base.css`** - Base HTML/body styles, scrollbar, accessibility
- **`components.css`** - Reusable component styles (cards, buttons, forms, etc.)
- **`animations.css`** - All keyframe animations
- **`main.css`** - Main entry point that imports all other files

## How to Change the Theme

### Quick Theme Change

1. Open `css/theme.css`
2. Modify the CSS variables in the `:root` section:
   ```css
   :root {
     --accent: #06b6d4;        /* Change primary color */
     --accent2: #6366f1;       /* Change secondary color */
     --bg-dark: #0f172a;       /* Change dark background */
     /* ... etc */
   }
   ```
3. Optionally update `js/theme-config.js` to match TailwindCSS colors

### Files to Update for Theme Changes

1. **`css/theme.css`** - CSS variables (required)
2. **`js/theme-config.js`** - TailwindCSS config (if using TailwindCSS)

## Usage in HTML Files

All HTML files should include:

```html
<!-- Centralized Theme Configuration -->
<script src="js/theme-config.js"></script>

<!-- TailwindCSS CDN -->
<script src="https://cdn.tailwindcss.com"></script>
<script>
  tailwind.config = window.tailwindConfig;
</script>

<!-- Centralized Styles -->
<link rel="stylesheet" href="css/main.css">
```

For files in `public/` folder, use relative paths:
- `../css/main.css`
- `../js/theme-config.js`

## Adding New Styles

- **Theme variables** → Add to `theme.css`
- **Base styles** → Add to `base.css`
- **Component styles** → Add to `components.css`
- **Animations** → Add to `animations.css`
- **Page-specific styles** → Keep in individual HTML files (minimal)

## Benefits

✅ Single source of truth for all styling
✅ Easy theme changes from one file
✅ Consistent design across all pages
✅ Reduced code duplication
✅ Better maintainability


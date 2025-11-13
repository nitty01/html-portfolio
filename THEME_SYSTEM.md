# Multi-Theme System Documentation

## Overview

The portfolio now supports **7 different themes** that can be switched dynamically:
- **Dark** (default) - Cyan/Indigo
- **Light** - Light background with darker accents
- **Blue** - Blue color scheme
- **Purple** - Purple color scheme
- **Green** - Green color scheme
- **Orange** - Orange color scheme
- **Pink** - Pink color scheme

## Features

✅ **7 Pre-built Themes** - Ready to use color schemes
✅ **Theme Persistence** - Selected theme saved in localStorage
✅ **Smooth Transitions** - Animated theme switching
✅ **TailwindCSS Integration** - Automatically updates TailwindCSS colors
✅ **Accessible** - Keyboard navigation and ARIA labels
✅ **Responsive** - Works on mobile and desktop

## File Structure

```
css/
├── theme.css          # Base theme variables
├── themes.css         # Multi-theme definitions (7 themes)
├── theme-switcher.css # Theme switcher UI styles
└── main.css           # Imports all CSS files

js/
├── theme-switcher.js  # Theme switching logic
└── theme-config.js    # TailwindCSS config with theme updates

components/
└── theme-switcher.html # Reusable theme switcher component
```

## How to Use

### 1. Include Required Files

In your HTML `<head>`:

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

<!-- Theme Switcher Script -->
<script src="js/theme-switcher.js"></script>
```

### 2. Add Theme Switcher to Navigation

Add this HTML to your navigation bar:

```html
<!-- Theme Switcher -->
<div class="theme-switcher">
    <button 
        id="theme-switcher-btn" 
        class="theme-switcher-btn"
        aria-label="Change theme"
        aria-expanded="false"
        aria-haspopup="true"
        onclick="toggleThemeDropdown()"
    >
        <i id="current-theme-icon" class="fas fa-palette"></i>
        <span id="current-theme-indicator" class="hidden sm:inline">Theme</span>
        <i class="fas fa-chevron-down text-xs"></i>
    </button>
    <div 
        id="theme-dropdown" 
        class="theme-dropdown"
        role="menu"
        aria-label="Theme selection"
    >
        <div class="theme-grid">
            <button data-theme-option="dark" class="theme-option" onclick="switchTheme('dark')" role="menuitem">
                <div class="theme-color-preview" style="background: linear-gradient(135deg, #06b6d4, #6366f1);"></div>
                <div class="theme-name">Dark</div>
            </button>
            <!-- Add other theme buttons similarly -->
        </div>
    </div>
</div>
```

### 3. Add JavaScript Functions

Add these functions to your page:

```javascript
// Theme dropdown toggle function
function toggleThemeDropdown() {
    const dropdown = document.getElementById('theme-dropdown');
    const btn = document.getElementById('theme-switcher-btn');
    
    if (dropdown && btn) {
        const isOpen = dropdown.classList.contains('show');
        dropdown.classList.toggle('show');
        btn.setAttribute('aria-expanded', !isOpen);
        
        // Close on outside click
        if (!isOpen) {
            setTimeout(() => {
                document.addEventListener('click', function closeDropdown(e) {
                    if (!dropdown.contains(e.target) && !btn.contains(e.target)) {
                        dropdown.classList.remove('show');
                        btn.setAttribute('aria-expanded', 'false');
                        document.removeEventListener('click', closeDropdown);
                    }
                });
            }, 0);
        }
    }
}

// Close dropdown on Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const dropdown = document.getElementById('theme-dropdown');
        const btn = document.getElementById('theme-switcher-btn');
        if (dropdown && dropdown.classList.contains('show')) {
            dropdown.classList.remove('show');
            if (btn) btn.setAttribute('aria-expanded', 'false');
        }
    }
});
```

## JavaScript API

### Switch Theme Programmatically

```javascript
// Switch to a specific theme
switchTheme('blue');

// Get current theme
const currentTheme = getCurrentTheme();

// Get available themes
const themes = getAvailableThemes();
```

### Listen to Theme Changes

```javascript
window.addEventListener('themechange', function(e) {
    console.log('Theme changed to:', e.detail.theme);
});
```

## Adding a New Theme

1. **Add theme definition** in `css/themes.css`:

```css
[data-theme="your-theme"] {
  --accent: #your-color;
  --accent2: #your-color-2;
  /* ... other variables ... */
}
```

2. **Add theme colors** in `js/theme-switcher.js`:

```javascript
const themes = {
  // ... existing themes ...
  yourTheme: { name: 'Your Theme', icon: 'fas fa-palette', color: '#your-color' }
};
```

3. **Add theme colors** in `js/theme-config.js`:

```javascript
const themeColors = {
  // ... existing themes ...
  yourTheme: { accent: '#your-color', accent2: '#your-color-2' }
};
```

4. **Add theme button** in your HTML:

```html
<button data-theme-option="your-theme" class="theme-option" onclick="switchTheme('your-theme')">
    <div class="theme-color-preview" style="background: linear-gradient(135deg, #your-color, #your-color-2);"></div>
    <div class="theme-name">Your Theme</div>
</button>
```

## Theme Variables

Each theme defines these CSS variables:

- `--accent` - Primary accent color
- `--accent2` - Secondary accent color
- `--bg-dark` - Main background color
- `--bg-light` - Light background color
- `--text-light` - Light text color
- `--text-dark` - Dark text color
- `--glass-bg` - Glass morphism background
- `--glass-border` - Glass morphism border
- `--shadow-*` - Shadow definitions

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- CSS Custom Properties support required
- localStorage support required

## Notes

- Theme selection is persisted in `localStorage` with key `portfolio-theme`
- Default theme is `dark` if no theme is stored
- Theme changes apply instantly with smooth transitions
- TailwindCSS colors are automatically updated when theme changes


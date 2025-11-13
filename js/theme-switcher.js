/**
 * THEME SWITCHER
 * ==============
 * Handles theme switching functionality across all pages.
 * Supports multiple themes with meaningful names and persists selection in localStorage.
 */

(function() {
  'use strict';

  // Available themes with meaningful names
  const themes = {
    ocean: { name: 'Ocean Breeze', icon: 'fas fa-water', color: '#06b6d4' },
    sunrise: { name: 'Sunrise', icon: 'fas fa-sun', color: '#fbbf24' },
    midnight: { name: 'Midnight Blue', icon: 'fas fa-moon', color: '#3b82f6' },
    royal: { name: 'Royal Purple', icon: 'fas fa-crown', color: '#a855f7' },
    forest: { name: 'Forest Green', icon: 'fas fa-tree', color: '#10b981' },
    sunset: { name: 'Sunset', icon: 'fas fa-sunset', color: '#f97316' },
    blossom: { name: 'Blossom', icon: 'fas fa-flower', color: '#ec4899' }
  };

  // Get current theme from localStorage or default to 'ocean'
  function getCurrentTheme() {
    const stored = localStorage.getItem('portfolio-theme');
    // Migrate old theme names to new names
    const migrationMap = {
      'dark': 'ocean',
      'light': 'sunrise',
      'blue': 'midnight',
      'purple': 'royal',
      'green': 'forest',
      'orange': 'sunset',
      'pink': 'blossom'
    };
    if (stored && migrationMap[stored]) {
      localStorage.setItem('portfolio-theme', migrationMap[stored]);
      return migrationMap[stored];
    }
    return stored && themes[stored] ? stored : 'ocean';
  }

  // Set theme in localStorage
  function setTheme(themeName) {
    localStorage.setItem('portfolio-theme', themeName);
  }

  // Apply theme to document
  function applyTheme(themeName) {
    if (!themes[themeName]) {
      console.warn(`Theme "${themeName}" not found. Using default theme.`);
      themeName = 'ocean';
    }

    document.documentElement.setAttribute('data-theme', themeName);
    document.body.setAttribute('data-theme', themeName);
    
    // Update body classes for compatibility
    // Remove both classes first to ensure clean state
    document.body.classList.remove('dark', 'light');
    
    if (themeName === 'sunrise') {
      document.body.classList.add('light');
    } else {
      document.body.classList.add('dark');
    }

    // Update TailwindCSS config if available
    if (window.tailwindConfig && window.tailwindConfig.theme) {
      const themeColors = getThemeColors(themeName);
      if (themeColors) {
        window.tailwindConfig.theme.extend.colors.accent = themeColors.accent;
        window.tailwindConfig.theme.extend.colors.accent2 = themeColors.accent2;
      }
    }

    // Dispatch custom event for theme change
    window.dispatchEvent(new CustomEvent('themechange', { 
      detail: { theme: themeName } 
    }));

    // Update theme switcher UI if it exists
    updateThemeSwitcherUI(themeName);
  }

  // Get theme colors for TailwindCSS
  function getThemeColors(themeName) {
    const colorMap = {
      ocean: { accent: '#06b6d4', accent2: '#6366f1' },
      sunrise: { accent: '#0891b2', accent2: '#4f46e5' },
      midnight: { accent: '#3b82f6', accent2: '#2563eb' },
      royal: { accent: '#a855f7', accent2: '#9333ea' },
      forest: { accent: '#10b981', accent2: '#059669' },
      sunset: { accent: '#f97316', accent2: '#ea580c' },
      blossom: { accent: '#ec4899', accent2: '#db2777' }
    };
    return colorMap[themeName] || colorMap.ocean;
  }

  // Update theme switcher UI
  function updateThemeSwitcherUI(currentTheme) {
    // Update dropdown selected option
    const dropdown = document.getElementById('theme-select');
    if (dropdown) {
      dropdown.value = currentTheme;
    }

    // Update theme buttons
    document.querySelectorAll('[data-theme-option]').forEach(btn => {
      const themeName = btn.getAttribute('data-theme-option');
      if (themeName === currentTheme) {
        btn.classList.add('active', 'ring-2', 'ring-accent');
        btn.classList.remove('opacity-50');
      } else {
        btn.classList.remove('active', 'ring-2', 'ring-accent');
        btn.classList.add('opacity-50');
      }
    });

    // Update current theme indicator
    const indicator = document.getElementById('current-theme-indicator');
    const icon = document.getElementById('current-theme-icon');
    if (indicator && themes[currentTheme]) {
      indicator.textContent = themes[currentTheme].name;
    }
    if (icon && themes[currentTheme]) {
      icon.className = themes[currentTheme].icon;
    }
  }

  // Initialize theme on page load
  function initTheme() {
    const currentTheme = getCurrentTheme();
    applyTheme(currentTheme);
  }

  // Switch theme function (public API)
  window.switchTheme = function(themeName) {
    if (!themes[themeName]) {
      console.error(`Theme "${themeName}" does not exist.`);
      return;
    }
    setTheme(themeName);
    applyTheme(themeName);
  };

  // Get available themes (public API)
  window.getAvailableThemes = function() {
    return Object.keys(themes);
  };

  // Get current theme (public API)
  window.getCurrentTheme = getCurrentTheme;

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTheme);
  } else {
    initTheme();
  }

  // Export theme manager
  window.ThemeManager = {
    switchTheme: window.switchTheme,
    getCurrentTheme: getCurrentTheme,
    getAvailableThemes: window.getAvailableThemes,
    themes: themes
  };

})();

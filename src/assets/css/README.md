# CSS Structure Documentation

## Overview
This directory contains all CSS styles organized by components and pages.

## Structure

```
css/
├── main.css              # Main import file - imports all styles
├── app.css               # App component styles
├── components/           # Component-specific styles
│   ├── navbar.css
│   ├── filters-row.css
│   ├── stadium-card.css
│   ├── stadium-list.css
│   ├── filter-modal.css
│   ├── tabbar.css
│   └── hello-world.css
└── pages/                # Page-specific styles
    ├── home.css
    └── profile.css
```

## Usage

### In Vue Components
```vue
<style src="../assets/css/components/component-name.css"></style>
```

### In Pages
```vue
<style src="../assets/css/pages/page-name.css"></style>
```

## Color Palette
- Primary: `#131712` (Dark Green)
- Secondary: `#6d8566` (Medium Green)
- Accent: `#53d22c` (Bright Green)
- Background: `#f8f9fa` (Light Gray)
- Border: `#e9ecef` (Light Border)
- Text: `#131712` (Dark Text)

## Design Principles
1. **Mobile-first**: All styles are designed for mobile devices
2. **Component-based**: Each component has its own CSS file
3. **Consistent spacing**: Using rem units for consistent spacing
4. **Flexible layouts**: Using flexbox for responsive layouts
5. **Smooth transitions**: All interactive elements have smooth transitions

## Adding New Styles

1. Create a new CSS file in the appropriate directory
2. Import it in `main.css` if it's a global component
3. Import it directly in the Vue component if it's component-specific
4. Follow the existing naming conventions and color palette 
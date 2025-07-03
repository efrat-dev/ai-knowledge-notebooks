# Components Directory

## 🚀 Features

- **Glassmorphism Design**: Translucent backgrounds with backdrop blur effects
- **Cyberpunk Aesthetics**: Neon gradients, glowing effects, and sci-fi styling
- **Advanced Animations**: Smooth transitions, floating effects, and interactive hover states
- **Responsive Design**: Mobile-friendly components that adapt to different screen sizes
- **Performance Optimized**: Hardware-accelerated animations using CSS transforms

## 🎨 Component Overview

### Header Components (`header.css`)
- **Animated Header**: Rotating aurora background with floating text effects
- **Neon Typography**: Gradient text with glow effects using Orbitron and Exo 2 fonts
- **Responsive Titles**: Fluid typography that scales with viewport size
- **Brain Icon Animation**: Pulsing brain icon with smooth transitions

### Fixed Layout Elements (`layout-fixed.css`)
- **GitHub Link**: Floating GitHub button with hover animations
- **Status Indicators**: Real-time status display with color-coded states
- **Error Messages**: Animated error notifications with shake effects
- **Z-index Management**: Proper layering for fixed elements

### Search Interface (`search.css`)
- **Glowing Search Box**: Animated border with neon gradient effects
- **Interactive Focus States**: Scale and glow effects on input focus
- **Loading Animations**: Spinning icons and pulsing text for loading states
- **Search Icon**: Animated search icon with pulse effect

### Card Components (`cards.css`)
- **Category Cards**: Glassmorphism cards with hover lift effects
- **Statistics Cards**: Animated number displays with progress bars
- **Staggered Animations**: Sequential appearance animations
- **Shimmer Effects**: Light sweep animations on hover

### UI Components (`ui-components.css`)
- **Modal Dialogs**: Blurred backdrop with smooth appearance animations
- **Cyber Buttons**: Futuristic button styles with gradient overlays
- **File Items**: Cosmic blue-purple file listing with hover effects
- **Interactive Elements**: Comprehensive hover and focus states

## 🎯 CSS Custom Properties

The components rely on CSS custom properties for consistent theming:

## 🎪 Animation Keyframes

The components include various keyframe animations:

- `titleGlow`: Neon glow effect for headers
- `titleFloat`: Floating animation for titles
- `cardAppear`: Staggered card appearance
- `iconFloat`: Floating icon animation
- `searchBorderGlow`: Pulsing border effect
- `modalAppear`: Modal fade-in animation
- `loadingSpin`: Spinning loading animation

## 🎨 Color Scheme

The design uses a cyberpunk-inspired color palette:
- **Primary**: Electric blue (#667eea) to purple (#764ba2)
- **Secondary**: Coral (#ff6b6b) to pink gradients
- **Accent**: Cyan (#00f2fe) and neon green (#00ff88)
- **Background**: Dark with translucent glass effects
- **Text**: White with various opacity levels

## 📱 Responsive Design

All components are designed with mobile-first principles:
- Fluid typography using `clamp()` functions
- Responsive grid layouts with `auto-fit` and `minmax()`
- Touch-friendly interactive elements
- Optimized animations for mobile performance

## 🔄 Browser Support

- **Modern Browsers**: Full support for Chrome, Firefox, Safari, Edge
- **CSS Features**: Requires support for CSS Grid, Flexbox, Custom Properties, and Backdrop Filter
- **Animations**: Uses CSS transforms for hardware acceleration
- **Fallbacks**: Graceful degradation for older browsers

## 🎯 Performance Considerations

- **Hardware Acceleration**: All animations use `transform` and `opacity`
- **Efficient Selectors**: Optimized CSS selectors for fast rendering
- **Minimal Repaints**: Animations avoid layout-triggering properties
- **Backdrop Filter**: May impact performance on older devices

## 🛠️ Customization

### Modifying Colors
Update the CSS custom properties in `:root` to change the entire theme:

```css
:root {
  --neon-gradient: linear-gradient(135deg, #your-color-1, #your-color-2);
  --glass-bg: rgba(your-custom-color, 0.1);
}
```

### Adjusting Animations
Modify animation duration and easing:

```css
:root {
  --animation-fast: 0.1s;
  --animation-medium: 0.6s;
}
```

### Custom Blur Effects
Adjust the backdrop filter strength:

```css
:root {
  --blur-strength: 20px; /* Increase for more blur */
}
```
---

*Built with modern CSS features and optimized for performance across all devices.*
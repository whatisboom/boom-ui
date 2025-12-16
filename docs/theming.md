# Theme Customization

boom-ui uses an HSL-based color system that supports full hue rotation for brand customization.

## Customizing Brand Colors

You can customize any color family by overriding its hue variable:

```css
:root {
  /* Change accent from default to purple */
  --boom-hue-accent: 280;

  /* Change success from default to teal */
  --boom-hue-success: 180;

  /* Change error from default to pink */
  --boom-hue-error: 340;
}
```

## Available Hue Variables

| Variable | Default | Usage |
|----------|---------|-------|
| `--boom-hue-base` | 215 | Neutral backgrounds, text, borders |
| `--boom-hue-accent` | 213 | Primary brand color, interactive elements |
| `--boom-hue-success` | 142 | Success states, confirmations |
| `--boom-hue-warning` | 38 | Warning states, cautions |
| `--boom-hue-error` | 0 | Error states, destructive actions |
| `--boom-hue-info` | 173 | Info states, notifications |

## Advanced: Saturation & Lightness Customization

For fine-tuned control, you can also adjust saturation and lightness per color family:

### Saturation Variables

| Variable | Default | Effect |
|----------|---------|--------|
| `--boom-sat-base` | 13 | Neutral saturation intensity |
| `--boom-sat-accent` | 94 | Primary brand saturation |
| `--boom-sat-success` | 71 | Success green saturation |
| `--boom-sat-warning` | 96 | Warning amber saturation |
| `--boom-sat-error` | 84 | Error red saturation |
| `--boom-sat-info` | 80 | Info teal saturation |

### Lightness Variables

| Variable | Default | Effect |
|----------|---------|--------|
| `--boom-light-base` | 66 | Neutral brightness |
| `--boom-light-accent` | 68 | Primary brand brightness |
| `--boom-light-success` | 45 | Success green brightness |
| `--boom-light-warning` | 51 | Warning amber brightness |
| `--boom-light-error` | 60 | Error red brightness |
| `--boom-light-info` | 39 | Info teal brightness |

### Example: Muted Neutrals

```css
:root {
  --boom-sat-base: 8;  /* Reduce neutral saturation from 13 to 8 */
}
```

This creates more desaturated, pure-gray neutrals.

### Example: High-Contrast Accent

```css
:root {
  --boom-sat-accent: 100;  /* Max saturation */
  --boom-light-accent: 55;  /* Darker for contrast */
}
```

This creates a more vibrant, high-contrast primary color.

### How It Works

Each color family has a reference shade (500) with base saturation and lightness values. All other shades are calculated proportionally using multipliers. Changing the base variable shifts the entire palette while preserving visual relationships between shades.

## How It Works

The color system has two tiers:

1. **Palettes** - Raw color values using `hsl(var(--boom-hue-X) S% L%)`
2. **Themes** - Semantic tokens that reference palette colors

All palette colors use their family's hue variable, so changing one hue updates all shades in that family.

## Example: Purple Brand

```css
:root {
  --boom-hue-accent: 280;
}
```

This changes:
- All buttons to purple
- Focus rings to purple
- Primary interactive elements to purple
- Light/dark theme variants automatically adjust

## Best Practices

1. **Stay in range**: Hue values are 0-360 (color wheel degrees)
2. **Test both themes**: Verify your hue works in light and dark modes
3. **Check contrast**: Ensure text remains readable on backgrounds
4. **Use semantic tokens**: Components should use `--boom-theme-*` tokens, not palette directly

## Advanced: Per-Component Customization

You can override hue variables at any scope:

```css
.my-component {
  --boom-hue-accent: 340;  /* Pink accent only for this component */
}
```

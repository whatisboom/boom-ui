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

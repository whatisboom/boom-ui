# Theme Customization

boom-ui uses an HSL-based color system that supports full hue rotation for brand customization.

## Customizing Brand Colors

You can customize any color family by overriding its hue variable:

```css
:root {
  /* Change primary from blue to purple */
  --boom-hue-blue: 280;

  /* Change success from green to teal */
  --boom-hue-success: 180;

  /* Change error from red to pink */
  --boom-hue-error: 340;
}
```

## Available Hue Variables

| Variable | Default | Color Family | Usage |
|----------|---------|--------------|-------|
| `--boom-hue-slate` | 215 | Slate blue | Neutral backgrounds, text, borders |
| `--boom-hue-blue` | 213 | Blue | Primary brand color, interactive elements |
| `--boom-hue-success` | 142 | Green | Success states, confirmations |
| `--boom-hue-warning` | 38 | Amber | Warning states, cautions |
| `--boom-hue-error` | 0 | Red | Error states, destructive actions |
| `--boom-hue-info` | 173 | Teal | Info states, notifications |

## How It Works

The color system has two tiers:

1. **Palettes** - Raw color values using `hsl(var(--boom-hue-X) S% L%)`
2. **Themes** - Semantic tokens that reference palette colors

All palette colors use their family's hue variable, so changing one hue updates all shades in that family.

## Example: Purple Brand

```css
:root {
  --boom-hue-blue: 280;
}
```

This changes:
- All buttons from blue to purple
- Focus rings from blue to purple
- Primary interactive elements from blue to purple
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
  --boom-hue-blue: 340;  /* Pink primary only for this component */
}
```

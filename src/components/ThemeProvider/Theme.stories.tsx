import type { Meta, StoryObj } from '@storybook/react';
import { useEffect } from 'react';
import { useTheme } from './ThemeProvider';
import { Button } from '../Button';
import { Card } from '../Card';
import styles from './Theme.stories.module.css';

function ThemeShowcase() {
  const { theme, resolvedTheme, setTheme } = useTheme();

  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <h1 className={styles.title}>boom-ui Theme System</h1>
        <p className={styles.subtitle}>
          Current theme: <strong>{theme}</strong> (resolved: <strong>{resolvedTheme}</strong>)
        </p>

        <div className={styles.controls}>
          <Button onClick={() => setTheme('light')} variant={theme === 'light' ? 'primary' : 'secondary'}>
            Light
          </Button>
          <Button onClick={() => setTheme('dark')} variant={theme === 'dark' ? 'primary' : 'secondary'}>
            Dark
          </Button>
          <Button onClick={() => setTheme('system')} variant={theme === 'system' ? 'primary' : 'secondary'}>
            System
          </Button>
        </div>
      </div>

      <div className={styles.section}>
        <h2>Color Palette</h2>

        <div className={styles.colorSection}>
          <h3>Accent (Primary Brand)</h3>
          <div className={styles.colorGrid}>
            {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
              <div key={shade} className={styles.colorSwatch}>
                <div
                  className={styles.colorBox}
                  style={{ backgroundColor: `var(--boom-palette-accent-${shade})` }}
                />
                <span className={styles.colorLabel}>{shade}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.colorSection}>
          <h3>Base (Neutrals)</h3>
          <div className={styles.colorGrid}>
            {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((shade) => (
              <div key={shade} className={styles.colorSwatch}>
                <div
                  className={styles.colorBox}
                  style={{ backgroundColor: `var(--boom-palette-base-${shade})` }}
                />
                <span className={styles.colorLabel}>{shade}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2>Semantic Colors</h2>
        <div className={styles.semanticGrid}>
          <Card className={styles.semanticCard} style={{ borderLeft: '4px solid var(--boom-theme-success-bg)' }}>
            <h3>Success</h3>
            <p style={{ color: 'var(--boom-theme-success-text)' }}>Operation completed successfully</p>
          </Card>
          <Card className={styles.semanticCard} style={{ borderLeft: '4px solid var(--boom-theme-warning-bg)' }}>
            <h3>Warning</h3>
            <p style={{ color: 'var(--boom-theme-warning-text)' }}>Please review this carefully</p>
          </Card>
          <Card className={styles.semanticCard} style={{ borderLeft: '4px solid var(--boom-theme-error-bg)' }}>
            <h3>Error</h3>
            <p style={{ color: 'var(--boom-theme-error-text)' }}>Something went wrong</p>
          </Card>
          <Card className={styles.semanticCard} style={{ borderLeft: '4px solid var(--boom-theme-info-bg)' }}>
            <h3>Info</h3>
            <p style={{ color: 'var(--boom-theme-info-text)' }}>For your information</p>
          </Card>
        </div>
      </div>

      <div className={styles.section}>
        <h2>Typography (DM Sans)</h2>
        <div className={styles.typeSection}>
          <h1 style={{ fontWeight: 700 }}>Heading 1 - Bold</h1>
          <h2 style={{ fontWeight: 600 }}>Heading 2 - SemiBold</h2>
          <h3 style={{ fontWeight: 600 }}>Heading 3 - SemiBold</h3>
          <p style={{ fontWeight: 500 }}>Body text - Medium weight for UI elements</p>
          <p style={{ fontWeight: 400 }}>Body text - Regular weight for general content</p>
          <p style={{ fontSize: 'var(--boom-font-size-sm)', color: 'var(--boom-theme-text-secondary)' }}>
            Small text - Secondary color
          </p>
        </div>
      </div>

      <div className={styles.section}>
        <h2>Elevation & Shadows</h2>
        <div className={styles.shadowGrid}>
          <Card style={{ boxShadow: 'var(--boom-shadow-sm)' }}>
            <h4>Small Shadow</h4>
            <p>Subtle elevation</p>
          </Card>
          <Card style={{ boxShadow: 'var(--boom-shadow-md)' }}>
            <h4>Medium Shadow</h4>
            <p>Standard cards</p>
          </Card>
          <Card style={{ boxShadow: 'var(--boom-shadow-lg)' }}>
            <h4>Large Shadow</h4>
            <p>Modals & popovers</p>
          </Card>
        </div>
      </div>
    </div>
  );
}

const meta: Meta<typeof ThemeShowcase> = {
  title: 'Theme/Showcase',
  component: ThemeShowcase,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof ThemeShowcase>;

export const Default: Story = {};

export const CustomHues: Story = {
  render: (args) => {
    const { theme, setTheme } = useTheme();

    // Apply hue customizations
    useEffect(() => {
      if (args.primaryHue !== undefined) {
        document.documentElement.style.setProperty('--boom-hue-accent', String(args.primaryHue));
      }
      if (args.successHue !== undefined) {
        document.documentElement.style.setProperty('--boom-hue-success', String(args.successHue));
      }
      if (args.errorHue !== undefined) {
        document.documentElement.style.setProperty('--boom-hue-error', String(args.errorHue));
      }

      return () => {
        // Reset on unmount
        document.documentElement.style.removeProperty('--boom-hue-accent');
        document.documentElement.style.removeProperty('--boom-hue-success');
        document.documentElement.style.removeProperty('--boom-hue-error');
      };
    }, [args.primaryHue, args.successHue, args.errorHue]);

    return (
      <div className={styles.container}>
        <div className={styles.section}>
          <h1 className={styles.title}>Hue Customization Demo</h1>
          <p className={styles.subtitle}>
            Adjust the hue controls to see brand colors change dynamically.
          </p>

          <div className={styles.controls}>
            <Button onClick={() => setTheme('light')} variant={theme === 'light' ? 'primary' : 'secondary'}>
              Light
            </Button>
            <Button onClick={() => setTheme('dark')} variant={theme === 'dark' ? 'primary' : 'secondary'}>
              Dark
            </Button>
            <Button onClick={() => setTheme('system')} variant={theme === 'system' ? 'primary' : 'secondary'}>
              System
            </Button>
          </div>
        </div>

        <div className={styles.section}>
          <h2>Interactive Elements</h2>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <Button variant="primary">Primary Button</Button>
            <Button variant="secondary">Secondary Button</Button>
          </div>
        </div>

        <div className={styles.section}>
          <h2>Semantic Colors</h2>
          <div className={styles.semanticGrid}>
            <Card className={styles.semanticCard} style={{ borderLeft: '4px solid var(--boom-theme-success-bg)' }}>
              <h3>Success</h3>
              <p style={{ color: 'var(--boom-theme-success-text)' }}>Operation completed successfully</p>
            </Card>
            <Card className={styles.semanticCard} style={{ borderLeft: '4px solid var(--boom-theme-error-bg)' }}>
              <h3>Error</h3>
              <p style={{ color: 'var(--boom-theme-error-text)' }}>Something went wrong</p>
            </Card>
          </div>
        </div>

        <div className={styles.section}>
          <h2>Color Palette</h2>
          <div className={styles.colorSection}>
            <h3>Accent (Primary Brand)</h3>
            <div className={styles.colorGrid}>
              {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
                <div key={shade} className={styles.colorSwatch}>
                  <div
                    className={styles.colorBox}
                    style={{ backgroundColor: `var(--boom-palette-accent-${shade})` }}
                  />
                  <span className={styles.colorLabel}>{shade}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  },
  argTypes: {
    primaryHue: {
      control: { type: 'range', min: 0, max: 360, step: 1 },
      defaultValue: 213,
      description: 'Primary brand hue (0-360)',
    },
    successHue: {
      control: { type: 'range', min: 0, max: 360, step: 1 },
      defaultValue: 142,
      description: 'Success state hue (0-360)',
    },
    errorHue: {
      control: { type: 'range', min: 0, max: 360, step: 1 },
      defaultValue: 0,
      description: 'Error state hue (0-360)',
    },
  },
  args: {
    primaryHue: 213,
    successHue: 142,
    errorHue: 0,
  },
};

export const AdvancedCustomization: Story = {
  render: (args) => {
    const { theme, setTheme } = useTheme();

    useEffect(() => {
      if (args.baseSaturation !== undefined) {
        document.documentElement.style.setProperty('--boom-sat-base', String(args.baseSaturation));
      }
      if (args.baseLightness !== undefined) {
        document.documentElement.style.setProperty('--boom-light-base', String(args.baseLightness));
      }
      if (args.accentSaturation !== undefined) {
        document.documentElement.style.setProperty('--boom-sat-accent', String(args.accentSaturation));
      }
      if (args.accentLightness !== undefined) {
        document.documentElement.style.setProperty('--boom-light-accent', String(args.accentLightness));
      }

      return () => {
        document.documentElement.style.removeProperty('--boom-sat-base');
        document.documentElement.style.removeProperty('--boom-light-base');
        document.documentElement.style.removeProperty('--boom-sat-accent');
        document.documentElement.style.removeProperty('--boom-light-accent');
      };
    }, [args.baseSaturation, args.baseLightness, args.accentSaturation, args.accentLightness]);

    return (
      <div className={styles.container}>
        <div className={styles.section}>
          <h1 className={styles.title}>Advanced S/L Customization</h1>
          <p className={styles.subtitle}>
            Fine-tune saturation and lightness for precise brand matching.
          </p>

          <div className={styles.controls}>
            <Button onClick={() => setTheme('light')} variant={theme === 'light' ? 'primary' : 'secondary'}>
              Light
            </Button>
            <Button onClick={() => setTheme('dark')} variant={theme === 'dark' ? 'primary' : 'secondary'}>
              Dark
            </Button>
          </div>
        </div>

        <div className={styles.section}>
          <h2>Base (Neutrals)</h2>
          <div className={styles.colorGrid}>
            {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((shade) => (
              <div key={shade} className={styles.colorSwatch}>
                <div
                  className={styles.colorBox}
                  style={{ backgroundColor: `var(--boom-palette-base-${shade})` }}
                />
                <span className={styles.colorLabel}>{shade}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <h2>Accent (Primary)</h2>
          <div className={styles.colorGrid}>
            {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
              <div key={shade} className={styles.colorSwatch}>
                <div
                  className={styles.colorBox}
                  style={{ backgroundColor: `var(--boom-palette-accent-${shade})` }}
                />
                <span className={styles.colorLabel}>{shade}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <h2>Interactive Elements</h2>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Button variant="primary">Primary Button</Button>
            <Button variant="secondary">Secondary Button</Button>
          </div>
        </div>
      </div>
    );
  },
  argTypes: {
    baseSaturation: {
      control: { type: 'range', min: 0, max: 50, step: 1 },
      defaultValue: 13,
      description: 'Base saturation (0-50, default: 13)',
    },
    baseLightness: {
      control: { type: 'range', min: 30, max: 90, step: 1 },
      defaultValue: 66,
      description: 'Base lightness (30-90, default: 66)',
    },
    accentSaturation: {
      control: { type: 'range', min: 40, max: 100, step: 1 },
      defaultValue: 94,
      description: 'Accent saturation (40-100, default: 94)',
    },
    accentLightness: {
      control: { type: 'range', min: 40, max: 90, step: 1 },
      defaultValue: 68,
      description: 'Accent lightness (40-90, default: 68)',
    },
  },
  args: {
    baseSaturation: 13,
    baseLightness: 66,
    accentSaturation: 94,
    accentLightness: 68,
  },
};

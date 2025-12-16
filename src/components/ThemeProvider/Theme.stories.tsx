import type { Meta, StoryObj } from '@storybook/react';
import { useEffect, useState } from 'react';
import { useTheme } from './ThemeProvider';
import { Button } from '../Button';
import { Card } from '../Card';
import { Input } from '../Input';
import { Slider } from '../Slider';
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

export const ThemeCustomizer: Story = {
  render: () => {
    const { theme, setTheme } = useTheme();

    // State for all 18 HSL values
    const [baseHue, setBaseHue] = useState(215);
    const [baseSat, setBaseSat] = useState(13);
    const [baseLight, setBaseLight] = useState(66);

    const [accentHue, setAccentHue] = useState(213);
    const [accentSat, setAccentSat] = useState(94);
    const [accentLight, setAccentLight] = useState(68);

    const [successHue, setSuccessHue] = useState(142);
    const [successSat, setSuccessSat] = useState(71);
    const [successLight, setSuccessLight] = useState(45);

    const [warningHue, setWarningHue] = useState(38);
    const [warningSat, setWarningSat] = useState(96);
    const [warningLight, setWarningLight] = useState(51);

    const [errorHue, setErrorHue] = useState(0);
    const [errorSat, setErrorSat] = useState(84);
    const [errorLight, setErrorLight] = useState(60);

    const [infoHue, setInfoHue] = useState(173);
    const [infoSat, setInfoSat] = useState(80);
    const [infoLight, setInfoLight] = useState(39);

    const [activeTab, setActiveTab] = useState<'css' | 'js'>('css');

    // Apply CSS variables live
    useEffect(() => {
      document.documentElement.style.setProperty('--boom-hue-base', String(baseHue));
      document.documentElement.style.setProperty('--boom-sat-base', String(baseSat));
      document.documentElement.style.setProperty('--boom-light-base', String(baseLight));

      document.documentElement.style.setProperty('--boom-hue-accent', String(accentHue));
      document.documentElement.style.setProperty('--boom-sat-accent', String(accentSat));
      document.documentElement.style.setProperty('--boom-light-accent', String(accentLight));

      document.documentElement.style.setProperty('--boom-hue-success', String(successHue));
      document.documentElement.style.setProperty('--boom-sat-success', String(successSat));
      document.documentElement.style.setProperty('--boom-light-success', String(successLight));

      document.documentElement.style.setProperty('--boom-hue-warning', String(warningHue));
      document.documentElement.style.setProperty('--boom-sat-warning', String(warningSat));
      document.documentElement.style.setProperty('--boom-light-warning', String(warningLight));

      document.documentElement.style.setProperty('--boom-hue-error', String(errorHue));
      document.documentElement.style.setProperty('--boom-sat-error', String(errorSat));
      document.documentElement.style.setProperty('--boom-light-error', String(errorLight));

      document.documentElement.style.setProperty('--boom-hue-info', String(infoHue));
      document.documentElement.style.setProperty('--boom-sat-info', String(infoSat));
      document.documentElement.style.setProperty('--boom-light-info', String(infoLight));

      return () => {
        // Cleanup on unmount
        document.documentElement.style.removeProperty('--boom-hue-base');
        document.documentElement.style.removeProperty('--boom-sat-base');
        document.documentElement.style.removeProperty('--boom-light-base');

        document.documentElement.style.removeProperty('--boom-hue-accent');
        document.documentElement.style.removeProperty('--boom-sat-accent');
        document.documentElement.style.removeProperty('--boom-light-accent');

        document.documentElement.style.removeProperty('--boom-hue-success');
        document.documentElement.style.removeProperty('--boom-sat-success');
        document.documentElement.style.removeProperty('--boom-light-success');

        document.documentElement.style.removeProperty('--boom-hue-warning');
        document.documentElement.style.removeProperty('--boom-sat-warning');
        document.documentElement.style.removeProperty('--boom-light-warning');

        document.documentElement.style.removeProperty('--boom-hue-error');
        document.documentElement.style.removeProperty('--boom-sat-error');
        document.documentElement.style.removeProperty('--boom-light-error');

        document.documentElement.style.removeProperty('--boom-hue-info');
        document.documentElement.style.removeProperty('--boom-sat-info');
        document.documentElement.style.removeProperty('--boom-light-info');
      };
    }, [
      baseHue,
      baseSat,
      baseLight,
      accentHue,
      accentSat,
      accentLight,
      successHue,
      successSat,
      successLight,
      warningHue,
      warningSat,
      warningLight,
      errorHue,
      errorSat,
      errorLight,
      infoHue,
      infoSat,
      infoLight,
    ]);

    // Generate code outputs
    const cssOutput = `:root {
  --boom-hue-base: ${baseHue};
  --boom-sat-base: ${baseSat};
  --boom-light-base: ${baseLight};
  --boom-hue-accent: ${accentHue};
  --boom-sat-accent: ${accentSat};
  --boom-light-accent: ${accentLight};
  --boom-hue-success: ${successHue};
  --boom-sat-success: ${successSat};
  --boom-light-success: ${successLight};
  --boom-hue-warning: ${warningHue};
  --boom-sat-warning: ${warningSat};
  --boom-light-warning: ${warningLight};
  --boom-hue-error: ${errorHue};
  --boom-sat-error: ${errorSat};
  --boom-light-error: ${errorLight};
  --boom-hue-info: ${infoHue};
  --boom-sat-info: ${infoSat};
  --boom-light-info: ${infoLight};
}`;

    const jsOutput = `{
  base: { hue: ${baseHue}, sat: ${baseSat}, light: ${baseLight} },
  accent: { hue: ${accentHue}, sat: ${accentSat}, light: ${accentLight} },
  success: { hue: ${successHue}, sat: ${successSat}, light: ${successLight} },
  warning: { hue: ${warningHue}, sat: ${warningSat}, light: ${warningLight} },
  error: { hue: ${errorHue}, sat: ${errorSat}, light: ${errorLight} },
  info: { hue: ${infoHue}, sat: ${infoSat}, light: ${infoLight} }
}`;

    return (
      <div className={styles.container}>
        {/* Controls Section */}
        <div className={styles.section}>
          <h1 className={styles.title}>Theme Customizer</h1>
          <p className={styles.subtitle}>
            Adjust HSL values and copy the generated code to customize your theme.
          </p>

          <div className={styles.controls}>
            <Button onClick={() => setTheme('light')} variant={theme === 'light' ? 'primary' : 'secondary'}>
              Light
            </Button>
            <Button onClick={() => setTheme('dark')} variant={theme === 'dark' ? 'primary' : 'secondary'}>
              Dark
            </Button>
          </div>

          {/* 6 color family groups */}
          <div className={styles.controlsGrid}>
            {/* Base */}
            <div className={styles.familyGroup}>
              <h3>Base (Neutrals)</h3>
              <Slider label="Hue" value={baseHue} onChange={setBaseHue} min={0} max={360} />
              <Slider label="Saturation" value={baseSat} onChange={setBaseSat} min={0} max={100} />
              <Slider label="Lightness" value={baseLight} onChange={setBaseLight} min={0} max={100} />
            </div>

            {/* Accent */}
            <div className={styles.familyGroup}>
              <h3>Accent (Primary)</h3>
              <Slider label="Hue" value={accentHue} onChange={setAccentHue} min={0} max={360} />
              <Slider label="Saturation" value={accentSat} onChange={setAccentSat} min={0} max={100} />
              <Slider label="Lightness" value={accentLight} onChange={setAccentLight} min={0} max={100} />
            </div>

            {/* Success */}
            <div className={styles.familyGroup}>
              <h3>Success</h3>
              <Slider label="Hue" value={successHue} onChange={setSuccessHue} min={0} max={360} />
              <Slider label="Saturation" value={successSat} onChange={setSuccessSat} min={0} max={100} />
              <Slider label="Lightness" value={successLight} onChange={setSuccessLight} min={0} max={100} />
            </div>

            {/* Warning */}
            <div className={styles.familyGroup}>
              <h3>Warning</h3>
              <Slider label="Hue" value={warningHue} onChange={setWarningHue} min={0} max={360} />
              <Slider label="Saturation" value={warningSat} onChange={setWarningSat} min={0} max={100} />
              <Slider label="Lightness" value={warningLight} onChange={setWarningLight} min={0} max={100} />
            </div>

            {/* Error */}
            <div className={styles.familyGroup}>
              <h3>Error</h3>
              <Slider label="Hue" value={errorHue} onChange={setErrorHue} min={0} max={360} />
              <Slider label="Saturation" value={errorSat} onChange={setErrorSat} min={0} max={100} />
              <Slider label="Lightness" value={errorLight} onChange={setErrorLight} min={0} max={100} />
            </div>

            {/* Info */}
            <div className={styles.familyGroup}>
              <h3>Info</h3>
              <Slider label="Hue" value={infoHue} onChange={setInfoHue} min={0} max={360} />
              <Slider label="Saturation" value={infoSat} onChange={setInfoSat} min={0} max={100} />
              <Slider label="Lightness" value={infoLight} onChange={setInfoLight} min={0} max={100} />
            </div>
          </div>
        </div>

        {/* Code Output Section */}
        <div className={styles.section}>
          <h2>Generated Code</h2>
          <div className={styles.tabs}>
            <button onClick={() => setActiveTab('css')} className={activeTab === 'css' ? styles.activeTab : ''}>
              CSS
            </button>
            <button onClick={() => setActiveTab('js')} className={activeTab === 'js' ? styles.activeTab : ''}>
              JavaScript
            </button>
          </div>
          <pre className={styles.codeBlock}>
            <code>{activeTab === 'css' ? cssOutput : jsOutput}</code>
          </pre>
        </div>

        {/* Live Preview Section */}
        <div className={styles.section}>
          <h2>Live Preview</h2>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <Button variant="primary">Primary Button</Button>
            <Button variant="secondary">Secondary Button</Button>
          </div>

          <div style={{ marginTop: '2rem', maxWidth: '400px' }}>
            <Input label="Test Input" placeholder="Type here..." />
            <div style={{ marginTop: '1rem' }}>
              <Input label="Error State" error="This field has an error" defaultValue="Invalid input" />
            </div>
          </div>

          <div className={styles.semanticGrid} style={{ marginTop: '2rem' }}>
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
      </div>
    );
  },
};

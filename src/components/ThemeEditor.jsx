import { useEffect, useState } from 'react';
import { X, RotateCcw } from 'lucide-react';
import { useEdit } from '../context/EditContext';

const THEME_DEFAULTS = {
  colorMaroon:    '#8c1d40',
  colorGold:      '#c8922a',
  colorAccent:    '#2563eb',
  colorBg:        '#fdf8f4',
  colorSurface:   '#ffffff',
  colorSurface2:  '#fdf0e5',
  colorBorder:    'rgba(140,29,64,0.1)',
  textPrimary:    '#111827',
  textSecondary:  '#4b5563',
  textMuted:      '#9ca3af',
};

const THEME_GROUPS = [
  {
    group: 'Brand',
    fields: [
      { key: 'colorMaroon',   label: 'Primary (Maroon)',  cssVar: '--color-maroon',   desc: 'Buttons, active states, navbar brand' },
      { key: 'colorGold',     label: 'Accent (Gold)',     cssVar: '--color-gold',     desc: 'Highlights, eyebrows, links, stats' },
      { key: 'colorAccent',   label: 'Link Blue',         cssVar: '--color-accent',   desc: 'External links, focus rings' },
    ],
  },
  {
    group: 'Backgrounds',
    fields: [
      { key: 'colorBg',       label: 'Page Background',   cssVar: '--color-bg',       desc: 'Overall page background' },
      { key: 'colorSurface',  label: 'Card Surface',      cssVar: '--color-surface',  desc: 'Navbar, cards, panels' },
      { key: 'colorSurface2', label: 'Alt Surface',       cssVar: '--color-surface-2',desc: 'Hover, news sidebar, alternating rows' },
    ],
  },
  {
    group: 'Borders',
    fields: [
      { key: 'colorBorder',   label: 'Default Border',    cssVar: '--color-border',   desc: 'All card & section borders' },
    ],
  },
  {
    group: 'Text',
    fields: [
      { key: 'textPrimary',   label: 'Primary Text',      cssVar: '--text-primary',   desc: 'Headings, body' },
      { key: 'textSecondary', label: 'Secondary Text',    cssVar: '--text-secondary', desc: 'Descriptions, subtitles' },
      { key: 'textMuted',     label: 'Muted Text',        cssVar: '--text-muted',     desc: 'Labels, meta, dates' },
    ],
  },
];

function ColorSwatch({ field, value, onChange, onReset, isChanged }) {
  const [focused, setFocused] = useState(false);

  // Determine display color (handle rgba for border)
  const displayColor = value?.startsWith('rgba') ? '#8c1d40' : (value || '#000000');

  return (
    <div className={`theme-swatch-row${focused ? ' focused' : ''}${isChanged ? ' changed' : ''}`}>
      <div className="theme-swatch-info">
        {/* Large color wheel trigger */}
        <label className="theme-swatch-preview" style={{ position: 'relative', cursor: 'pointer' }}>
          <div
            className="theme-swatch-circle"
            style={{ background: value || '#000000' }}
          />
          {/* Hidden native color picker — triggers the OS color wheel */}
          <input
            type="color"
            value={displayColor}
            onChange={e => {
              const hex = e.target.value;
              // If original was rgba, keep it as hex (simpler)
              onChange(hex);
            }}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="theme-color-input-hidden"
          />
          <span className="theme-swatch-click-hint">Click to open color wheel</span>
        </label>

        <div className="theme-swatch-meta">
          <div className="theme-swatch-label">{field.label}</div>
          <div className="theme-swatch-desc">{field.desc}</div>
        </div>
      </div>

      {/* Hex / value edit inline */}
      <div className="theme-swatch-controls">
        <input
          type="text"
          className="theme-hex-input"
          value={value || ''}
          onChange={e => onChange(e.target.value)}
          placeholder="#rrggbb"
          spellCheck={false}
        />
        {isChanged && (
          <button
            className="theme-reset-btn"
            onClick={onReset}
            title="Reset to default"
          >
            <RotateCcw size={12} />
          </button>
        )}
      </div>
    </div>
  );
}

export default function ThemeEditor({ open, onClose }) {
  const { liveData, updateSection } = useEdit();
  const theme = { ...THEME_DEFAULTS, ...(liveData.theme || {}) };

  // Apply CSS vars live as user adjusts
  useEffect(() => {
    const root = document.documentElement;
    THEME_GROUPS.forEach(g => {
      g.fields.forEach(f => {
        const val = theme[f.key];
        if (val) root.style.setProperty(f.cssVar, val);
      });
    });
  }, [theme]);

  // Cleanup: remove inline overrides when theme editor closes without save
  // (they're re-applied from liveData on next open, or saved to Firestore)

  const update = (key, value) => {
    updateSection('theme', { ...theme, [key]: value });
  };

  const resetField = (key) => {
    const next = { ...theme };
    delete next[key];
    // Restore CSS var to original stylesheet value
    const field = THEME_GROUPS.flatMap(g => g.fields).find(f => f.key === key);
    if (field) document.documentElement.style.removeProperty(field.cssVar);
    updateSection('theme', next);
  };

  const resetAll = () => {
    THEME_GROUPS.forEach(g => {
      g.fields.forEach(f => {
        document.documentElement.style.removeProperty(f.cssVar);
      });
    });
    updateSection('theme', {});
  };

  if (!open) return null;

  return (
    <>
      <div className="edit-drawer-backdrop" onClick={onClose} />
      <div className="edit-drawer edit-drawer-wide animate-slide-in-right">
        <div className="edit-drawer-header">
          <div>
            <span className="edit-drawer-title">🎨 Theme Colors</span>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>
              Click a swatch to open the color wheel. Changes preview live.
            </div>
          </div>
          <button className="edit-drawer-close" onClick={onClose}><X size={18} /></button>
        </div>

        <div className="edit-drawer-body">
          {THEME_GROUPS.map(group => (
            <div key={group.group} className="theme-group">
              <div className="theme-group-title">{group.group}</div>
              {group.fields.map(f => {
                const savedDefault = THEME_DEFAULTS[f.key];
                const currentVal = theme[f.key];
                const isChanged = currentVal !== savedDefault;
                return (
                  <ColorSwatch
                    key={f.key}
                    field={f}
                    value={currentVal}
                    onChange={v => update(f.key, v)}
                    onReset={() => resetField(f.key)}
                    isChanged={isChanged}
                  />
                );
              })}
            </div>
          ))}

          <div className="theme-reset-all">
            <button onClick={resetAll} className="theme-reset-all-btn">
              <RotateCcw size={13} />
              Reset All to ASU Defaults
            </button>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 6 }}>
              Click <strong>Save Changes</strong> in the toolbar to persist your theme.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

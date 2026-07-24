

/**
 * Reusable form field for edit drawers.
 * value/onChange are controlled.
 */
export function Field({ label, value, onChange, type = 'text', rows, placeholder }) {
  return (
    <div className="admin-field">
      <label>{label}</label>
      {rows ? (
        <textarea
          rows={rows}
          value={value ?? ''}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
        />
      ) : (
        <input
          type={type}
          value={value ?? ''}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
        />
      )}
    </div>
  );
}

/**
 * Color field — shows a native color picker + hex value.
 */
export function ColorField({ label, value, onChange }) {
  return (
    <div className="admin-field">
      <label>{label}</label>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <input
          type="color"
          value={value ?? '#000000'}
          onChange={e => onChange(e.target.value)}
          style={{ width: 48, height: 36, padding: 2, cursor: 'pointer', borderRadius: 6, border: '1px solid var(--color-border)' }}
        />
        <input
          type="text"
          value={value ?? ''}
          onChange={e => onChange(e.target.value)}
          placeholder="#rrggbb"
          style={{ flex: 1 }}
          className="color-hex-input"
        />
      </div>
    </div>
  );
}

/**
 * Section divider used inside drawers.
 */
export function DrawerSection({ title }) {
  return (
    <div style={{
      fontSize: '0.7rem',
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
      color: 'var(--text-muted)',
      padding: '1rem 0 0.5rem',
      borderTop: '1px solid var(--color-border)',
      marginTop: '0.5rem',
    }}>
      {title}
    </div>
  );
}

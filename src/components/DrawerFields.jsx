import { useState, useRef } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { uploadImage, resolveImagePath } from '../lib/images';

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
 * Image field — uploads a file to the site's GitHub repo and stores the
 * resulting URL. Shows a preview of the current image (supports both
 * new URLs and legacy public/images/<folder> filenames).
 */
export function ImageField({ label, value, onChange, folder = '', desc }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const url = await uploadImage(file, folder);
      onChange(url);
    } catch (err) {
      setError(err.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const preview = resolveImagePath(value, folder);

  return (
    <div className="admin-field">
      <label>{label}</label>
      {desc && <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0 0 0.5rem' }}>{desc}</p>}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{
          width: 64, height: 64, borderRadius: 'var(--r-md)', overflow: 'hidden',
          background: 'var(--color-bg)', border: '1px solid var(--color-border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          {preview ? (
            <img src={preview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={e => { e.target.style.display = 'none'; }} />
          ) : (
            <Upload size={18} style={{ opacity: 0.35 }} />
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: 1 }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              className="btn-add"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? <Loader2 size={13} className="spin" /> : <Upload size={13} />}
              {uploading ? 'Uploading…' : value ? 'Replace Image' : 'Upload Image'}
            </button>
            {value && (
              <button type="button" className="btn-delete" onClick={() => onChange('')} disabled={uploading}>
                <X size={12} /> Remove
              </button>
            )}
          </div>
          <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
          {error && <span style={{ fontSize: '0.78rem', color: '#c0392b' }}>{error}</span>}
        </div>
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

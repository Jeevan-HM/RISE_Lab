import { useState, useEffect } from 'react';
import { GitBranch, CheckCircle, AlertCircle, Loader, X, ExternalLink, Eye, EyeOff } from 'lucide-react';
import { getGitHubConfig, saveGitHubConfig, commitToGitHub } from '../lib/githubSync';

export default function GitHubSettings({ onClose }) {
  const [config, setConfig] = useState({ token: '', owner: '', repo: '', branch: 'main' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [status, setStatus] = useState(null); // { ok, message }
  const [showToken, setShowToken] = useState(false);

  useEffect(() => {
    getGitHubConfig().then(cfg => {
      if (cfg) setConfig(cfg);
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    if (!config.token || !config.owner || !config.repo) {
      setStatus({ ok: false, message: 'Please fill in all required fields.' });
      return;
    }
    setSaving(true);
    try {
      await saveGitHubConfig(config);
      setStatus({ ok: true, message: 'GitHub configuration saved!' });
    } catch (e) {
      setStatus({ ok: false, message: `Error: ${e.message}` });
    } finally {
      setSaving(false);
    }
  };

  const handleTest = async () => {
    setTesting(true);
    setStatus(null);
    try {
      await saveGitHubConfig(config); // Save first
      const result = await commitToGitHub({ _test: true, ts: Date.now() }, 'Test commit from RISE Lab admin');
      if (result.ok) {
        setStatus({ ok: true, message: '✓ Connection successful! Test commit pushed to GitHub.' });
      } else {
        setStatus({ ok: false, message: result.error || 'Connection failed.' });
      }
    } catch (e) {
      setStatus({ ok: false, message: `Error: ${e.message}` });
    } finally {
      setTesting(false);
    }
  };

  const field = (label, key, opts = {}) => (
    <div style={{ marginBottom: '0.75rem' }}>
      <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
        {label} {opts.required && <span style={{ color: '#e74c3c' }}>*</span>}
      </label>
      <div style={{ position: 'relative' }}>
        <input
          type={key === 'token' && !showToken ? 'password' : 'text'}
          value={config[key] || ''}
          onChange={e => setConfig(c => ({ ...c, [key]: e.target.value }))}
          placeholder={opts.placeholder || ''}
          style={{
            width: '100%', padding: '8px 12px', borderRadius: 'var(--r-md)',
            background: 'var(--color-bg)', border: '1px solid var(--color-border)',
            color: 'var(--text-primary)', fontFamily: 'inherit', fontSize: '0.88rem',
            paddingRight: key === 'token' ? '40px' : '12px',
            boxSizing: 'border-box',
          }}
        />
        {key === 'token' && (
          <button onClick={() => setShowToken(s => !s)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 0, display: 'flex' }}>
            {showToken ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 2000,
      background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }} onClick={onClose}>
      <div style={{
        background: 'var(--color-surface)', borderRadius: 'var(--r-xl)',
        border: '1px solid var(--color-border)', boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
        width: '100%', maxWidth: 480, padding: '1.75rem',
        maxHeight: '90vh', overflowY: 'auto',
      }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ background: '#24292e', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <GitBranch size={20} color="#fff" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>GitHub Version Control</h3>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>Auto-commit on every save</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }}>
            <X size={18} />
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}><Loader size={20} style={{ animation: 'spin 1s linear infinite' }} /></div>
        ) : (
          <>
            {/* Setup instructions */}
            <div style={{ background: 'rgba(36,41,46,0.08)', borderRadius: 'var(--r-md)', padding: '0.75rem 1rem', marginBottom: '1.25rem', fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              <strong>Setup:</strong> Create a GitHub PAT at{' '}
              <a href="https://github.com/settings/tokens/new" target="_blank" rel="noreferrer" style={{ color: 'var(--color-accent)', display: 'inline-flex', alignItems: 'center', gap: 2 }}>
                github.com/settings/tokens <ExternalLink size={11} />
              </a>{' '}
              with <code style={{ background: 'rgba(0,0,0,0.1)', padding: '1px 5px', borderRadius: 3 }}>repo</code> scope (or <code style={{ background: 'rgba(0,0,0,0.1)', padding: '1px 5px', borderRadius: 3 }}>public_repo</code> for public repos). Your token is stored encrypted in Firestore, never in code.
            </div>

            {field('Personal Access Token (PAT)', 'token', { required: true, placeholder: 'ghp_xxxxxxxxxxxxxxxxxxxx' })}
            {field('GitHub Username / Org', 'owner', { required: true, placeholder: 'Jeevan-HM' })}
            {field('Repository Name', 'repo', { required: true, placeholder: 'RISE_Lab-backups' })}
            {field('Branch', 'branch', { placeholder: 'main' })}

            {/* Status */}
            {status && (
              <div style={{
                display: 'flex', alignItems: 'flex-start', gap: '0.5rem',
                padding: '0.75rem', borderRadius: 'var(--r-md)', marginBottom: '1rem',
                background: status.ok ? 'rgba(39,174,96,0.12)' : 'rgba(231,76,60,0.12)',
                color: status.ok ? '#27ae60' : '#e74c3c',
                fontSize: '0.85rem',
              }}>
                {status.ok ? <CheckCircle size={16} style={{ flexShrink: 0, marginTop: 1 }} /> : <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 1 }} />}
                {status.message}
              </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
              <button onClick={handleTest} disabled={testing || saving} style={{
                flex: 1, padding: '9px 12px', borderRadius: 'var(--r-md)', border: '1px solid var(--color-border)',
                background: 'var(--color-bg)', color: 'var(--text-primary)', cursor: 'pointer', fontFamily: 'inherit',
                fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              }}>
                {testing ? <Loader size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <GitBranch size={14} />}
                {testing ? 'Testing…' : 'Test Connection'}
              </button>
              <button onClick={handleSave} disabled={saving || testing} style={{
                flex: 1, padding: '9px 12px', borderRadius: 'var(--r-md)', border: 'none',
                background: 'var(--color-maroon)', color: '#fff', cursor: 'pointer', fontFamily: 'inherit',
                fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              }}>
                {saving ? <Loader size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <CheckCircle size={14} />}
                {saving ? 'Saving…' : 'Save Config'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

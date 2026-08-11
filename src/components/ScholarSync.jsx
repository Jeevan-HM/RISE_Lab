/**
 * ScholarSync.jsx
 *
 * A modal panel inside the Publications admin page that lets admins:
 *  1. Enter/save their SerpApi key
 *  2. See all team members who have a Scholar ID set
 *  3. Fetch their publications via the Firebase Cloud Function
 *  4. Preview new papers not yet in the site's publication list
 *  5. Select and import them into journalPubs / confPubs
 */

import { useState, useEffect, useMemo } from 'react';
import {
  X, GraduationCap, RefreshCw, Check, ExternalLink,
  AlertCircle, Info, Settings, ChevronDown, ChevronUp, Loader2,
} from 'lucide-react';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from '../firebase';
import { useEdit } from '../context/EditContext';

const _functions = getFunctions(app, 'us-central1');
const fetchScholarFn = httpsCallable(_functions, 'fetchScholarPublications');
const saveSerpApiConfigFn = httpsCallable(_functions, 'saveSerpApiConfig');
const getSerpApiConfigFn = httpsCallable(_functions, 'getSerpApiConfig');

/* ── helpers ─────────────────────────────────────────────── */

function dedupe(arr) {
  const seen = new Set();
  return arr.filter(p => {
    const key = (p.title || '').trim().toLowerCase();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function isAlreadyInList(pub, existing) {
  const norm = t => (t || '').trim().toLowerCase();
  return existing.some(e => norm(e.title) === norm(pub.title));
}

/* ── sub-components ──────────────────────────────────────── */

function Badge({ children, color = 'var(--color-maroon)' }) {
  return (
    <span style={{
      background: color, color: '#fff', borderRadius: '20px',
      padding: '2px 8px', fontSize: '0.68rem', fontWeight: 700,
    }}>
      {children}
    </span>
  );
}

function ApiKeySettings({ onClose }) {
  const [key, setKey] = useState('');
  const [masked, setMasked] = useState('');
  const [configured, setConfigured] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    getSerpApiConfigFn()
      .then(r => { setConfigured(r.data.configured); setMasked(r.data.masked); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    if (!key.trim()) return;
    setSaving(true);
    try {
      await saveSerpApiConfigFn({ key: key.trim() });
      setMasked(key.slice(0, 6) + '••••••••••••••••' + key.slice(-4));
      setConfigured(true);
      setKey('');
      setMsg('API key saved!');
    } catch (e) {
      setMsg('Error: ' + (e.message || 'Failed to save'));
    } finally {
      setSaving(false);
      setTimeout(() => setMsg(''), 3000);
    }
  };

  return (
    <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Settings size={15} style={{ color: 'var(--text-muted)' }} />
        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>SerpApi Key</span>
        {configured && <Badge color="#27ae60">Configured</Badge>}
      </div>

      {loading ? (
        <Loader2 size={16} className="spin" style={{ color: 'var(--text-muted)' }} />
      ) : (
        <>
          {configured && (
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
              Current key: <code style={{ background: 'var(--color-bg)', padding: '2px 6px', borderRadius: 4 }}>{masked}</code>
            </p>
          )}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="password"
              placeholder={configured ? 'Paste new key to replace…' : 'Paste SerpApi key…'}
              value={key}
              onChange={e => setKey(e.target.value)}
              style={{ flex: 1 }}
            />
            <button
              className="btn-add"
              onClick={save}
              disabled={saving || !key.trim()}
            >
              {saving ? <Loader2 size={13} className="spin" /> : <Check size={13} />}
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
            Get a free key at{' '}
            <a href="https://serpapi.com" target="_blank" rel="noreferrer" style={{ color: 'var(--color-maroon)' }}>
              serpapi.com
            </a>{' '}
            — free tier includes 250 searches/month.
          </p>
          {msg && <p style={{ fontSize: '0.8rem', color: msg.startsWith('Error') ? '#c0392b' : '#27ae60', margin: 0 }}>{msg}</p>}
        </>
      )}
    </div>
  );
}

function AuthorRow({ member, onFetch, loading, result }) {
  const [open, setOpen] = useState(false);
  const hasNew = result?.newPubs?.length > 0;
  const alreadyHave = result?.existingCount || 0;

  return (
    <div style={{
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--r-md)',
      overflow: 'hidden',
      background: 'var(--color-surface)',
    }}>
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem' }}>
        <GraduationCap size={16} style={{ color: 'var(--color-maroon)', flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{member.name}</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
            scholar.google.com/citations?user=<strong>{member.scholarId}</strong>
          </div>
        </div>

        {result && (
          <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0 }}>
            {hasNew
              ? <Badge color="var(--color-maroon)">{result.newPubs.length} new</Badge>
              : <Badge color="#27ae60">Up to date</Badge>
            }
            {alreadyHave > 0 && (
              <Badge color="var(--color-gold)">{alreadyHave} existing</Badge>
            )}
          </div>
        )}

        <button
          className="btn-add"
          onClick={() => onFetch(member)}
          disabled={loading}
          style={{ flexShrink: 0 }}
        >
          {loading ? <Loader2 size={13} className="spin" /> : <RefreshCw size={13} />}
          {loading ? 'Fetching…' : result ? 'Re-fetch' : 'Fetch'}
        </button>

        {result?.newPubs?.length > 0 && (
          <button
            onClick={() => setOpen(o => !o)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px', flexShrink: 0 }}
          >
            {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        )}
      </div>

      {/* Expandable new publications list */}
      {open && result?.newPubs?.length > 0 && (
        <div style={{ borderTop: '1px solid var(--color-border)', padding: '0.75rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {result.newPubs.map((pub, i) => (
            <label
              key={i}
              style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', cursor: 'pointer', padding: '0.5rem', borderRadius: 'var(--r-sm)', background: pub._selected ? 'var(--color-maroon-soft, rgba(140,29,64,0.07))' : 'transparent' }}
            >
              <input
                type="checkbox"
                checked={pub._selected ?? true}
                onChange={e => result.onToggle(i, e.target.checked)}
                style={{ marginTop: 3, flexShrink: 0 }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: 1.3 }}>
                  {pub.title}
                  <a href={pub.url} target="_blank" rel="noreferrer" style={{ marginLeft: 5, color: 'var(--text-muted)', verticalAlign: 'middle' }}>
                    <ExternalLink size={11} />
                  </a>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>{pub.authors}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-gold)', marginTop: 1, display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span>{pub.venue}</span>
                  {pub.year && <span>· {pub.year}</span>}
                  {pub.citations > 0 && <span>· {pub.citations} citations</span>}
                  <Badge color={pub._type === 'conf' ? '#2980b9' : '#27ae60'}>
                    {pub._type === 'conf' ? 'Conference' : 'Journal'}
                  </Badge>
                </div>
              </div>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Main ScholarSync component ──────────────────────────── */

export default function ScholarSync({ onClose }) {
  const { liveData, updateSection } = useEdit();
  const [showSettings, setShowSettings] = useState(false);
  const [loading, setLoading] = useState({});   // { authorId: true/false }
  const [results, setResults] = useState({});   // { authorId: { newPubs, existingCount, ... } }
  const [error, setError] = useState('');
  const [importing, setImporting] = useState(false);
  const [importDone, setImportDone] = useState('');

  // Collect all team members that have a scholarId
  const scholarsMembers = useMemo(() => {
    const all = [
      ...(liveData.director ? [{ ...liveData.director, _group: 'director' }] : []),
      ...(liveData.postdocStudents || []).map(m => ({ ...m, _group: 'postdoc' })),
      ...(liveData.docStudents || []).map(m => ({ ...m, _group: 'phd' })),
      ...(liveData.msStudents || []).map(m => ({ ...m, _group: 'ms' })),
      ...(liveData.bsStudents || []).map(m => ({ ...m, _group: 'bs' })),
    ];
    return all.filter(m => m.scholarId?.trim());
  }, [liveData]);

  const allExisting = useMemo(() => [
    ...(liveData.journalPubs || []),
    ...(liveData.confPubs || []),
  ], [liveData]);

  const fetchAuthor = async (member) => {
    setError('');
    setLoading(l => ({ ...l, [member.scholarId]: true }));
    try {
      const res = await fetchScholarFn({ authorId: member.scholarId });
      const pubs = res.data?.publications || [];

      const newPubs = dedupe(pubs)
        .filter(p => !isAlreadyInList(p, allExisting))
        .map(p => ({ ...p, _selected: true }));

      const existingCount = pubs.length - newPubs.length;

      setResults(r => ({
        ...r,
        [member.scholarId]: {
          newPubs,
          existingCount,
          fromCache: res.data?.fromCache,
          fetchedAt: res.data?.fetchedAt,
          // toggle handler for checkboxes
          onToggle: (i, checked) => setResults(prev => ({
            ...prev,
            [member.scholarId]: {
              ...prev[member.scholarId],
              newPubs: prev[member.scholarId].newPubs.map((p, idx) =>
                idx === i ? { ...p, _selected: checked } : p
              ),
            },
          })),
        },
      }));
    } catch (e) {
      const msg = e?.message || 'Unknown error';
      setError(`Failed to fetch for ${member.name}: ${msg}`);
    } finally {
      setLoading(l => ({ ...l, [member.scholarId]: false }));
    }
  };

  const fetchAll = async () => {
    for (const m of scholarsMembers) {
      await fetchAuthor(m);
    }
  };

  const importSelected = () => {
    setImporting(true);
    const toAdd = { journal: [], conf: [] };

    Object.values(results).forEach(r => {
      (r.newPubs || []).filter(p => p._selected).forEach(pub => {
        // Strip internal fields before saving
        const { _type, _scholarId, _articleId, _selected, ...clean } = pub;
        if (_type === 'conf') toAdd.conf.push(clean);
        else toAdd.journal.push(clean);
      });
    });

    const totalJ = toAdd.journal.length;
    const totalC = toAdd.conf.length;

    if (totalJ > 0) {
      updateSection('journalPubs', [
        ...toAdd.journal,
        ...(liveData.journalPubs || []),
      ]);
    }
    if (totalC > 0) {
      updateSection('confPubs', [
        ...toAdd.conf,
        ...(liveData.confPubs || []),
      ]);
    }

    setImporting(false);
    setImportDone(`Imported ${totalJ} journal + ${totalC} conference papers. Click Save in the toolbar to commit.`);

    // Clear selected state to avoid double-import
    setResults(prev => {
      const next = { ...prev };
      Object.keys(next).forEach(id => {
        next[id] = { ...next[id], newPubs: [] };
      });
      return next;
    });
  };

  const totalSelected = Object.values(results).reduce(
    (sum, r) => sum + (r.newPubs || []).filter(p => p._selected).length, 0
  );

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 2000,
      background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1rem',
    }}>
      <div style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--r-xl)',
        width: '100%', maxWidth: 720,
        maxHeight: '90vh', display: 'flex', flexDirection: 'column',
        boxShadow: '0 24px 80px rgba(0,0,0,0.4)',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.75rem',
          padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--color-border)',
          background: 'linear-gradient(135deg, var(--color-maroon), #6b1230)',
          color: '#fff', flexShrink: 0,
        }}>
          <GraduationCap size={20} />
          <div style={{ flex: 1 }}>
            <h2 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800 }}>Sync from Google Scholar</h2>
            <p style={{ margin: 0, fontSize: '0.78rem', opacity: 0.8 }}>
              Fetch publications from team members' Scholar profiles and import them automatically
            </p>
          </div>
          <button
            onClick={() => setShowSettings(s => !s)}
            title="SerpApi Settings"
            style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 'var(--r-sm)', padding: '6px 10px', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem' }}
          >
            <Settings size={14} /> API Key
          </button>
          <button
            onClick={onClose}
            style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* API Key Settings (collapsible) */}
        {showSettings && (
          <div style={{ borderBottom: '1px solid var(--color-border)', background: 'var(--color-bg)', flexShrink: 0 }}>
            <ApiKeySettings />
          </div>
        )}

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>

          {error && (
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', background: 'rgba(192,57,43,0.1)', border: '1px solid rgba(192,57,43,0.3)', borderRadius: 'var(--r-md)', padding: '0.75rem 1rem', color: '#c0392b', fontSize: '0.85rem' }}>
              <AlertCircle size={15} style={{ flexShrink: 0, marginTop: 1 }} />
              {error}
            </div>
          )}

          {importDone && (
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', background: 'rgba(39,174,96,0.1)', border: '1px solid rgba(39,174,96,0.3)', borderRadius: 'var(--r-md)', padding: '0.75rem 1rem', color: '#27ae60', fontSize: '0.85rem' }}>
              <Check size={15} style={{ flexShrink: 0, marginTop: 1 }} />
              {importDone}
            </div>
          )}

          {scholarsMembers.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', padding: '3rem 1rem', textAlign: 'center' }}>
              <Info size={40} style={{ color: 'var(--text-muted)', opacity: 0.4 }} />
              <div>
                <p style={{ fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>No Scholar IDs configured yet</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', maxWidth: 420, margin: '0 auto' }}>
                  Go to the <strong>Team</strong> page, edit each member, and paste their Google Scholar profile ID in the new <em>"Google Scholar ID"</em> field. The ID is the part after <code>?user=</code> in their Scholar profile URL.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {scholarsMembers.length} team member{scholarsMembers.length !== 1 ? 's' : ''} with Scholar profiles
                </span>
                <button
                  className="btn-add"
                  onClick={fetchAll}
                  disabled={Object.values(loading).some(Boolean)}
                  style={{ marginLeft: 'auto' }}
                >
                  <RefreshCw size={13} />
                  Fetch All
                </button>
              </div>

              {scholarsMembers.map(member => (
                <AuthorRow
                  key={member.scholarId}
                  member={member}
                  loading={!!loading[member.scholarId]}
                  result={results[member.scholarId]}
                  onFetch={fetchAuthor}
                />
              ))}
            </>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '1rem 1.5rem', borderTop: '1px solid var(--color-border)',
          display: 'flex', alignItems: 'center', gap: '0.75rem',
          background: 'var(--color-bg)', flexShrink: 0,
        }}>
          <p style={{ flex: 1, fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
            {totalSelected > 0
              ? `${totalSelected} publication${totalSelected !== 1 ? 's' : ''} selected for import`
              : 'Check the boxes above to select publications to import'}
          </p>
          <button
            onClick={onClose}
            style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--r-sm)', padding: '8px 16px', fontSize: '0.85rem', cursor: 'pointer', color: 'var(--text-secondary)' }}
          >
            Cancel
          </button>
          <button
            className={`edit-toolbar-save${totalSelected > 0 ? ' dirty' : ''}`}
            onClick={importSelected}
            disabled={totalSelected === 0 || importing}
            style={{ opacity: totalSelected === 0 ? 0.5 : 1 }}
          >
            {importing ? <Loader2 size={14} className="spin" /> : <Check size={14} />}
            Import {totalSelected > 0 ? totalSelected : ''} Selected
          </button>
        </div>
      </div>
    </div>
  );
}

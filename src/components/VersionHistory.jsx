import { useState, useEffect } from 'react';
import { History, ExternalLink, RotateCcw, Loader, X, AlertCircle, GitBranch } from 'lucide-react';
import { fetchCommitHistory, fetchDataAtCommit } from '../lib/githubSync';
import { useEdit } from '../context/EditContext';

function timeAgo(date) {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}

export default function VersionHistory({ onClose }) {
  const { setLiveData } = useEdit();
  const [commits, setCommits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [restoring, setRestoring] = useState(null); // sha being restored
  const [preview, setPreview] = useState(null); // { sha, data }

  useEffect(() => {
    fetchCommitHistory(40)
      .then(data => {
        setCommits(data);
        setLoading(false);
        if (!data.length) setError('No commits found. Make sure GitHub is configured and you have made at least one save.');
      })
      .catch(e => {
        setError(e.message);
        setLoading(false);
      });
  }, []);

  const handlePreview = async (sha) => {
    setRestoring(sha);
    const data = await fetchDataAtCommit(sha);
    setRestoring(null);
    if (!data) {
      setError('Could not load data for this commit.');
      return;
    }
    setPreview({ sha, data });
  };

  const handleRestore = () => {
    if (!preview) return;
    setLiveData(preview.data);
    setPreview(null);
    onClose();
    // Show a note — user still needs to click Save to persist
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 2000,
      background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }} onClick={onClose}>
      <div style={{
        background: 'var(--color-surface)', borderRadius: 'var(--r-xl)',
        border: '1px solid var(--color-border)', boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
        width: '100%', maxWidth: 520, maxHeight: '85vh',
        display: 'flex', flexDirection: 'column',
      }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <History size={20} color="var(--color-gold)" />
            <div>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Version History</h3>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>{commits.length} saved versions</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }}>
            <X size={18} />
          </button>
        </div>

        {/* Restore preview banner */}
        {preview && (
          <div style={{ background: 'rgba(200,146,42,0.15)', borderBottom: '1px solid rgba(200,146,42,0.3)', padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--color-gold-dark)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={15} />
              Preview loaded. Click <strong>Restore & Close</strong>, then <strong>Save Changes</strong> to apply.
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
              <button onClick={() => setPreview(null)} style={{ background: 'none', border: '1px solid var(--color-border)', borderRadius: 'var(--r-sm)', padding: '5px 10px', fontSize: '0.8rem', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                Cancel
              </button>
              <button onClick={handleRestore} style={{ background: 'var(--color-maroon)', border: 'none', borderRadius: 'var(--r-sm)', padding: '5px 12px', fontSize: '0.8rem', cursor: 'pointer', color: '#fff', fontWeight: 700 }}>
                Restore & Close
              </button>
            </div>
          </div>
        )}

        {/* Commit list */}
        <div style={{ overflowY: 'auto', flex: 1, padding: '0.5rem 0' }}>
          {loading && (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              <Loader size={22} style={{ animation: 'spin 1s linear infinite', marginBottom: '0.5rem' }} />
              <p style={{ margin: 0, fontSize: '0.85rem' }}>Loading version history…</p>
            </div>
          )}

          {!loading && error && (
            <div style={{ padding: '2rem 1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <GitBranch size={32} style={{ marginBottom: '0.75rem', opacity: 0.4 }} />
              <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>{error}</p>
              <p style={{ fontSize: '0.8rem' }}>Configure GitHub via the <strong>⚙ GitHub</strong> button in the toolbar.</p>
            </div>
          )}

          {!loading && !error && commits.map((commit, i) => {
            const isRestoring = restoring === commit.sha;
            const isPreviewed = preview?.sha === commit.sha;

            return (
              <div key={commit.sha} style={{
                borderBottom: '1px solid var(--color-border)',
                background: isPreviewed ? 'rgba(200,146,42,0.06)' : 'transparent',
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.9rem 1.5rem' }}>
                  {/* Timeline dot */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 4 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: i === 0 ? 'var(--color-maroon)' : 'var(--color-border)', border: '2px solid var(--color-surface)', flexShrink: 0 }} />
                    {i < commits.length - 1 && <div style={{ width: 2, height: 30, background: 'var(--color-border)', marginTop: 3 }} />}
                  </div>

                  {/* Commit info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.3 }}>
                        {commit.message.split(' — ')[0]}
                      </span>
                      {i === 0 && <span style={{ fontSize: '0.65rem', background: 'var(--color-maroon)', color: '#fff', borderRadius: '10px', padding: '1px 6px', fontWeight: 700 }}>LATEST</span>}
                      {isPreviewed && <span style={{ fontSize: '0.65rem', background: 'rgba(200,146,42,0.2)', color: 'var(--color-gold-dark)', borderRadius: '10px', padding: '1px 6px', fontWeight: 700 }}>PREVIEWING</span>}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {timeAgo(commit.date)} · {commit.date.toLocaleString()} · {commit.author}
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0, alignItems: 'center' }}>
                    <a href={commit.url} target="_blank" rel="noreferrer" title="View on GitHub" style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
                      <ExternalLink size={14} />
                    </a>
                    {i !== 0 && (
                      <button
                        onClick={() => handlePreview(commit.sha)}
                        disabled={isRestoring}
                        title="Load this version"
                        style={{ background: isPreviewed ? 'var(--color-gold)' : 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--r-sm)', padding: '5px 10px', fontSize: '0.78rem', cursor: 'pointer', color: isPreviewed ? '#fff' : 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}
                      >
                        {isRestoring ? <Loader size={12} style={{ animation: 'spin 1s linear infinite' }} /> : <RotateCcw size={12} />}
                        {isRestoring ? 'Loading…' : 'Restore'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{ padding: '0.75rem 1.5rem', borderTop: '1px solid var(--color-border)', fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <GitBranch size={13} />
          Versions are stored in your GitHub repository. Restoring loads the old data into the editor — click Save Changes to apply it.
        </div>
      </div>
    </div>
  );
}

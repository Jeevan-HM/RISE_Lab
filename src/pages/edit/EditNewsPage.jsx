import { useState, useMemo } from 'react';
import { Search, ChevronDown, Plus, Trash2, Calendar } from 'lucide-react';
import Editable from '../../components/Editable';
import { useEdit } from '../../context/EditContext';
import { Field } from '../../components/DrawerFields';

// ── Drawer: edit page header ────────────────────────────────
function HeroDrawer() {
  const { liveData, updateField } = useEdit();
  const m = liveData.meta || {};
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <Field label="Page Eyebrow" value={m.newsEyebrow || 'Stay Informed'} onChange={v => updateField('meta.newsEyebrow', v)} />
      <Field label="Page Title" value={m.newsTitle || 'News & Updates'} onChange={v => updateField('meta.newsTitle', v)} />
      <Field label="Page Sub-description" value={m.newsDescription || 'The latest announcements, achievements, and milestones from the RISE Lab.'} onChange={v => updateField('meta.newsDescription', v)} rows={3} />
    </div>
  );
}

// ── Drawer: add / edit / delete news items ──────────────────
function NewsDrawer() {
  const { liveData, updateSection } = useEdit();
  const items = liveData.news || [];

  const add = () => updateSection('news', [{ date: '', headline: '' }, ...items]);
  const update = (i, field, val) => updateSection('news', items.map((it, idx) => idx === i ? { ...it, [field]: val } : it));
  const remove = i => updateSection('news', items.filter((_, idx) => idx !== i));
  const moveUp = i => {
    if (i === 0) return;
    const next = [...items];
    [next[i - 1], next[i]] = [next[i], next[i - 1]];
    updateSection('news', next);
  };
  const moveDown = i => {
    if (i === items.length - 1) return;
    const next = [...items];
    [next[i], next[i + 1]] = [next[i + 1], next[i]];
    updateSection('news', next);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <button className="btn-add" onClick={add} style={{ marginBottom: '0.5rem' }}>
        <Plus size={13} /> Add News Item
      </button>
      {items.map((item, i) => (
        <div key={i} style={{ background: 'var(--color-bg)', borderRadius: 'var(--r-md)', padding: '0.75rem', border: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>Item {i + 1}</span>
            <div style={{ display: 'flex', gap: '4px' }}>
              <button onClick={() => moveUp(i)} disabled={i === 0} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '4px', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: i === 0 ? 'not-allowed' : 'pointer', opacity: i === 0 ? 0.4 : 1, color: 'var(--text-secondary)', fontSize: '10px' }}>▲</button>
              <button onClick={() => moveDown(i)} disabled={i === items.length - 1} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '4px', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: i === items.length - 1 ? 'not-allowed' : 'pointer', opacity: i === items.length - 1 ? 0.4 : 1, color: 'var(--text-secondary)', fontSize: '10px' }}>▼</button>
              <button onClick={() => remove(i)} style={{ background: 'transparent', border: '1px solid #c0392b', borderRadius: '4px', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#c0392b' }}><Trash2 size={12} /></button>
            </div>
          </div>
          <Field label="Date (e.g. February 2026)" value={item.date} onChange={v => update(i, 'date', v)} />
          <div style={{ marginTop: '0.5rem' }}>
            <Field label="Headline" value={item.headline} onChange={v => update(i, 'headline', v)} rows={2} />
          </div>
        </div>
      ))}
      {items.length === 0 && (
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1rem 0' }}>No news items yet. Click "Add News Item" to get started.</p>
      )}
    </div>
  );
}

// ── Page ────────────────────────────────────────────────────
export default function EditNewsPage() {
  const { liveData } = useEdit();
  const data = liveData;
  const [query, setQuery] = useState('');
  const [showCount, setShowCount] = useState(20);

  const allNews = data?.news || [];
  const m = data?.meta || {};

  const filtered = useMemo(() => {
    if (!query.trim()) return allNews;
    const q = query.toLowerCase();
    return allNews.filter(n =>
      n.headline?.toLowerCase().includes(q) ||
      n.date?.toLowerCase().includes(q)
    );
  }, [allNews, query]);

  const visible = filtered.slice(0, showCount);
  const hasMore = filtered.length > showCount;

  return (
    <div className="page-wrapper">
      {/* Editable page hero */}
      <Editable label="Page Header" content={<HeroDrawer />} position="top-right">
        <div className="page-hero">
          <div className="container">
            <span className="section-eyebrow">{m.newsEyebrow || 'Stay Informed'}</span>
            <h1>{m.newsTitle || 'News & Updates'}</h1>
            <p>{m.newsDescription || 'The latest announcements, achievements, and milestones from the RISE Lab.'}</p>
          </div>
        </div>
      </Editable>

      <section className="section">
        <div className="container" style={{ maxWidth: '860px' }}>

          {/* Search bar (display only — no edit needed) */}
          <div className="search-wrapper" style={{ marginBottom: '2.5rem' }}>
            <Search size={16} />
            <input
              placeholder="Search news…"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>

          {/* Stats + editable news list */}
          <Editable label="News Items" content={<NewsDrawer />} position="top-right">
            <div>
              {!query.trim() && (
                <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span className="badge" style={{ background: 'var(--color-maroon)', color: '#fff', padding: '4px 14px', borderRadius: 'var(--r-full)', fontSize: '0.78rem', fontWeight: 700 }}>
                    {allNews.length} item{allNews.length !== 1 ? 's' : ''}
                  </span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>All news &amp; announcements</span>
                </div>
              )}

              {filtered.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '4rem 0' }}>No news items match your search.</p>
              ) : (
                <>
                  {/* Timeline */}
                  <div style={{ position: 'relative', paddingLeft: '2rem' }}>
                    {/* Vertical line */}
                    <div style={{
                      position: 'absolute', left: '7px', top: 0, bottom: 0,
                      width: '2px', background: 'linear-gradient(to bottom, var(--color-maroon), var(--color-gold))',
                      borderRadius: '2px', opacity: 0.3,
                    }} />

                    {visible.map((item, i) => (
                      <div
                        key={i}
                        className="animate-fade-up"
                        style={{ position: 'relative', marginBottom: '1.75rem', animationDelay: `${i * 0.04}s` }}
                      >
                        {/* Dot */}
                        <div style={{
                          position: 'absolute', left: '-2rem', top: '0.35rem',
                          width: '16px', height: '16px',
                          background: i === 0 ? 'var(--color-maroon)' : 'var(--color-surface-2)',
                          border: `2px solid ${i === 0 ? 'var(--color-maroon)' : 'var(--color-border-hover)'}`,
                          borderRadius: '50%', zIndex: 1,
                        }} />

                        {/* Card */}
                        <div className="glass-lift" style={{
                          background: 'var(--color-surface)', border: '1px solid var(--color-border)',
                          borderRadius: 'var(--r-lg)', padding: '1.25rem 1.5rem',
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <Calendar size={13} style={{ color: 'var(--color-gold)', flexShrink: 0 }} />
                            <span style={{ fontSize: '0.76rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-gold)' }}>
                              {item.date}
                            </span>
                            {i === 0 && (
                              <span style={{ marginLeft: '0.25rem', background: 'var(--color-maroon)', color: '#fff', fontSize: '0.65rem', fontWeight: 800, padding: '2px 8px', borderRadius: 'var(--r-full)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                                Latest
                              </span>
                            )}
                          </div>
                          <p style={{ margin: 0, lineHeight: 1.65, fontSize: '0.97rem', color: 'var(--text-primary)' }}
                            dangerouslySetInnerHTML={{ __html: item.headline }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  {hasMore && (
                    <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                      <button className="btn btn-ghost" onClick={() => setShowCount(c => c + 20)}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                        <ChevronDown size={16} /> Load more ({filtered.length - showCount} remaining)
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </Editable>
        </div>
      </section>
    </div>
  );
}

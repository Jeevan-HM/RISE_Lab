import { useState, useMemo } from 'react';
import { Search, Calendar, ChevronDown } from 'lucide-react';

export default function NewsPage({ data }) {
  const [query, setQuery] = useState('');
  const [showCount, setShowCount] = useState(20);

  const allNews = data?.news || [];

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
      {/* Page Hero */}
      <div className="page-hero">
        <div className="container">
          <span className="section-eyebrow">Stay Informed</span>
          <h1>News &amp; Updates</h1>
          <p>The latest announcements, achievements, and milestones from the RISE Lab.</p>
        </div>
      </div>

      <section className="section">
        <div className="container" style={{ maxWidth: '860px' }}>

          {/* Search bar */}
          <div className="search-wrapper" style={{ marginBottom: '2.5rem' }}>
            <Search size={16} />
            <input
              placeholder="Search news…"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>

          {/* Stats badge */}
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
                    style={{
                      position: 'relative',
                      marginBottom: '1.75rem',
                      animationDelay: `${i * 0.04}s`,
                    }}
                  >
                    {/* Dot */}
                    <div style={{
                      position: 'absolute', left: '-2rem', top: '0.35rem',
                      width: '16px', height: '16px',
                      background: i === 0 ? 'var(--color-maroon)' : 'var(--color-surface-2)',
                      border: `2px solid ${i === 0 ? 'var(--color-maroon)' : 'var(--color-border-hover)'}`,
                      borderRadius: '50%',
                      zIndex: 1,
                      transition: 'all 0.2s ease',
                    }} />

                    {/* Card */}
                    <div
                      className="glass-lift"
                      style={{
                        background: 'var(--color-surface)',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--r-lg)',
                        padding: '1.25rem 1.5rem',
                        transition: 'all 0.2s ease',
                        cursor: 'default',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <Calendar size={13} style={{ color: 'var(--color-gold)', flexShrink: 0 }} />
                        <span style={{
                          fontSize: '0.76rem', fontWeight: 700, letterSpacing: '0.06em',
                          textTransform: 'uppercase', color: 'var(--color-gold)',
                        }}>
                          {item.date}
                        </span>
                        {i === 0 && (
                          <span style={{
                            marginLeft: '0.25rem',
                            background: 'var(--color-maroon)', color: '#fff',
                            fontSize: '0.65rem', fontWeight: 800,
                            padding: '2px 8px', borderRadius: 'var(--r-full)',
                            letterSpacing: '0.05em', textTransform: 'uppercase',
                          }}>
                            Latest
                          </span>
                        )}
                      </div>
                      <p
                        style={{ margin: 0, lineHeight: 1.65, fontSize: '0.97rem', color: 'var(--text-primary)' }}
                        dangerouslySetInnerHTML={{ __html: item.headline }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Load more */}
              {hasMore && (
                <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                  <button
                    className="btn btn-ghost"
                    onClick={() => setShowCount(c => c + 20)}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                  >
                    <ChevronDown size={16} /> Load more ({filtered.length - showCount} remaining)
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}

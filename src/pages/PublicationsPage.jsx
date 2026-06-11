import React, { useState, useMemo } from 'react';
import { ExternalLink, Search } from 'lucide-react';

export default function PublicationsPage({ data }) {
  const [tab, setTab] = useState('journal');
  const [query, setQuery] = useState('');

  const allPubs = useMemo(() => {
    const list = tab === 'journal' ? (data?.journalPubs || []) : (data?.confPubs || []);
    if (!query.trim()) return list;
    const q = query.toLowerCase();
    return list.filter(p =>
      p.title?.toLowerCase().includes(q) ||
      p.authors?.toLowerCase().includes(q) ||
      p.venue?.toLowerCase().includes(q) ||
      String(p.year)?.includes(q)
    );
  }, [tab, query, data]);

  const grouped = useMemo(() => {
    const map = {};
    allPubs.forEach(p => {
      const y = p.year || 'N/A';
      if (!map[y]) map[y] = [];
      map[y].push(p);
    });
    return Object.entries(map).sort(([a], [b]) => Number(b) - Number(a));
  }, [allPubs]);

  const totalJ = data?.journalPubs?.length || 0;
  const totalC = data?.confPubs?.length || 0;

  return (
    <div className="page-wrapper">
      <div className="page-hero">
        <div className="container">
          <span className="section-eyebrow">Our Research Output</span>
          <h1>Publications</h1>
          <p>{totalJ} journal papers · {totalC} conference papers</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          {/* Tabs + Search */}
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap' }}>
            <div className="tabs" style={{ margin: 0 }}>
              <button className={`tab-btn${tab === 'journal' ? ' active' : ''}`} onClick={() => { setTab('journal'); setQuery(''); }}>
                Journal Papers ({totalJ})
              </button>
              <button className={`tab-btn${tab === 'conf' ? ' active' : ''}`} onClick={() => { setTab('conf'); setQuery(''); }}>
                Conference Papers ({totalC})
              </button>
            </div>
            <div style={{ flex: 1, maxWidth: 340, position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                style={{ paddingLeft: 40, width: '100%', padding: '10px 16px 10px 40px', borderRadius: 'var(--r-full)', background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--text-primary)', fontFamily: 'inherit', fontSize: '0.9rem' }}
                placeholder="Search publications…"
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
            </div>
          </div>

          {allPubs.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '3rem 0' }}>No publications found.</p>
          ) : (
            <div>
              {grouped.map(([year, pubs]) => (
                <div key={year} style={{ marginBottom: '2rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-gold)' }}>{year}</h3>
                    <div style={{ flex: 1, height: 1, background: 'var(--color-border)' }} />
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{pubs.length} paper{pubs.length !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="pub-list">
                    {pubs.map((pub, i) => (
                      <a key={i} className="pub-item" href={pub.url} target="_blank" rel="noreferrer"
                        style={{ textDecoration: 'none' }}>
                        <div className="pub-year">{pub.year}</div>
                        <div className="pub-content">
                          <div className="pub-title">{pub.title}</div>
                          <div className="pub-authors">{pub.authors}</div>
                          <div className="pub-venue">{pub.venue}</div>
                        </div>
                        <ExternalLink size={16} className="pub-link-icon" />
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

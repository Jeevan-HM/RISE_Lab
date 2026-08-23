import { useState, useMemo, useRef } from 'react';
import { ExternalLink, Search, Plus, Trash2, RefreshCw, Check } from 'lucide-react';
import Editable from '../../components/Editable';
import { useEdit } from '../../context/EditContext';
import { Field } from '../../components/DrawerFields';

// ── Semantic Scholar sync ─────────────────────────────────
const S2_AUTHOR_ID = '49039243'; // Dr. Wenlong Zhang (ASU)
const S2_API = 'https://api.semanticscholar.org/graph/v1';

function classifyPaper(paper) {
  const confKeywords = [
    'conference', 'conf', 'icra', 'iros', 'acc', 'aim', 'humanoids',
    'robosoft', 'biorob', 'wearracon', 'chase', 'cvpr', 'workshop',
    'forum', 'symposium', 'proceedings', 'dscc', 'asme detc', 'dmd',
  ];
  const venue = (paper.venue || '').toLowerCase();
  const types = paper.publicationTypes || [];

  if (venue.includes('patent') || types.includes('Patent')) return 'patent';

  const isConf = types.includes('Conference') ||
    confKeywords.some(k => venue.includes(k)) ||
    (venue.includes('international') && !venue.includes('journal') && !venue.includes('transactions'));
  return isConf ? 'conf' : 'journal';
}

function formatAuthors(authors) {
  return authors.map(a => {
    const parts = (a.name || '').trim().split(/\s+/);
    if (parts.length === 1) return parts[0];
    const last = parts[parts.length - 1];
    const initials = parts.slice(0, -1).map(p => p[0] + '.').join(' ');
    return `${initials} ${last}`;
  }).join(', ');
}

async function fetchS2Papers() {
  const res = await fetch(
    `${S2_API}/author/${S2_AUTHOR_ID}/papers?fields=title,year,venue,authors,externalIds,publicationTypes&limit=200`
  );
  if (!res.ok) throw new Error(`Semantic Scholar error: ${res.status}`);
  const json = await res.json();
  return json.data || [];
}

function paperToEntry(paper) {
  let url = '';
  if (paper.externalIds?.DOI) url = `https://doi.org/${paper.externalIds.DOI}`;
  else if (paper.externalIds?.ArXiv) url = `https://arxiv.org/abs/${paper.externalIds.ArXiv}`;
  return {
    title: paper.title || '',
    authors: formatAuthors(paper.authors || []),
    venue: paper.venue || '',
    year: paper.year || new Date().getFullYear(),
    url,
  };
}

function HeroDrawer() {
  const { liveData, updateField } = useEdit();
  const m = liveData.meta || {};
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <Field label="Page Eyebrow (small label above title)" value={m.pubsEyebrow || 'Our Research Output'} onChange={v => updateField('meta.pubsEyebrow', v)} />
      <Field label="Page Title" value={m.pubsTitle || 'Publications'} onChange={v => updateField('meta.pubsTitle', v)} />
      <Field label="Page Sub-description" value={m.pubsDescription || ''} onChange={v => updateField('meta.pubsDescription', v)} rows={3} />
    </div>
  );
}

function PubDrawer({ tab }) {
  const { liveData, updateSection } = useEdit();
  const field = tab === 'journal' ? 'journalPubs' : tab === 'patent' ? 'patentPubs' : 'confPubs';
  const items = liveData[field] || [];
  const update = (i, f, v) => updateSection(field, items.map((it, idx) => idx === i ? { ...it, [f]: v } : it));
  const remove = i => updateSection(field, items.filter((_, idx) => idx !== i));
  const add = () => updateSection(field, [{ title: '', authors: '', venue: '', year: new Date().getFullYear(), url: '' }, ...items]);

  const [syncState, setSyncState] = useState('idle');
  const [newJournal, setNewJournal] = useState([]);
  const [newConf, setNewConf] = useState([]);
  const [newPatent, setNewPatent] = useState([]);
  const [syncMsg, setSyncMsg] = useState('');

  const handleSync = async () => {
    setSyncState('loading');
    setSyncMsg('Fetching papers from Semantic Scholar…');
    setNewJournal([]);
    setNewConf([]);
    setNewPatent([]);
    try {
      const papers = await fetchS2Papers();
      const existingTitles = new Set([
        ...(liveData.journalPubs || []),
        ...(liveData.confPubs || []),
        ...(liveData.patentPubs || []),
      ].map(p => p.title?.toLowerCase().trim()));

      const addedJ = [];
      const addedC = [];
      const addedP = [];

      for (const paper of papers) {
        const titleKey = paper.title?.toLowerCase().trim();
        if (!titleKey || existingTitles.has(titleKey)) continue;
        if (/^(correction|erratum|author correction)/i.test(paper.title)) continue;
        const entry = paperToEntry(paper);
        const type = classifyPaper(paper);
        if (type === 'conf') addedC.push(entry);
        else if (type === 'patent') addedP.push(entry);
        else addedJ.push(entry);
      }

      setNewJournal(addedJ);
      setNewConf(addedC);
      setNewPatent(addedP);
      const total = addedJ.length + addedC.length + addedP.length;
      setSyncMsg(total === 0
        ? '✅ Already up to date.'
        : `Found ${total} new items (${addedJ.length} journal, ${addedC.length} conf, ${addedP.length} patent).`);
      setSyncState('done');
    } catch (e) {
      setSyncMsg(`❌ ${e.message}`);
      setSyncState('error');
    }
  };

  const handleAddNew = () => {
    const updatedJ = [...newJournal, ...(liveData.journalPubs || [])].sort((a, b) => (Number(b.year) || 0) - (Number(a.year) || 0));
    const updatedC = [...newConf, ...(liveData.confPubs || [])].sort((a, b) => (Number(b.year) || 0) - (Number(a.year) || 0));
    const updatedP = [...newPatent, ...(liveData.patentPubs || [])].sort((a, b) => (Number(b.year) || 0) - (Number(a.year) || 0));
    
    updateSection('journalPubs', updatedJ);
    setTimeout(() => updateSection('confPubs', updatedC), 50);
    setTimeout(() => updateSection('patentPubs', updatedP), 100);
    setNewJournal([]);
    setNewConf([]);
    setNewPatent([]);
    setSyncMsg(`✅ Added!`);
    setSyncState('idle');
  };

  const totalNew = newJournal.length + newConf.length + newPatent.length;

  return (
    <div>
      <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--r-md)', padding: '1rem', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <RefreshCw size={14} style={{ color: 'var(--color-gold)' }} /> Sync from Semantic Scholar
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Auto-fetches new papers.</div>
          </div>
          <button className="btn btn-secondary" onClick={handleSync} disabled={syncState === 'loading'} style={{ fontSize: '0.75rem', padding: '6px 12px' }}>
            <RefreshCw size={12} style={syncState === 'loading' ? { animation: 'spin 1s linear infinite' } : {}} />
            {syncState === 'loading' ? 'Fetching…' : 'Check'}
          </button>
        </div>
        {syncMsg && <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: syncState === 'error' ? '#f87171' : 'var(--text-secondary)' }}>{syncMsg}</div>}
        {totalNew > 0 && (
          <div style={{ marginTop: '0.75rem' }}>
            <div style={{ maxHeight: '100px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '0.5rem' }}>
              {[...newJournal.map(p => ({ ...p, _type: 'J' })), ...newConf.map(p => ({ ...p, _type: 'C' })), ...newPatent.map(p => ({ ...p, _type: 'P' }))].map((p, i) => (
                <div key={i} style={{ fontSize: '0.75rem', background: 'var(--color-bg)', padding: '4px 6px', borderRadius: '4px', border: '1px solid var(--color-border)' }}>
                  <span style={{ color: 'var(--color-gold)', marginRight: '4px' }}>[{p._type}]</span>{p.title}
                </div>
              ))}
            </div>
            <button className="btn btn-primary" onClick={handleAddNew} style={{ fontSize: '0.8rem', padding: '6px 12px', width: '100%' }}>
              <Check size={12} /> Add {totalNew} papers
            </button>
          </div>
        )}
      </div>

      <button className="btn-add" onClick={add} style={{ marginBottom: '1rem' }}>
        <Plus size={13} /> Add Publication
      </button>
      {items.map((pub, i) => (
        <div key={i} style={{ background: 'var(--color-bg)', borderRadius: 'var(--r-md)', padding: '0.75rem', marginBottom: '0.75rem', border: '1px solid var(--color-border)' }}>
          <Field label="Title" value={pub.title} onChange={v => update(i, 'title', v)} />
          <div style={{ marginTop: '0.5rem' }}>
            <Field label="Authors" value={pub.authors} onChange={v => update(i, 'authors', v)} />
          </div>
          <div style={{ marginTop: '0.5rem', display: 'grid', gridTemplateColumns: '1fr 80px', gap: '0.5rem' }}>
            <Field label="Venue / Journal" value={pub.venue} onChange={v => update(i, 'venue', v)} />
            <Field label="Year" value={String(pub.year)} onChange={v => update(i, 'year', Number(v))} type="number" />
          </div>
          <div style={{ marginTop: '0.5rem' }}>
            <Field label="DOI / URL" value={pub.url} onChange={v => update(i, 'url', v)} />
          </div>
          <button className="btn-delete" onClick={() => remove(i)} style={{ marginTop: '0.5rem' }}>
            <Trash2 size={12} /> Remove
          </button>
        </div>
      ))}
    </div>
  );
}

export default function EditPublicationsPage() {
  const { liveData } = useEdit();
  const data = liveData;
  const [tab, setTab] = useState('journal');
  const [query, setQuery] = useState('');

  const allPubs = useMemo(() => {
    const list = tab === 'journal' ? (data?.journalPubs || []) : tab === 'patent' ? (data?.patentPubs || []) : (data?.confPubs || []);
    // Sort by year descending (newest first)
    const sorted = [...list].sort((a, b) => (Number(b.year) || 0) - (Number(a.year) || 0));
    if (!query.trim()) return sorted;
    const q = query.toLowerCase();
    return sorted.filter(p =>
      p.title?.toLowerCase().includes(q) ||
      p.authors?.toLowerCase().includes(q) ||
      p.venue?.toLowerCase().includes(q) ||
      String(p.year)?.includes(q)
    );
  }, [tab, query, data]);

  const grouped = useMemo(() => {
    const map = {};
    allPubs.forEach(p => { const y = p.year || 'N/A'; if (!map[y]) map[y] = []; map[y].push(p); });
    return Object.entries(map).sort(([a], [b]) => Number(b) - Number(a));
  }, [allPubs]);

  const totalJ = data?.journalPubs?.length || 0;
  const totalC = data?.confPubs?.length || 0;
  const totalP = data?.patentPubs?.length || 0;
  const m = data?.meta || {};

  return (
    <div className="page-wrapper">
      {/* Editable page hero */}
      <Editable label="Page Header" content={<HeroDrawer />} position="top-right">
        <div className="page-hero">
          <div className="container">
            <span className="section-eyebrow">{m.pubsEyebrow || 'Our Research Output'}</span>
            <h1>{m.pubsTitle || 'Publications'}</h1>
            <p>{m.pubsDescription || `${totalJ} journal papers · ${totalC} conference papers · ${totalP} patents`}</p>
          </div>
        </div>
      </Editable>

      <section className="section">
        <div className="container">
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap' }}>
            {/* Tab bar — Editable wrapper no longer blocks tab clicks */}
            <Editable label={`${tab === 'journal' ? 'Journal' : tab === 'patent' ? 'Patent' : 'Conference'} Papers`} content={<PubDrawer tab={tab} />}>
              <div className="tabs" style={{ margin: 0, width: 'fit-content' }}>
                <button className={`tab-btn${tab === 'journal' ? ' active' : ''}`} onClick={() => { setTab('journal'); setQuery(''); }}>
                  Journal Papers ({totalJ})
                </button>
                <button className={`tab-btn${tab === 'conf' ? ' active' : ''}`} onClick={() => { setTab('conf'); setQuery(''); }}>
                  Conference Papers ({totalC})
                </button>
                <button className={`tab-btn${tab === 'patent' ? ' active' : ''}`} onClick={() => { setTab('patent'); setQuery(''); }}>
                  Patents ({totalP})
                </button>
              </div>
            </Editable>
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
                      <a key={i} className="pub-item" href={pub.url} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
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

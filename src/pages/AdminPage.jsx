import { useState, useEffect } from 'react';
import {
  Newspaper, Users, GraduationCap, BookOpen, Microscope,
  FlaskConical, Phone, Image, LogOut, Save, Plus, Trash2,
  ChevronDown, ChevronUp, Check, Shield, GripVertical
} from 'lucide-react';

import { auth, db } from '../firebase';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { ImageField, LinksField } from '../components/DrawerFields';

// ── Helpers ────────────────────────────────────────────────
function moveItem(arr, fromIdx, toIdx) {
  if (toIdx < 0 || toIdx >= arr.length) return arr;
  const next = [...arr];
  const [item] = next.splice(fromIdx, 1);
  next.splice(toIdx, 0, item);
  return next;
}

// ── Draggable Card Wrapper ─────────────────────────────────
function DraggableCard({ index, onMove, children, style, className = "admin-card" }) {
  const [isDraggable, setIsDraggable] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragStart = (e) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index);
    setTimeout(() => { if (e.target) e.target.classList.add('dragging'); }, 0);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    setIsDraggable(false);
    const fromIdx = parseInt(e.dataTransfer.getData('text/plain'), 10);
    if (!isNaN(fromIdx) && fromIdx !== index) {
      onMove(fromIdx, index);
    }
  };

  return (
    <div
      className={`${className} ${isDragOver ? 'drag-over' : ''}`}
      draggable={isDraggable}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
      onDragEnd={(e) => { if (e.target) e.target.classList.remove('dragging'); setIsDragOver(false); setIsDraggable(false); }}
      onMouseDown={e => { if (e.target.closest('.drag-handle')) setIsDraggable(true); }}
      onMouseUp={() => setIsDraggable(false)}
      style={style}
    >
      {children}
    </div>
  );
}

// ── Reusable reorder buttons ───────────────────────────────
function ReorderBtns({ idx, total, onMove }) {
  return (
    <div className="reorder-btns">
      <div className="drag-handle" style={{ cursor: 'grab', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px 0', color: 'var(--text-muted)' }} title="Drag to reorder">
        <GripVertical size={16} />
      </div>
      <button className="reorder-btn" onClick={() => onMove(idx, idx - 1)} disabled={idx === 0} title="Move up">▲</button>
      <button className="reorder-btn" onClick={() => onMove(idx, idx + 1)} disabled={idx === total - 1} title="Move down">▼</button>
    </div>
  );
}

// ── Reusable field ─────────────────────────────────────────
function Field({ label, value, onChange, type = 'text', rows }) {
  return (
    <div className="admin-field">
      <label>{label}</label>
      {rows ? (
        <textarea rows={rows} value={value || ''} onChange={e => onChange(e.target.value)} />
      ) : (
        <input type={type} value={value || ''} onChange={e => onChange(e.target.value)} />
      )}
    </div>
  );
}

// ── Toast ──────────────────────────────────────────────────
function Toast({ msg, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 2500); return () => clearTimeout(t); }, []);
  return <div className="save-toast"><Check size={16} /> {msg}</div>;
}

// ── Login ──────────────────────────────────────────────────
function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async e => {
    e.preventDefault();
    if (!email || !password) { setErr('Both fields required.'); return; }
    
    setLoading(true);
    setErr('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch {
      setErr('Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login">
      <div className="admin-login-card animate-fade-up">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.5rem' }}>
          <Shield size={26} style={{ color: 'var(--color-maroon)' }} />
          <span style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.15rem', color: 'var(--color-maroon)' }}>Firebase CMS Login</span>
        </div>
        <p style={{ fontSize: '0.9rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>Log in using your Firebase Authentication Email and Password.</p>
        <form onSubmit={submit} className="admin-form">
          <Field label="Email Address" value={email} onChange={setEmail} />
          <Field label="Password" value={password} onChange={setPassword} type="password" />
          {err && <p className="login-error">{err}</p>}
          <button type="submit" className="btn-save" style={{ width: '100%', marginTop: 8 }} disabled={loading}>
            {loading ? 'Verifying…' : 'Log In'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ── PANELS ─────────────────────────────────────────────────

/* META & CAROUSEL */
function MetaPanel({ data, onChange }) {
  const m = data.meta || {};
  const up = (f, v) => onChange({ ...data, meta: { ...m, [f]: v } });
  return (
    <div>
      <div className="admin-panel-title">Site & Carousel</div>
      <div className="admin-card">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <Field label="Lab Name (short)" value={m.labName} onChange={v => up('labName', v)} />
          <Field label="Lab Full Name" value={m.labFullName} onChange={v => up('labFullName', v)} />
          <Field label="University" value={m.university} onChange={v => up('university', v)} />
          <div style={{ gridColumn: '1/-1' }}><Field label="Short Description (homepage hero)" value={m.shortDescription} onChange={v => up('shortDescription', v)} rows={3} /></div>
          <div style={{ gridColumn: '1/-1' }}><Field label="Full Research Description" value={m.description} onChange={v => up('description', v)} rows={3} /></div>
          <div style={{ gridColumn: '1/-1' }}><Field label="Funders Statement" value={m.funders} onChange={v => up('funders', v)} rows={3} /></div>
        </div>
      </div>

      <div style={{ fontWeight: 700, fontSize: '1.1rem', margin: '2rem 0 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        Carousel Images
        <button className="btn-add" onClick={() => onChange({ ...data, homeCarouselImages: [...(data.homeCarouselImages || []), ''] })}><Plus size={13} /> Add</button>
      </div>
      <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Use ▲▼ to reorder.</p>
      {(data.homeCarouselImages || []).map((img, i) => (
        <DraggableCard key={i} index={i} onMove={(from, to) => onChange({ ...data, homeCarouselImages: moveItem(data.homeCarouselImages, from, to) })} style={{ marginBottom: 8 }}>
          <div className="admin-card-header">
            <ReorderBtns idx={i} total={(data.homeCarouselImages || []).length} onMove={(from, to) => onChange({ ...data, homeCarouselImages: moveItem(data.homeCarouselImages, from, to) })} />
            <div style={{ flex: 1 }}><ImageField label={`Image ${i + 1}`} value={img} onChange={v => { const next = [...(data.homeCarouselImages || [])]; next[i] = v; onChange({ ...data, homeCarouselImages: next }); }} folder="slide" /></div>
          </div>
          <div className="admin-card-actions">
            <button className="btn-delete" onClick={() => onChange({ ...data, homeCarouselImages: (data.homeCarouselImages || []).filter((_, idx) => idx !== i) })}><Trash2 size={13} /> Remove</button>
          </div>
        </DraggableCard>
      ))}
    </div>
  );
}

/* NEWS */
function NewsPanel({ data, onChange }) {
  const items = data.news || [];
  const move = (from, to) => onChange({ ...data, news: moveItem(items, from, to) });
  const update = (i, field, val) => onChange({ ...data, news: items.map((it, idx) => idx === i ? { ...it, [field]: val } : it) });
  const remove = i => onChange({ ...data, news: items.filter((_, idx) => idx !== i) });
  const add = () => onChange({ ...data, news: [{ date: '', headline: '' }, ...items] });

  return (
    <div>
      <div className="admin-panel-title">News <button className="btn-add" onClick={add}><Plus size={14} /> Add</button></div>
      {items.map((item, i) => (
        <DraggableCard key={i} index={i} onMove={move}>
          <div className="admin-card-header">
            <ReorderBtns idx={i} total={items.length} onMove={move} />
            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '180px 1fr', gap: '0.75rem' }}>
              <Field label="Date" value={item.date} onChange={v => update(i, 'date', v)} />
              <Field label="Headline" value={item.headline} onChange={v => update(i, 'headline', v)} rows={2} />
            </div>
          </div>
          <div className="admin-card-actions">
            <button className="btn-delete" onClick={() => remove(i)}><Trash2 size={13} /> Delete</button>
          </div>
        </DraggableCard>
      ))}
    </div>
  );
}

/* DIRECTOR */
function DirectorPanel({ data, onChange }) {
  const d = data.director || {};
  const up = (f, v) => onChange({ ...data, director: { ...d, [f]: v } });
  return (
    <div>
      <div className="admin-panel-title">Director</div>
      <div className="admin-card">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <Field label="Name" value={d.name} onChange={v => up('name', v)} />
          <Field label="Title" value={d.title} onChange={v => up('title', v)} />
          <Field label="Email" value={d.email} onChange={v => up('email', v)} />
          <div style={{ gridColumn: '1/-1' }}><ImageField label="Photo" value={d.photo} onChange={v => up('photo', v)} folder="teampic" /></div>
          <div style={{ gridColumn: '1/-1' }}><Field label="Affiliation" value={d.affiliation} onChange={v => up('affiliation', v)} /></div>
          <div style={{ gridColumn: '1/-1' }}><Field label="Bio" value={d.bio} onChange={v => up('bio', v)} rows={6} /></div>
          <div style={{ gridColumn: '1/-1' }}><LinksField label="Other Links" value={d.links} onChange={v => up('links', v)} desc="LinkedIn, personal website, Google Scholar, etc." /></div>
        </div>
      </div>
    </div>
  );
}

/* STUDENT LIST (reusable for PhD, MS, BS) */
function StudentListPanel({ title, field, data, onChange }) {
  const items = data[field] || [];
  const move = (from, to) => onChange({ ...data, [field]: moveItem(items, from, to) });
  const update = (i, f, v) => onChange({ ...data, [field]: items.map((it, idx) => idx === i ? { ...it, [f]: v } : it) });
  const remove = i => onChange({ ...data, [field]: items.filter((_, idx) => idx !== i) });
  const add = () => onChange({ ...data, [field]: [...items, { name: '', photo: 'sundevil.jpg', info: '', email: '', links: [] }] });

  return (
    <div>
      <div className="admin-panel-title">{title} <button className="btn-add" onClick={add}><Plus size={14} /> Add</button></div>
      {items.map((m, i) => (
        <DraggableCard key={i} index={i} onMove={move}>
          <div className="admin-card-header">
            <ReorderBtns idx={i} total={items.length} onMove={move} />
            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <Field label="Name" value={m.name} onChange={v => update(i, 'name', v)} />
              <Field label="Info / Program & Year" value={m.info} onChange={v => update(i, 'info', v)} />
              <Field label="Email (optional)" value={m.email} onChange={v => update(i, 'email', v)} />
              <div style={{ gridColumn: '1/-1' }}><ImageField label="Photo" value={m.photo} onChange={v => update(i, 'photo', v)} folder="teampic" /></div>
              <div style={{ gridColumn: '1/-1' }}><LinksField label="Other Links" value={m.links} onChange={v => update(i, 'links', v)} desc="LinkedIn, personal website, Google Scholar, etc." /></div>
            </div>
          </div>
          <div className="admin-card-actions">
            <button className="btn-delete" onClick={() => remove(i)}><Trash2 size={13} /> Delete</button>
          </div>
        </DraggableCard>
      ))}
    </div>
  );
}

/* ALUMNI */
function AlumniPanel({ data, onChange }) {
  const [tab, setTab] = useState('alumniPhd');
  const tabs = [
    { id: 'alumniPhd', label: 'PhD' },
    { id: 'alumniMsc', label: 'MS' },
    { id: 'alumniBS',  label: 'BS' },
    { id: 'alumniNri', label: 'NRI/Visitors' },
  ];
  const items = data[tab] || [];
  const move = (from, to) => onChange({ ...data, [tab]: moveItem(items, from, to) });
  const update = (i, f, v) => onChange({ ...data, [tab]: items.map((it, idx) => idx === i ? { ...it, [f]: v } : it) });
  const remove = i => onChange({ ...data, [tab]: items.filter((_, idx) => idx !== i) });
  const add = () => {
    const base = { name: '', photo: 'sundevil.jpg' };
    const newItem = tab === 'alumniPhd' ? { ...base, graduated: '', job: '', thesis: '' } : { ...base, note: '' };
    onChange({ ...data, [tab]: [...items, newItem] });
  };

  return (
    <div>
      <div className="admin-panel-title">Alumni</div>
      <div className="alumni-tabs" style={{ marginBottom: '1.5rem' }}>
        {tabs.map(t => <button key={t.id} className={`alumni-tab${tab === t.id ? ' active' : ''}`} onClick={() => setTab(t.id)}>{t.label}</button>)}
      </div>
      <button className="btn-add" onClick={add} style={{ marginBottom: '1rem' }}><Plus size={14} /> Add</button>
      {items.map((a, i) => (
        <DraggableCard key={i} index={i} onMove={move}>
          <div className="admin-card-header">
            <ReorderBtns idx={i} total={items.length} onMove={move} />
            <div style={{ flex: 1 }}>
              {tab === 'alumniPhd' ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <Field label="Name" value={a.name} onChange={v => update(i, 'name', v)} />
                  <Field label="Graduated" value={a.graduated} onChange={v => update(i, 'graduated', v)} />
                  <Field label="Current Position" value={a.job} onChange={v => update(i, 'job', v)} />
                  <Field label="Email" value={a.email} onChange={v => update(i, 'email', v)} />
                  <div style={{ gridColumn: '1/-1' }}><Field label="Thesis Title" value={a.thesis} onChange={v => update(i, 'thesis', v)} rows={2} /></div>
                  <div style={{ gridColumn: '1/-1' }}><ImageField label="Photo" value={a.photo} onChange={v => update(i, 'photo', v)} folder="teampic" /></div>
                  <div style={{ gridColumn: '1/-1' }}><LinksField label="Other Links" value={a.links} onChange={v => update(i, 'links', v)} desc="LinkedIn, personal website, Google Scholar, etc." /></div>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <Field label="Name" value={a.name} onChange={v => update(i, 'name', v)} />
                  <Field label="Note" value={a.note} onChange={v => update(i, 'note', v)} />
                  {a.title !== undefined && <div style={{ gridColumn: '1/-1' }}><Field label="Title/Role" value={a.title} onChange={v => update(i, 'title', v)} /></div>}
                  <Field label="Email" value={a.email} onChange={v => update(i, 'email', v)} />
                  <div style={{ gridColumn: '1/-1' }}><ImageField label="Photo" value={a.photo} onChange={v => update(i, 'photo', v)} folder="teampic" /></div>
                  <div style={{ gridColumn: '1/-1' }}><LinksField label="Other Links" value={a.links} onChange={v => update(i, 'links', v)} desc="LinkedIn, personal website, Google Scholar, etc." /></div>
                </div>
              )}
            </div>
          </div>
          <div className="admin-card-actions">
            <button className="btn-delete" onClick={() => remove(i)}><Trash2 size={13} /> Delete</button>
          </div>
        </DraggableCard>
      ))}
    </div>
  );
}

/* RESEARCH */
function ResearchPanel({ data, onChange }) {
  const areas = data.researchAreas || [];
  const [openArea, setOpenArea] = useState(0);
  const moveArea = (from, to) => onChange({ ...data, researchAreas: moveItem(areas, from, to) });

  const updateArea = (i, field, val) =>
    onChange({ ...data, researchAreas: areas.map((a, idx) => idx === i ? { ...a, [field]: val } : a) });

  const moveProject = (ai, from, to) => {
    const nextAreas = areas.map((a, idx) => {
      if (idx !== ai) return a;
      return { ...a, projects: moveItem(a.projects || [], from, to) };
    });
    onChange({ ...data, researchAreas: nextAreas });
  };
  const updateProject = (ai, pi, field, val) => {
    const nextAreas = areas.map((a, idx) => {
      if (idx !== ai) return a;
      return { ...a, projects: (a.projects || []).map((p, pidx) => pidx === pi ? { ...p, [field]: val } : p) };
    });
    onChange({ ...data, researchAreas: nextAreas });
  };
  const addProject = ai => {
    const nextAreas = areas.map((a, idx) => {
      if (idx !== ai) return a;
      return { ...a, projects: [...(a.projects || []), { title: '', description: '', video: '', papers: [] }] };
    });
    onChange({ ...data, researchAreas: nextAreas });
  };
  const removeProject = (ai, pi) => {
    const nextAreas = areas.map((a, idx) => {
      if (idx !== ai) return a;
      return { ...a, projects: (a.projects || []).filter((_, pidx) => pidx !== pi) };
    });
    onChange({ ...data, researchAreas: nextAreas });
  };

  return (
    <div>
      <div className="admin-panel-title">Research Areas</div>
      {areas.map((area, ai) => (
        <DraggableCard key={ai} index={ai} onMove={moveArea} style={{ marginBottom: '1rem' }}>
          <div className="admin-card-header">
            <ReorderBtns idx={ai} total={areas.length} onMove={moveArea} />
            <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
              onClick={() => setOpenArea(openArea === ai ? -1 : ai)}>
              <h4 style={{ fontWeight: 700 }}>{area.title}</h4>
              {openArea === ai ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </div>
          </div>
          {openArea === ai && (
            <div style={{ marginTop: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <Field label="Title" value={area.title} onChange={v => updateArea(ai, 'title', v)} />
                <div style={{ gridColumn: '1/-1' }}><ImageField label="Image" value={area.image} onChange={v => updateArea(ai, 'image', v)} folder="" /></div>
                <div style={{ gridColumn: '1/-1' }}><Field label="Overview" value={area.overview} onChange={v => updateArea(ai, 'overview', v)} rows={4} /></div>
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between' }}>
                Projects
                <button className="btn-add" onClick={() => addProject(ai)}><Plus size={13} /> Add Project</button>
              </div>
              {(area.projects || []).map((proj, pi) => {
                const papers = proj.papers || [];
                const addPaper = () => updateProject(ai, pi, 'papers', [...papers, { title: '', url: '' }]);
                const updatePaper = (papIdx, field, val) => updateProject(ai, pi, 'papers', papers.map((p, idx) => idx === papIdx ? { ...p, [field]: val } : p));
                const removePaper = papIdx => updateProject(ai, pi, 'papers', papers.filter((_, idx) => idx !== papIdx));
                return (
                  <DraggableCard key={pi} index={pi} onMove={(from, to) => moveProject(ai, from, to)} className="inner-project-card" style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', borderRadius: 'var(--r-md)', padding: '1rem', marginBottom: '0.75rem', transition: 'all 0.2s ease' }}>
                    <div className="admin-card-header" style={{ marginBottom: '0.75rem' }}>
                      <ReorderBtns idx={pi} total={(area.projects || []).length} onMove={(from, to) => moveProject(ai, from, to)} />
                      <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{proj.title || `Project ${pi + 1}`}</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      <div style={{ gridColumn: '1/-1' }}><Field label="Project Title" value={proj.title} onChange={v => updateProject(ai, pi, 'title', v)} /></div>
                      <div style={{ gridColumn: '1/-1' }}><Field label="Description" value={proj.description} onChange={v => updateProject(ai, pi, 'description', v)} rows={3} /></div>
                      <Field label="YouTube Embed URL" value={proj.video} onChange={v => updateProject(ai, pi, 'video', v)} />
                    </div>

                    {/* Representative Publications */}
                    <div style={{ marginTop: '1rem', borderTop: '1px solid var(--color-border)', paddingTop: '0.75rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                          Representative Publications
                        </span>
                        <button className="btn-add" onClick={addPaper}><Plus size={12} /> Add Paper</button>
                      </div>
                      {papers.length === 0 && (
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.25rem 0 0.5rem' }}>No papers added yet.</p>
                      )}
                      {papers.map((paper, papIdx) => (
                        <div key={papIdx} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.5rem', alignItems: 'end', marginBottom: '0.5rem', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--r-md)', padding: '0.6rem 0.75rem' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                            <Field label="Paper Title" value={paper.title} onChange={v => updatePaper(papIdx, 'title', v)} />
                            <Field label="DOI / URL" value={paper.url} onChange={v => updatePaper(papIdx, 'url', v)} />
                          </div>
                          <button className="btn-delete" onClick={() => removePaper(papIdx)} style={{ marginBottom: '0' }}><Trash2 size={12} /></button>
                        </div>
                      ))}
                    </div>

                    <div className="admin-card-actions">
                      <button className="btn-delete" onClick={() => removeProject(ai, pi)}><Trash2 size={13} /> Remove Project</button>
                    </div>
                  </DraggableCard>
                );
              })}
            </div>
          )}
        </DraggableCard>
      ))}
    </div>
  );
}

/* PUBLICATIONS */
function PublicationsPanel({ data, onChange }) {
  const [tab, setTab] = useState('journalPubs');
  const items = data[tab] || [];
  const move = (from, to) => onChange({ ...data, [tab]: moveItem(items, from, to) });
  const update = (i, f, v) => onChange({ ...data, [tab]: items.map((it, idx) => idx === i ? { ...it, [f]: v } : it) });
  const remove = i => onChange({ ...data, [tab]: items.filter((_, idx) => idx !== i) });
  const add = () => onChange({ ...data, [tab]: [{ title: '', authors: '', venue: '', year: new Date().getFullYear(), url: '' }, ...items] });

  return (
    <div>
      <div className="admin-panel-title">Publications</div>
      <div className="tabs" style={{ marginBottom: '1.5rem' }}>
        <button className={`tab-btn${tab === 'journalPubs' ? ' active' : ''}`} onClick={() => setTab('journalPubs')}>Journal ({data.journalPubs?.length || 0})</button>
        <button className={`tab-btn${tab === 'confPubs' ? ' active' : ''}`} onClick={() => setTab('confPubs')}>Conference ({data.confPubs?.length || 0})</button>
      </div>
      <button className="btn-add" onClick={add} style={{ marginBottom: '1rem' }}><Plus size={14} /> Add</button>
      {items.map((pub, i) => (
        <DraggableCard key={i} index={i} onMove={move}>
          <div className="admin-card-header">
            <ReorderBtns idx={i} total={items.length} onMove={move} />
            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div style={{ gridColumn: '1/-1' }}><Field label="Title" value={pub.title} onChange={v => update(i, 'title', v)} /></div>
              <div style={{ gridColumn: '1/-1' }}><Field label="Authors" value={pub.authors} onChange={v => update(i, 'authors', v)} /></div>
              <Field label="Venue / Journal" value={pub.venue} onChange={v => update(i, 'venue', v)} />
              <Field label="Year" value={String(pub.year)} onChange={v => update(i, 'year', Number(v))} type="number" />
              <div style={{ gridColumn: '1/-1' }}><Field label="DOI / URL" value={pub.url} onChange={v => update(i, 'url', v)} /></div>
            </div>
          </div>
          <div className="admin-card-actions">
            <button className="btn-delete" onClick={() => remove(i)}><Trash2 size={13} /> Delete</button>
          </div>
        </DraggableCard>
      ))}
    </div>
  );
}

/* COURSES */
function CoursesPanel({ data, onChange }) {
  const items = data.courses || [];
  const move = (from, to) => onChange({ ...data, courses: moveItem(items, from, to) });
  const update = (i, f, v) => onChange({ ...data, courses: items.map((it, idx) => idx === i ? { ...it, [f]: v } : it) });
  const remove = i => onChange({ ...data, courses: items.filter((_, idx) => idx !== i) });
  const add = () => onChange({ ...data, courses: [...items, { code: '', title: '', semester: '', description: '' }] });

  return (
    <div>
      <div className="admin-panel-title">Courses <button className="btn-add" onClick={add}><Plus size={14} /> Add</button></div>
      {items.map((c, i) => (
        <DraggableCard key={i} index={i} onMove={move}>
          <div className="admin-card-header">
            <ReorderBtns idx={i} total={items.length} onMove={move} />
            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <Field label="Course Code" value={c.code} onChange={v => update(i, 'code', v)} />
              <Field label="Course Title" value={c.title} onChange={v => update(i, 'title', v)} />
              <Field label="Semester" value={c.semester} onChange={v => update(i, 'semester', v)} />
              <div style={{ gridColumn: '1/-1' }}><Field label="Description" value={c.description} onChange={v => update(i, 'description', v)} rows={4} /></div>
            </div>
          </div>
          <div className="admin-card-actions">
            <button className="btn-delete" onClick={() => remove(i)}><Trash2 size={13} /> Delete</button>
          </div>
        </DraggableCard>
      ))}
    </div>
  );
}

/* CONTACT */
function ContactPanel({ data, onChange }) {
  const c = data.contact || {};
  const up = (f, v) => onChange({ ...data, contact: { ...c, [f]: v } });
  const resources = c.resources || [];
  const moveRes = (from, to) => up('resources', moveItem(resources, from, to));
  const updateRes = (i, f, v) => up('resources', resources.map((r, idx) => idx === i ? { ...r, [f]: v } : r));
  const removeRes = i => up('resources', resources.filter((_, idx) => idx !== i));
  const addRes = () => up('resources', [...resources, { title: '', description: '', url: '' }]);

  return (
    <div>
      <div className="admin-panel-title">Contact Info</div>
      <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{ gridColumn: '1/-1' }}><Field label="Director's Office Address" value={c.directorOffice} onChange={v => up('directorOffice', v)} rows={2} /></div>
          <Field label="Phone" value={c.directorPhone} onChange={v => up('directorPhone', v)} />
          <div style={{ gridColumn: '1/-1' }}><Field label="Lab Location" value={c.labLocation} onChange={v => up('labLocation', v)} rows={2} /></div>
          <div style={{ gridColumn: '1/-1' }}><Field label="Google Maps Embed URL" value={c.mapsEmbed} onChange={v => up('mapsEmbed', v)} rows={3} /></div>
        </div>
      </div>

      <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        Resources
        <button className="btn-add" onClick={addRes}><Plus size={14} /> Add</button>
      </div>
      {resources.map((r, i) => (
        <DraggableCard key={i} index={i} onMove={moveRes}>
          <div className="admin-card-header">
            <ReorderBtns idx={i} total={resources.length} onMove={moveRes} />
            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <Field label="Title" value={r.title} onChange={v => updateRes(i, 'title', v)} />
              <Field label="URL (optional)" value={r.url} onChange={v => updateRes(i, 'url', v)} />
              <div style={{ gridColumn: '1/-1' }}><Field label="Description" value={r.description} onChange={v => updateRes(i, 'description', v)} rows={3} /></div>
            </div>
          </div>
          <div className="admin-card-actions">
            <button className="btn-delete" onClick={() => removeRes(i)}><Trash2 size={13} /> Delete</button>
          </div>
        </DraggableCard>
      ))}
    </div>
  );
}

// ── Sidebar nav ────────────────────────────────────────────
const NAV = [
  { id: 'meta',        icon: Image,         label: 'Site & Carousel' },
  { id: 'news',        icon: Newspaper,     label: 'News' },
  { id: 'director',    icon: Shield,        label: 'Director' },
  { id: 'docStudents', icon: GraduationCap, label: 'PhD Students' },
  { id: 'msStudents',  icon: GraduationCap, label: 'MS Students' },
  { id: 'bsStudents',  icon: Users,         label: 'BS Students' },
  { id: 'alumni',      icon: Users,         label: 'Alumni' },
  { id: 'research',    icon: Microscope,    label: 'Research' },
  { id: 'pubs',        icon: BookOpen,      label: 'Publications' },
  { id: 'courses',     icon: FlaskConical,  label: 'Courses' },
  { id: 'contact',     icon: Phone,         label: 'Contact' },
];

// ── Main Admin Component ───────────────────────────────────
export default function AdminPage({ data: initialData, onSaved }) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [activeSection, setActiveSection] = useState('meta');
  const [data, setData] = useState(initialData || {});
  const [toast, setToast] = useState('');
  const [saving, setSaving] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { if (initialData) setData(initialData); }, [initialData]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
  };

  const save = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, "website", "data"), data);
      setToast('Changes saved to Firebase successfully!');
      onSaved?.();
    } catch (e) { 
      setToast(e.message || 'Network error.'); 
    }
    finally { setSaving(false); }
  };

  if (!loggedIn) return <LoginScreen />;

  const renderPanel = () => {
    switch (activeSection) {
      case 'meta':        return <MetaPanel data={data} onChange={setData} />;
      case 'news':        return <NewsPanel data={data} onChange={setData} />;
      case 'director':    return <DirectorPanel data={data} onChange={setData} />;
      case 'docStudents': return <StudentListPanel title="PhD Students" field="docStudents" data={data} onChange={setData} />;
      case 'msStudents':  return <StudentListPanel title="MS Students" field="msStudents" data={data} onChange={setData} />;
      case 'bsStudents':  return <StudentListPanel title="BS Students" field="bsStudents" data={data} onChange={setData} />;
      case 'alumni':      return <AlumniPanel data={data} onChange={setData} />;
      case 'research':    return <ResearchPanel data={data} onChange={setData} />;
      case 'pubs':        return <PublicationsPanel data={data} onChange={setData} />;
      case 'courses':     return <CoursesPanel data={data} onChange={setData} />;
      case 'contact':     return <ContactPanel data={data} onChange={setData} />;
      default: return null;
    }
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <h3 style={{ marginBottom: '1rem' }}>Content</h3>
        {NAV.map(n => {
          const Icon = n.icon;
          return (
            <button key={n.id} className={`admin-nav-item${activeSection === n.id ? ' active' : ''}`}
              onClick={() => setActiveSection(n.id)}>
              <Icon size={15} /> {n.label}
            </button>
          );
        })}
        <div style={{ borderTop: '1px solid var(--color-border)', marginTop: '1.5rem', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <button className="btn-save" style={{ width: '100%', justifyContent: 'center', display: 'flex', gap: 8 }} onClick={save} disabled={saving}>
            <Save size={15} /> {saving ? 'Saving…' : 'Save All Changes'}
          </button>
          <button className="admin-nav-item" style={{ marginTop: 4 }} onClick={handleLogout}>
            <LogOut size={15} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="admin-content">
        {renderPanel()}
        <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn-save" onClick={save} disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Save size={16} /> {saving ? 'Saving…' : 'Save All Changes'}
          </button>
        </div>
      </main>

      {toast && <Toast msg={toast} onDone={() => setToast('')} />}
    </div>
  );
}

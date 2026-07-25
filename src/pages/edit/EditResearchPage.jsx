import { useState } from 'react';
import { ChevronDown, ExternalLink, Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import Editable from '../../components/Editable';
import { useEdit } from '../../context/EditContext';
import { Field, ImageField, DrawerSection } from '../../components/DrawerFields';
import { resolveImagePath } from '../../lib/images';

function ProjectItem({ project }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`project-item${open ? ' open' : ''}`}>
      <div className="project-header" onClick={() => setOpen(o => !o)}>
        <span className="project-title">{project.title}</span>
        <ChevronDown className="project-chevron" size={18} />
      </div>
      {open && (
        <div className="project-body">
          <div>
            <p className="project-desc">{project.description}</p>
            {project.papers?.length > 0 && (
              <div className="project-papers" style={{ marginTop: '1.5rem' }}>
                <h5>Representative Publications</h5>
                <ul>
                  {project.papers.map((p, i) => (
                    <li key={i} style={{ listStyle: 'none', display: 'flex', gap: '6px', alignItems: 'flex-start' }}>
                      <a href={p.url} target="_blank" rel="noreferrer">
                        {p.title} <ExternalLink size={12} style={{ display: 'inline', flexShrink: 0 }} />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div>
            {project.video ? (
              <div className="project-video">
                <iframe src={project.video} title={project.title} allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" />
              </div>
            ) : project.image ? (
              <img src={resolveImagePath(project.image)} alt={project.title}
                style={{ width: '100%', borderRadius: 'var(--r-md)', objectFit: 'cover', maxHeight: 240 }} />
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}

function ResearchAreaDrawer({ areaIndex }) {
  const { liveData, updateSection } = useEdit();
  const areas = liveData.researchAreas || [];
  const area = areas[areaIndex] || {};

  const updateArea = (field, value) => {
    const next = areas.map((a, i) => i === areaIndex ? { ...a, [field]: value } : a);
    updateSection('researchAreas', next);
  };
  const updateProject = (pi, field, value) => {
    const projs = (area.projects || []).map((p, i) => i === pi ? { ...p, [field]: value } : p);
    updateArea('projects', projs);
  };
  const addProject = () => updateArea('projects', [...(area.projects || []), { title: 'New Project', description: '', video: '' }]);
  const removeProject = pi => updateArea('projects', (area.projects || []).filter((_, i) => i !== pi));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <Field label="Title" value={area.title} onChange={v => updateArea('title', v)} />
      <Field label="ID (e.g. aerial-robotics)" value={area.id} onChange={v => updateArea('id', v)} />
      <ImageField label="Image" value={area.image} onChange={v => updateArea('image', v)} folder="" />
      <Field label="Overview" value={area.overview} onChange={v => updateArea('overview', v)} rows={5} />

      <DrawerSection title={`Projects (${(area.projects || []).length})`} />
      <button className="btn-add" onClick={addProject}><Plus size={13} /> Add Project</button>
      {(area.projects || []).map((proj, pi) => (
        <div key={pi} style={{ background: 'var(--color-bg)', borderRadius: 'var(--r-md)', padding: '0.75rem', border: '1px solid var(--color-border)' }}>
          <div style={{ fontWeight: 600, fontSize: '0.8rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Project {pi + 1}</div>
          <Field label="Title" value={proj.title} onChange={v => updateProject(pi, 'title', v)} />
          <div style={{ marginTop: '0.5rem' }}><Field label="Description" value={proj.description} onChange={v => updateProject(pi, 'description', v)} rows={3} /></div>
          <div style={{ marginTop: '0.5rem' }}><Field label="YouTube Embed URL" value={proj.video} onChange={v => updateProject(pi, 'video', v)} /></div>
          <button className="btn-delete" onClick={() => removeProject(pi)} style={{ marginTop: '0.5rem' }}>
            <Trash2 size={12} /> Remove Project
          </button>
        </div>
      ))}
    </div>
  );
}

function TabsManagerDrawer({ onTabChange }) {
  const { liveData, updateSection } = useEdit();
  const areas = liveData.researchAreas || [];

  const addArea = () => {
    const newArea = { id: `area-${Date.now()}`, title: 'New Research Area', overview: 'Describe this area.', image: '', projects: [] };
    updateSection('researchAreas', [...areas, newArea]);
    onTabChange(areas.length);
  };
  const removeArea = (i) => {
    updateSection('researchAreas', areas.filter((_, idx) => idx !== i));
    onTabChange(Math.max(0, i - 1));
  };
  const moveArea = (from, to) => {
    const next = [...areas];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    updateSection('researchAreas', next);
    onTabChange(to);
  };
  const renameArea = (i, v) => updateSection('researchAreas', areas.map((a, idx) => idx === i ? { ...a, title: v } : a));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
        Manage, rename, and reorder research area tabs. Click the tab content below to edit its details.
      </p>
      {areas.map((area, i) => (
        <div key={area.id || i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--color-bg)', padding: '0.5rem 0.75rem', borderRadius: 'var(--r-md)', border: '1px solid var(--color-border)' }}>
          <div style={{ flex: 1 }}><Field label="" value={area.title} onChange={v => renameArea(i, v)} /></div>
          <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
            <button onClick={() => { if (i > 0) moveArea(i, i - 1); }} disabled={i === 0} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '4px', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: i === 0 ? 'not-allowed' : 'pointer', opacity: i === 0 ? 0.4 : 1, color: 'var(--text-secondary)' }}><ArrowUp size={14} /></button>
            <button onClick={() => { if (i < areas.length - 1) moveArea(i, i + 1); }} disabled={i === areas.length - 1} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '4px', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: i === areas.length - 1 ? 'not-allowed' : 'pointer', opacity: i === areas.length - 1 ? 0.4 : 1, color: 'var(--text-secondary)' }}><ArrowDown size={14} /></button>
            <button onClick={() => removeArea(i)} style={{ background: 'transparent', border: '1px solid #c0392b', borderRadius: '4px', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#c0392b' }}><Trash2 size={14} /></button>
          </div>
        </div>
      ))}
      <button className="btn-add" onClick={addArea} style={{ marginTop: '0.5rem' }}><Plus size={13} /> Add Research Area</button>
    </div>
  );
}

function MetaDrawer() {
  const { liveData, updateField } = useEdit();
  const m = liveData.meta || {};
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <Field label="Research Page Eyebrow" value={m.researchEyebrow || 'Our Work'} onChange={v => updateField('meta.researchEyebrow', v)} />
      <Field label="Research Page Title" value={m.researchTitle || 'Research'} onChange={v => updateField('meta.researchTitle', v)} />
      <Field label="Research Description" value={m.description} onChange={v => updateField('meta.description', v)} rows={4} />
      <Field label="Funders Statement" value={m.funders} onChange={v => updateField('meta.funders', v)} rows={3} />
    </div>
  );
}

// eslint-disable-next-line no-unused-vars
function SponsorsDrawer() {
  const { liveData, updateSection } = useEdit();
  const sponsors = liveData.sponsors || [];

  const add = () => updateSection('sponsors', [...sponsors, { name: '', src: '' }]);
  const update = (i, f, v) => updateSection('sponsors', sponsors.map((s, idx) => idx === i ? { ...s, [f]: v } : s));
  const remove = i => updateSection('sponsors', sponsors.filter((_, idx) => idx !== i));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
        Add sponsor logos. Use a path relative to <code>public/images/logopic/</code> or a full URL.
      </p>
      {sponsors.map((s, i) => (
        <div key={i} style={{ background: 'var(--color-bg)', borderRadius: 'var(--r-md)', padding: '0.75rem', border: '1px solid var(--color-border)', display: 'flex', gap: '0.5rem', alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <Field label="Name" value={s.name} onChange={v => update(i, 'name', v)} />
            <div style={{ marginTop: '0.5rem' }}>
              <Field label="Logo path or URL" value={s.src} onChange={v => update(i, 'src', v)} />
            </div>
          </div>
          {s.src && (
            <img
              src={s.src.startsWith('http') ? s.src : `${import.meta.env.BASE_URL}images/logopic/${s.src}`}
              alt={s.name} style={{ height: 40, objectFit: 'contain', background: 'white', padding: '4px', borderRadius: '4px' }}
              onError={e => { e.target.style.display = 'none'; }}
            />
          )}
          <button onClick={() => remove(i)} style={{ background: 'transparent', border: '1px solid #c0392b', borderRadius: '4px', width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#c0392b', flexShrink: 0 }}><Trash2 size={14} /></button>
        </div>
      ))}
      <button className="btn-add" onClick={add} style={{ marginTop: '0.25rem' }}><Plus size={13} /> Add Sponsor</button>
    </div>
  );
}

export default function EditResearchPage() {
  const { liveData } = useEdit();
  const data = liveData;
  const areas = data?.researchAreas || [];
  const [active, setActive] = useState(0);
  const area = areas[active];
  const m = data?.meta || {};

  // Build funders from dedicated sponsors array or fallback to hardcoded
  const sponsors = data?.sponsors?.length > 0 ? data.sponsors : [
    { name: 'NSF',       src: `${import.meta.env.BASE_URL}images/logopic/NSF_logo.svg` },
    { name: 'AFOSR',     src: `${import.meta.env.BASE_URL}images/logopic/AFOSR.png` },
    { name: 'ONR',       src: `${import.meta.env.BASE_URL}images/logopic/ONR.png` },
    { name: 'NASA',      src: `${import.meta.env.BASE_URL}images/logopic/NASA_seal.svg` },
    { name: 'SFAz',      src: `${import.meta.env.BASE_URL}images/logopic/sfaz.png` },
    { name: 'ADHS',      src: `${import.meta.env.BASE_URL}images/logopic/ADHS-ABRC-full-v_3cc.png` },
    { name: 'Honeywell', src: `${import.meta.env.BASE_URL}images/logopic/Honeywell_logo.svg` },
    { name: 'NGC',       src: `${import.meta.env.BASE_URL}images/logopic/ngc.svg` },
  ];

  return (
    <div className="page-wrapper">
      {/* Editable hero */}
      <Editable label="Page Header & Description" content={<MetaDrawer />} position="top-right">
        <div className="page-hero">
          <div className="container">
            <span className="section-eyebrow">{m.researchEyebrow || 'Our Work'}</span>
            <h1>{m.researchTitle || 'Research'}</h1>
            <p>{data?.meta?.description}</p>
          </div>
        </div>
      </Editable>

      <section className="section">
        <div className="container">
          {/* Tab bar — Editable wraps tabs but NO overlay blocking tab clicks */}
          <Editable label="Manage Research Areas" content={<TabsManagerDrawer onTabChange={setActive} />} position="top-right">
            <div className="tabs" style={{ position: 'relative', minHeight: '52px' }}>
              {areas.map((a, i) => (
                <button
                  key={a.id || i}
                  className={`tab-btn${active === i ? ' active' : ''}`}
                  onClick={() => setActive(i)}
                >
                  {a.title}
                </button>
              ))}
              {areas.length === 0 && (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', padding: '0.75rem 0' }}>
                  No research areas — hover and click "Edit Manage Research Areas" to add one.
                </p>
              )}
            </div>
          </Editable>

          {area && (
            <Editable label={`Edit: ${area.title}`} content={<ResearchAreaDrawer areaIndex={active} />}>
              <div className="animate-fade-in">
                <div className="research-overview">
                  <div>
                    <span className="section-eyebrow">{area.title}</span>
                    <h2 style={{ fontSize: '2rem', marginTop: '0.5rem', marginBottom: '1rem' }}>{area.title}</h2>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>{area.overview}</p>
                  </div>
                  {area.image && (
                    <div className="project-image-wrapper">
                      <img src={resolveImagePath(area.image)} alt={area.title} loading="lazy"
                        onError={e => { e.target.style.display = 'none'; }} />
                    </div>
                  )}
                </div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1rem' }}>Projects</h3>
                <div className="project-accordion">
                  {area.projects?.map((proj, i) => <ProjectItem key={i} project={proj} />)}
                </div>
              </div>
            </Editable>
          )}

          {/* Sponsors strip */}
          <div className="funders-strip">
            {sponsors.map((f, i) => (
              <img key={i} className="funder-logo"
                src={f.src?.startsWith('http') || f.src?.startsWith('/') ? f.src : `${import.meta.env.BASE_URL}images/logopic/${f.src}`}
                alt={f.name}
                onError={e => { e.target.style.display = 'none'; }}
              />
            ))}
          </div>
          <p style={{ textAlign: 'center', fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '1rem' }}>
            {data?.meta?.funders}
          </p>
        </div>
      </section>
    </div>
  );
}

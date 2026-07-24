import { useState } from 'react';
import { Mail, Plus, Pencil, Check, X } from 'lucide-react';
import { useEdit } from '../../context/EditContext';
import { Field } from '../../components/DrawerFields';

/* ── Reusable section-header label ──────────────────────── */
function SectionLabel({ children, count }) {
  return (
    <h2 style={{
      fontSize: '0.72rem', fontWeight: 800, marginBottom: '1.25rem',
      color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.14em',
      display: 'flex', alignItems: 'center', gap: '0.5rem'
    }}>
      {children}
      {count !== undefined && (
        <span style={{
          background: 'var(--color-maroon)', color: '#fff',
          borderRadius: '20px', padding: '1px 8px', fontSize: '0.65rem', fontWeight: 700
        }}>{count}</span>
      )}
    </h2>
  );
}

/* ── Inline-editable member card ────────────────────────── */
function EditableMemberCard({ member, onChange, onRemove }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(member);

  const save = () => { onChange(draft); setEditing(false); };
  const cancel = () => { setDraft(member); setEditing(false); };

  if (editing) {
    return (
      <div className="team-card" style={{ border: '2px solid var(--color-maroon)', padding: '1rem', gap: '0.5rem', display: 'flex', flexDirection: 'column' }}>
        <Field label="Name" value={draft.name} onChange={v => setDraft(d => ({ ...d, name: v }))} />
        <Field label="Info / Role" value={draft.info || ''} onChange={v => setDraft(d => ({ ...d, info: v }))} />
        <Field label="Email" value={draft.email || ''} onChange={v => setDraft(d => ({ ...d, email: v }))} />
        <Field label="Photo filename (from teampic/)" value={draft.photo || ''} onChange={v => setDraft(d => ({ ...d, photo: v }))} />
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem', justifyContent: 'flex-end' }}>
          <button onClick={cancel} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--r-sm)', padding: '5px 10px', fontSize: '0.8rem', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <X size={13}/> Cancel
          </button>
          <button onClick={save} style={{ background: 'var(--color-maroon)', border: 'none', borderRadius: 'var(--r-sm)', padding: '5px 12px', fontSize: '0.8rem', cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Check size={13}/> Save
          </button>
        </div>
        <button onClick={onRemove} style={{ fontSize: '0.72rem', color: '#c0392b', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: '2px 0' }}>
          🗑 Remove member
        </button>
      </div>
    );
  }

  return (
    <div className="team-card animate-fade-up" style={{ position: 'relative', cursor: 'default' }}>
      {/* Inline edit button — always visible in edit mode */}
      <button
        onClick={() => setEditing(true)}
        title="Edit member"
        style={{
          position: 'absolute', top: '8px', right: '8px',
          background: 'var(--color-maroon)', border: 'none', borderRadius: '50%',
          width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: '#fff', opacity: 0.85, zIndex: 10,
          transition: 'opacity 0.15s, transform 0.15s',
          boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
        }}
        onMouseEnter={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'scale(1.1)'; }}
        onMouseLeave={e => { e.currentTarget.style.opacity = '0.85'; e.currentTarget.style.transform = 'scale(1)'; }}
      >
        <Pencil size={13} />
      </button>
      <img
        className="team-avatar"
        src={`${import.meta.env.BASE_URL}images/teampic/${member.photo || 'sundevil.jpg'}`}
        alt={member.name}
        onError={e => { e.target.src = `${import.meta.env.BASE_URL}images/teampic/sundevil.jpg`; }}
      />
      <div className="team-name">{member.name || '(no name)'}</div>
      {member.info && <div className="team-info">{member.info}</div>}
      <div className="team-links">
        {member.email && (
          <a className="team-link" href={`mailto:${member.email}`} title="Email">
            <Mail size={12} />
          </a>
        )}
      </div>
    </div>
  );
}

/* ── Editable grid section for a student group ──────────── */
function EditableStudentSection({ field, label }) {
  const { liveData, updateSection } = useEdit();
  const items = liveData[field] || [];

  const update = (i, newMember) => updateSection(field, items.map((m, idx) => idx === i ? newMember : m));
  const remove = (i) => updateSection(field, items.filter((_, idx) => idx !== i));
  const add = () => updateSection(field, [...items, { name: 'New Member', photo: 'sundevil.jpg', info: '', email: '' }]);

  return (
    <div style={{ marginBottom: 'var(--space-2xl)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <SectionLabel count={items.length}>{label}</SectionLabel>
        <button
          onClick={add}
          style={{
            background: 'var(--color-maroon)', border: 'none', borderRadius: 'var(--r-full)',
            padding: '6px 14px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', color: '#fff',
            display: 'flex', alignItems: 'center', gap: '5px', boxShadow: '0 2px 8px rgba(140,29,64,0.35)'
          }}
        >
          <Plus size={14} /> Add
        </button>
      </div>
      <div className="grid-4 stagger-children">
        {items.map((m, i) => (
          <EditableMemberCard key={i} member={m} onChange={v => update(i, v)} onRemove={() => remove(i)} />
        ))}
        {items.length === 0 && (
          <div style={{ gridColumn: '1 / -1', color: 'var(--text-muted)', fontSize: '0.9rem', fontStyle: 'italic', padding: '1rem 0' }}>
            No members yet — click "Add" to get started.
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Alumni section (unchanged) ─────────────────────────── */
function AlumniSection({ data }) {
  const [tab, setTab] = useState('phd');
  const tabs = [
    { id: 'phd', label: 'PhD Alumni', count: data?.alumniPhd?.length },
    { id: 'msc', label: 'MS Alumni', count: data?.alumniMsc?.length },
    { id: 'bs', label: 'BS/Undergrad Alumni', count: data?.alumniBS?.length },
    { id: 'nri', label: 'Research Visitors', count: data?.alumniNri?.length },
  ];
  return (
    <div>
      <div className="alumni-tabs">
        {tabs.map(t => (
          <button key={t.id} className={`alumni-tab${tab === t.id ? ' active' : ''}`} onClick={() => setTab(t.id)}>
            {t.label} {t.count ? <span style={{ opacity: 0.6, fontSize: '0.78rem' }}>({t.count})</span> : null}
          </button>
        ))}
      </div>
      {tab === 'phd' && (
        <div className="alumni-list">
          {data?.alumniPhd?.map((a, i) => (
            <div key={i} className="alumni-item">
              <div className="alumni-name">{a.name} <span style={{ fontWeight: 400, color: 'var(--text-muted)', fontSize: '0.85rem' }}>— {a.graduated}</span></div>
              {a.job && <div className="alumni-job">↗ {a.job}</div>}
              {a.thesis && <div className="alumni-thesis">"{a.thesis}"</div>}
            </div>
          ))}
        </div>
      )}
      {tab === 'msc' && (
        <div className="alumni-list">
          {data?.alumniMsc?.map((a, i) => (
            <div key={i} className="alumni-item">
              <div className="alumni-name">{a.name}</div>
              {a.note && <div className="alumni-note">{a.note}</div>}
            </div>
          ))}
        </div>
      )}
      {tab === 'bs' && (
        <div className="alumni-list">
          {data?.alumniBS?.map((a, i) => (
            <div key={i} className="alumni-item">
              <div className="alumni-name">{a.name}</div>
              {a.note && <div className="alumni-note">{a.note}</div>}
            </div>
          ))}
        </div>
      )}
      {tab === 'nri' && (
        <div className="alumni-list">
          {data?.alumniNri?.map((a, i) => (
            <div key={i} className="alumni-item">
              <div className="alumni-name">{a.name} <span style={{ fontWeight: 400, color: 'var(--text-muted)', fontSize: '0.85rem' }}>— {a.note}</span></div>
              {a.title && <div className="alumni-note">{a.title}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Director inline editor ─────────────────────────────── */
function DirectorEditor() {
  const { liveData, updateField } = useEdit();
  const d = liveData.director || {};
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(d);

  const save = () => {
    Object.entries(draft).forEach(([k, v]) => updateField(`director.${k}`, v));
    setEditing(false);
  };

  if (editing) {
    return (
      <div style={{ marginBottom: 'var(--space-2xl)', border: '2px solid var(--color-maroon)', borderRadius: 'var(--r-lg)', padding: '1.5rem' }}>
        <SectionLabel>Lab Director — Editing</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <Field label="Name" value={draft.name} onChange={v => setDraft(dd => ({ ...dd, name: v }))} />
          <Field label="Title" value={draft.title} onChange={v => setDraft(dd => ({ ...dd, title: v }))} />
          <Field label="Email" value={draft.email} onChange={v => setDraft(dd => ({ ...dd, email: v }))} />
          <Field label="Photo filename" value={draft.photo} onChange={v => setDraft(dd => ({ ...dd, photo: v }))} />
          <div style={{ gridColumn: '1/-1' }}><Field label="Affiliation" value={draft.affiliation} onChange={v => setDraft(dd => ({ ...dd, affiliation: v }))} /></div>
          <div style={{ gridColumn: '1/-1' }}><Field label="Bio" value={draft.bio} onChange={v => setDraft(dd => ({ ...dd, bio: v }))} rows={4} /></div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', justifyContent: 'flex-end' }}>
          <button onClick={() => setEditing(false)} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--r-sm)', padding: '6px 14px', fontSize: '0.85rem', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <X size={14}/> Cancel
          </button>
          <button onClick={save} style={{ background: 'var(--color-maroon)', border: 'none', borderRadius: 'var(--r-sm)', padding: '6px 16px', fontSize: '0.85rem', cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Check size={14}/> Save Director
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ marginBottom: 'var(--space-2xl)', position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <SectionLabel>Lab Director</SectionLabel>
        <button
          onClick={() => { setDraft(d); setEditing(true); }}
          style={{ background: 'var(--color-maroon)', border: 'none', borderRadius: 'var(--r-full)', padding: '6px 14px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center', gap: '5px' }}
        >
          <Pencil size={13}/> Edit Director
        </button>
      </div>
      <div className="director-card">
        <img className="director-avatar"
          src={`${import.meta.env.BASE_URL}images/teampic/${d.photo}`}
          alt={d.name}
          onError={e => { e.target.src = `${import.meta.env.BASE_URL}images/teampic/sundevil.jpg`; }} />
        <div>
          <p className="director-title">{d.title}</p>
          <h2 className="director-name">Dr. {d.name}</h2>
          <p className="director-affil">{d.affiliation}</p>
          <p className="director-bio">{d.bio}</p>
        </div>
      </div>
    </div>
  );
}

/* ── Main Page ───────────────────────────────────────────── */
export default function EditTeamPage() {
  const { liveData } = useEdit();
  const data = liveData;
  const [view, setView] = useState('current');

  return (
    <div className="page-wrapper">
      {/* Edit Mode Banner */}
      <div style={{
        background: 'linear-gradient(135deg, var(--color-maroon), #6b1230)',
        padding: '0.75rem 1.5rem',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
        fontSize: '0.85rem', color: '#fff'
      }}>
        <Pencil size={14}/>
        <span><strong>Edit Mode:</strong> Click the <strong style={{ color: 'var(--color-gold)' }}>✎ pencil button</strong> on any member card to edit their info. Use <strong style={{ color: 'var(--color-gold)' }}>+ Add</strong> to add new members.</span>
      </div>

      <div className="page-hero">
        <div className="container">
          <span className="section-eyebrow">The People</span>
          <h1>Our Team</h1>
          <p>Meet the researchers, engineers, and students driving innovation at the RISE Lab.</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          {/* View toggle */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2.5rem' }}>
            <div className="tabs" style={{ width: 'fit-content' }}>
              <button className={`tab-btn${view === 'current' ? ' active' : ''}`} onClick={() => setView('current')}>Current Members</button>
              <button className={`tab-btn${view === 'alumni' ? ' active' : ''}`} onClick={() => setView('alumni')}>Alumni</button>
            </div>
          </div>

          {view === 'current' && (
            <div>
              <DirectorEditor />
              <EditableStudentSection field="postdocStudents" label="Post-Doctoral Researchers" />
              <EditableStudentSection field="docStudents" label="PhD Students" />
              <EditableStudentSection field="msStudents" label="MS Students" />
              <EditableStudentSection field="bsStudents" label="Undergraduate Students" />
            </div>
          )}

          {view === 'alumni' && <AlumniSection data={data} />}
        </div>
      </section>
    </div>
  );
}

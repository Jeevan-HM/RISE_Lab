import { useState } from 'react';
import { Mail, Plus, Pencil, Check, X } from 'lucide-react';
import { useEdit } from '../../context/EditContext';
import { Field, ImageField } from '../../components/DrawerFields';
import { resolveImagePath } from '../../lib/images';

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
        <ImageField label="Photo" value={draft.photo || ''} onChange={v => setDraft(d => ({ ...d, photo: v }))} folder="teampic" />
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
        src={resolveImagePath(member.photo, 'teampic') || `${import.meta.env.BASE_URL}images/teampic/sundevil.jpg`}
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

/* ── Inline-editable alumni item ────────────────────────── */
function EditableAlumniItem({ item, kind, onChange, onRemove }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(item);

  const save = () => { onChange(draft); setEditing(false); };
  const cancel = () => { setDraft(item); setEditing(false); };

  if (editing) {
    return (
      <div className="alumni-item" style={{ border: '2px solid var(--color-maroon)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <Field label="Name" value={draft.name} onChange={v => setDraft(d => ({ ...d, name: v }))} />
        {kind === 'phd' ? (
          <>
            <Field label="Graduated" value={draft.graduated || ''} onChange={v => setDraft(d => ({ ...d, graduated: v }))} />
            <Field label="Current Position" value={draft.job || ''} onChange={v => setDraft(d => ({ ...d, job: v }))} />
            <Field label="Thesis Title" value={draft.thesis || ''} onChange={v => setDraft(d => ({ ...d, thesis: v }))} rows={2} />
          </>
        ) : (
          <>
            <Field label="Note" value={draft.note || ''} onChange={v => setDraft(d => ({ ...d, note: v }))} />
            {kind === 'nri' && <Field label="Title/Role" value={draft.title || ''} onChange={v => setDraft(d => ({ ...d, title: v }))} />}
          </>
        )}
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem', justifyContent: 'flex-end' }}>
          <button onClick={cancel} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--r-sm)', padding: '5px 10px', fontSize: '0.8rem', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <X size={13}/> Cancel
          </button>
          <button onClick={save} style={{ background: 'var(--color-maroon)', border: 'none', borderRadius: 'var(--r-sm)', padding: '5px 12px', fontSize: '0.8rem', cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Check size={13}/> Save
          </button>
        </div>
        <button onClick={onRemove} style={{ fontSize: '0.72rem', color: '#c0392b', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: '2px 0' }}>
          🗑 Remove
        </button>
      </div>
    );
  }

  return (
    <div className="alumni-item" style={{ position: 'relative' }}>
      <button
        onClick={() => setEditing(true)}
        title="Edit alumnus"
        style={{
          position: 'absolute', top: '8px', right: '8px',
          background: 'var(--color-maroon)', border: 'none', borderRadius: '50%',
          width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: '#fff', opacity: 0.85, zIndex: 10,
        }}
      >
        <Pencil size={11} />
      </button>
      {kind === 'phd' && (
        <>
          <div className="alumni-name">{item.name} <span style={{ fontWeight: 400, color: 'var(--text-muted)', fontSize: '0.85rem' }}>— {item.graduated}</span></div>
          {item.job && <div className="alumni-job">↗ {item.job}</div>}
          {item.thesis && <div className="alumni-thesis">"{item.thesis}"</div>}
        </>
      )}
      {kind === 'note' && (
        <>
          <div className="alumni-name">{item.name}</div>
          {item.note && <div className="alumni-note">{item.note}</div>}
        </>
      )}
      {kind === 'nri' && (
        <>
          <div className="alumni-name">{item.name} <span style={{ fontWeight: 400, color: 'var(--text-muted)', fontSize: '0.85rem' }}>— {item.note}</span></div>
          {item.title && <div className="alumni-note">{item.title}</div>}
        </>
      )}
    </div>
  );
}

/* ── Alumni section (editable) ──────────────────────────── */
function AlumniSection({ data }) {
  const { updateSection } = useEdit();
  const [tab, setTab] = useState('phd');
  const tabs = [
    { id: 'phd', field: 'alumniPhd', label: 'PhD Alumni', kind: 'phd' },
    { id: 'msc', field: 'alumniMsc', label: 'MS Alumni', kind: 'note' },
    { id: 'bs', field: 'alumniBS', label: 'BS/Undergrad Alumni', kind: 'note' },
    { id: 'nri', field: 'alumniNri', label: 'Research Visitors', kind: 'nri' },
  ];
  const active = tabs.find(t => t.id === tab);
  const items = data?.[active.field] || [];

  const update = (i, newItem) => updateSection(active.field, items.map((it, idx) => idx === i ? newItem : it));
  const remove = (i) => updateSection(active.field, items.filter((_, idx) => idx !== i));
  const add = () => {
    const newItem = active.kind === 'phd' ? { name: 'New Alumnus', graduated: '', job: '', thesis: '' } : { name: 'New Alumnus', note: '' };
    updateSection(active.field, [...items, newItem]);
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div className="alumni-tabs">
          {tabs.map(t => (
            <button key={t.id} className={`alumni-tab${tab === t.id ? ' active' : ''}`} onClick={() => setTab(t.id)}>
              {t.label} {data?.[t.field]?.length ? <span style={{ opacity: 0.6, fontSize: '0.78rem' }}>({data[t.field].length})</span> : null}
            </button>
          ))}
        </div>
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
      <div className="alumni-list" style={{ marginTop: '1.25rem' }}>
        {items.map((a, i) => (
          <EditableAlumniItem key={i} item={a} kind={active.kind} onChange={v => update(i, v)} onRemove={() => remove(i)} />
        ))}
        {items.length === 0 && (
          <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontStyle: 'italic', padding: '1rem 0' }}>
            No entries yet — click "Add" to get started.
          </div>
        )}
      </div>
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
          <div style={{ gridColumn: '1/-1' }}><ImageField label="Photo" value={draft.photo} onChange={v => setDraft(dd => ({ ...dd, photo: v }))} folder="teampic" /></div>
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
          src={resolveImagePath(d.photo, 'teampic') || `${import.meta.env.BASE_URL}images/teampic/sundevil.jpg`}
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

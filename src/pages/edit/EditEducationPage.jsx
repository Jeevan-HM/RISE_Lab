
import { ExternalLink, Plus, Trash2 } from 'lucide-react';
import Editable from '../../components/Editable';
import { useEdit } from '../../context/EditContext';
import { Field, ImageField } from '../../components/DrawerFields';
import { resolveImagePath } from '../../lib/images';

function HeroDrawer() {
  const { liveData, updateField } = useEdit();
  const m = liveData.meta || {};
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <Field label="Page Eyebrow" value={m.eduEyebrow || 'Teaching & Engagement'} onChange={v => updateField('meta.eduEyebrow', v)} />
      <Field label="Page Title" value={m.eduTitle || 'Education & Outreach'} onChange={v => updateField('meta.eduTitle', v)} />
      <Field label="Page Description" value={m.eduDescription || ''} onChange={v => updateField('meta.eduDescription', v)} rows={3} />
    </div>
  );
}

function CoursesDrawer() {
  const { liveData, updateSection } = useEdit();
  const items = liveData.courses || [];
  const update = (i, f, v) => updateSection('courses', items.map((it, idx) => idx === i ? { ...it, [f]: v } : it));
  const remove = i => updateSection('courses', items.filter((_, idx) => idx !== i));
  const add = () => updateSection('courses', [...items, { code: '', title: '', semester: '', description: '' }]);

  return (
    <div>
      <button className="btn-add" onClick={add} style={{ marginBottom: '1rem' }}>
        <Plus size={13} /> Add Course
      </button>
      {items.map((c, i) => (
        <div key={i} style={{ background: 'var(--color-bg)', borderRadius: 'var(--r-md)', padding: '0.75rem', marginBottom: '0.75rem', border: '1px solid var(--color-border)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <Field label="Course Code" value={c.code} onChange={v => update(i, 'code', v)} />
            <Field label="Semester" value={c.semester} onChange={v => update(i, 'semester', v)} />
          </div>
          <div style={{ marginTop: '0.5rem' }}>
            <Field label="Course Title" value={c.title} onChange={v => update(i, 'title', v)} />
          </div>
          <div style={{ marginTop: '0.5rem' }}>
            <Field label="Description" value={c.description} onChange={v => update(i, 'description', v)} rows={3} />
          </div>
          <button className="btn-delete" onClick={() => remove(i)} style={{ marginTop: '0.5rem' }}>
            <Trash2 size={12} /> Remove
          </button>
        </div>
      ))}
    </div>
  );
}

function OutreachDrawer() {
  const { liveData, updateSection } = useEdit();
  const outreach = liveData.outreach || { description: '', events: [] };
  const events = outreach.events || [];

  const update = (i, f, v) => {
    const next = events.map((e, idx) => idx === i ? { ...e, [f]: v } : e);
    updateSection('outreach', { ...outreach, events: next });
  };
  const remove = i => updateSection('outreach', { ...outreach, events: events.filter((_, idx) => idx !== i) });
  const add = () => updateSection('outreach', { ...outreach, events: [...events, { name: '', description: '', url: '', image: '' }] });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <Field label="Section Description" value={outreach.description || ''} onChange={v => updateSection('outreach', { ...outreach, description: v })} rows={3} />
      <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
        <button className="btn-add" onClick={add} style={{ marginBottom: '1rem' }}>
          <Plus size={13} /> Add Event
        </button>
        {events.map((event, i) => (
          <div key={i} style={{ background: 'var(--color-bg)', borderRadius: 'var(--r-md)', padding: '0.75rem', marginBottom: '0.75rem', border: '1px solid var(--color-border)' }}>
            <Field label="Event Name" value={event.name} onChange={v => update(i, 'name', v)} />
            <div style={{ marginTop: '0.5rem' }}>
              <Field label="Description" value={event.description} onChange={v => update(i, 'description', v)} rows={3} />
            </div>
            <div style={{ marginTop: '0.5rem' }}>
              <Field label="URL" value={event.url} onChange={v => update(i, 'url', v)} />
            </div>
            <div style={{ marginTop: '0.5rem' }}>
              <ImageField label="Image" value={event.image} onChange={v => update(i, 'image', v)} folder="" />
            </div>
            <button className="btn-delete" onClick={() => remove(i)} style={{ marginTop: '0.5rem' }}>
              <Trash2 size={12} /> Remove Event
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function EditEducationPage() {
  const { liveData } = useEdit();
  const data = liveData;
  const courses = data?.courses || [];
  const outreach = data?.outreach;
  const m = data?.meta || {};

  return (
    <div className="page-wrapper">
      {/* Editable hero */}
      <Editable label="Page Header" content={<HeroDrawer />} position="top-right">
        <div className="page-hero">
          <div className="container">
            <span className="section-eyebrow">{m.eduEyebrow || 'Teaching & Engagement'}</span>
            <h1>{m.eduTitle || 'Education & Outreach'}</h1>
            <p>{m.eduDescription || 'Our commitment to education extends beyond the lab through innovative courses and community engagement.'}</p>
          </div>
        </div>
      </Editable>

      {/* Courses section */}
      <section className="section">
        <div className="container">
          <Editable label="Courses" content={<CoursesDrawer />} position="top-right">
            <div>
              <div className="section-header">
                <span className="section-eyebrow">Courses Taught</span>
                <h2>Courses</h2>
              </div>
              <div className="grid-2">
                {courses.map((course, i) => (
                  <div key={i} className="course-card animate-fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
                    <div className="course-code">{course.code}</div>
                    <div className="course-title">{course.title}</div>
                    <div className="course-semester">{course.semester}</div>
                    <p className="course-desc">{course.description}</p>
                  </div>
                ))}
                {courses.length === 0 && (
                  <p style={{ color: 'var(--text-muted)', gridColumn: '1/-1', fontStyle: 'italic' }}>No courses yet. Click Edit Courses to add.</p>
                )}
              </div>
            </div>
          </Editable>
        </div>
      </section>

      {/* Outreach section — always shown in edit mode */}
      <section className="section" style={{ background: 'var(--color-surface)', borderTop: '1px solid var(--color-border)' }}>
        <div className="container">
          <Editable label="Community Outreach" content={<OutreachDrawer />} position="top-right">
            <div>
              <div className="section-header">
                <span className="section-eyebrow">Community Engagement</span>
                <h2>Outreach</h2>
                {outreach?.description && <p>{outreach.description}</p>}
              </div>
              <div className="grid-2">
                {(outreach?.events || []).map((event, i) => (
                  <div key={i} className="outreach-card animate-fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
                    {event.image && (
                      <img src={resolveImagePath(event.image)} alt={event.name}
                        onError={e => { e.target.style.display = 'none'; }} />
                    )}
                    <div className="outreach-body">
                      <div className="outreach-name">{event.name}</div>
                      <p className="outreach-desc">{event.description}</p>
                      <a className="btn btn-ghost" href={event.url} target="_blank" rel="noreferrer">
                        Learn More <ExternalLink size={13} />
                      </a>
                    </div>
                  </div>
                ))}
                {(!outreach?.events?.length) && (
                  <p style={{ color: 'var(--text-muted)', gridColumn: '1/-1', fontStyle: 'italic' }}>No outreach events yet. Click "Edit Community Outreach" to add.</p>
                )}
              </div>
            </div>
          </Editable>
        </div>
      </section>
    </div>
  );
}

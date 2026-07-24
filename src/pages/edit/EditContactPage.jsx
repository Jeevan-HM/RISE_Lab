
import { MapPin, Phone, Building2, ExternalLink, Plus, Trash2 } from 'lucide-react';
import Editable from '../../components/Editable';
import { useEdit } from '../../context/EditContext';
import { Field } from '../../components/DrawerFields';

function HeroDrawer() {
  const { liveData, updateField } = useEdit();
  const m = liveData.meta || {};
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <Field label="Page Eyebrow" value={m.contactEyebrow || 'Find Us'} onChange={v => updateField('meta.contactEyebrow', v)} />
      <Field label="Page Title" value={m.contactTitle || 'Contact'} onChange={v => updateField('meta.contactTitle', v)} />
      <Field label="Page Description" value={m.contactDescription || ''} onChange={v => updateField('meta.contactDescription', v)} rows={2} />
    </div>
  );
}

function ContactInfoDrawer() {
  const { liveData, updateField } = useEdit();
  const c = liveData.contact || {};
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <Field label="Director's Office Address" value={c.directorOffice} onChange={v => updateField('contact.directorOffice', v)} rows={2} />
      <Field label="Phone" value={c.directorPhone} onChange={v => updateField('contact.directorPhone', v)} />
      <Field label="Lab Location" value={c.labLocation} onChange={v => updateField('contact.labLocation', v)} rows={2} />
    </div>
  );
}

function MapDrawer() {
  const { liveData, updateField } = useEdit();
  const c = liveData.contact || {};
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
        Paste a Google Maps embed URL. In Google Maps: Share → Embed a map → Copy the <code>src="..."</code> value.
      </p>
      <Field label="Google Maps Embed URL" value={c.mapsEmbed} onChange={v => updateField('contact.mapsEmbed', v)} rows={4} />
      {c.mapsEmbed && (
        <div style={{ borderRadius: 'var(--r-md)', overflow: 'hidden', marginTop: '0.5rem', height: 200 }}>
          <iframe src={c.mapsEmbed} width="100%" height="200" style={{ border: 0 }} allowFullScreen loading="lazy" title="Preview" />
        </div>
      )}
    </div>
  );
}

function ResourcesDrawer() {
  const { liveData, updateField } = useEdit();
  const resources = liveData.contact?.resources || [];
  const update = (i, f, v) => {
    const next = resources.map((r, idx) => idx === i ? { ...r, [f]: v } : r);
    updateField('contact.resources', next);
  };
  const remove = i => updateField('contact.resources', resources.filter((_, idx) => idx !== i));
  const add = () => updateField('contact.resources', [...resources, { title: '', description: '', url: '' }]);

  return (
    <div>
      <button className="btn-add" onClick={add} style={{ marginBottom: '1rem' }}>
        <Plus size={13} /> Add Resource
      </button>
      {resources.map((r, i) => (
        <div key={i} style={{ background: 'var(--color-bg)', borderRadius: 'var(--r-md)', padding: '0.75rem', marginBottom: '0.75rem', border: '1px solid var(--color-border)' }}>
          <Field label="Title" value={r.title} onChange={v => update(i, 'title', v)} />
          <div style={{ marginTop: '0.5rem' }}>
            <Field label="URL (optional)" value={r.url} onChange={v => update(i, 'url', v)} />
          </div>
          <div style={{ marginTop: '0.5rem' }}>
            <Field label="Description" value={r.description} onChange={v => update(i, 'description', v)} rows={3} />
          </div>
          <button className="btn-delete" onClick={() => remove(i)} style={{ marginTop: '0.5rem' }}>
            <Trash2 size={12} /> Remove
          </button>
        </div>
      ))}
    </div>
  );
}

export default function EditContactPage() {
  const { liveData } = useEdit();
  const contact = liveData?.contact;
  const m = liveData?.meta || {};

  if (!contact) return (
    <div className="page-wrapper">
      <div className="page-hero"><div className="container"><h1>Contact</h1><p style={{ color: 'var(--text-muted)' }}>No contact data yet. Use the Advanced editor to seed initial data.</p></div></div>
    </div>
  );

  return (
    <div className="page-wrapper">
      {/* Editable hero */}
      <Editable label="Page Header" content={<HeroDrawer />} position="top-right">
        <div className="page-hero">
          <div className="container">
            <span className="section-eyebrow">{m.contactEyebrow || 'Find Us'}</span>
            <h1>{m.contactTitle || 'Contact'}</h1>
            <p>{m.contactDescription || 'Located on the ASU Polytechnic Campus in Mesa, Arizona.'}</p>
          </div>
        </div>
      </Editable>

      <section className="section">
        <div className="container">
          <div className="contact-grid">
            {/* Left: info */}
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1.5rem' }}>Contact Information</h2>
              <Editable label="Contact Info" content={<ContactInfoDrawer />}>
                <div>
                  <div className="contact-info-block">
                    <div className="contact-icon"><Building2 size={18} /></div>
                    <div>
                      <h4>Director's Office</h4>
                      <p>{contact.directorOffice}</p>
                      {contact.directorPhone && <p style={{ marginTop: 4 }}><Phone size={12} style={{ display: 'inline', marginRight: 4 }} />{contact.directorPhone}</p>}
                    </div>
                  </div>
                  <div className="contact-info-block">
                    <div className="contact-icon"><MapPin size={18} /></div>
                    <div>
                      <h4>RISE Lab</h4>
                      <p>{contact.labLocation}</p>
                    </div>
                  </div>
                </div>
              </Editable>

              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginTop: '2.5rem', marginBottom: '1.25rem' }}>Lab Resources</h2>
              <Editable label="Lab Resources" content={<ResourcesDrawer />}>
                <div className="resource-list">
                  {contact.resources?.map((res, i) => (
                    <div key={i} className="resource-item">
                      <div className="resource-title">{res.title}</div>
                      <p className="resource-desc">{res.description}</p>
                      {res.url && (
                        <a href={res.url} target="_blank" rel="noreferrer"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--color-accent)', fontSize: '0.82rem', marginTop: 6 }}>
                          Visit page <ExternalLink size={11} />
                        </a>
                      )}
                    </div>
                  ))}
                  {!contact.resources?.length && (
                    <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.9rem' }}>No resources yet. Click "Edit Lab Resources" to add.</p>
                  )}
                </div>
              </Editable>
            </div>

            {/* Right: map — now editable */}
            <div className="contact-map">
              <Editable label="Map Location" content={<MapDrawer />} position="top-right">
                <div>
                  <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1.5rem' }}>Location</h2>
                  {contact.mapsEmbed ? (
                    <iframe
                      src={contact.mapsEmbed}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="RISE Lab Location"
                    />
                  ) : (
                    <div style={{ background: 'var(--color-surface-2)', borderRadius: 'var(--r-lg)', height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed var(--color-border)' }}>
                      <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                        <MapPin size={32} style={{ marginBottom: '0.5rem', opacity: 0.5 }} />
                        <p style={{ fontSize: '0.9rem' }}>No map embed yet</p>
                        <p style={{ fontSize: '0.8rem' }}>Click "Edit Map Location" to add</p>
                      </div>
                    </div>
                  )}
                </div>
              </Editable>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

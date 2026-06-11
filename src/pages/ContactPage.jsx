import React from 'react';
import { MapPin, Phone, Building2, ExternalLink } from 'lucide-react';

export default function ContactPage({ data }) {
  const contact = data?.contact;
  if (!contact) return null;

  return (
    <div className="page-wrapper">
      <div className="page-hero">
        <div className="container">
          <span className="section-eyebrow">Find Us</span>
          <h1>Contact</h1>
          <p>Located on the ASU Polytechnic Campus in Mesa, Arizona.</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="contact-grid">
            {/* Left: info */}
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1.5rem' }}>Contact Information</h2>

              <div className="contact-info-block">
                <div className="contact-icon"><Building2 size={18} /></div>
                <div>
                  <h4>Dr. Zhang's Office</h4>
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

              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '1rem', lineHeight: 1.6 }}>
                For visitors from Tempe campus: You can take the{' '}
                <a href="https://cfo.asu.edu/gold-route" target="_blank" rel="noreferrer"
                  style={{ color: 'var(--color-gold)' }}>Gold route</a>{' '}
                of the ASU campus shuttle (free for ASU faculty and students).
              </p>

              {/* Resources */}
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginTop: '2.5rem', marginBottom: '1.25rem' }}>Lab Resources</h2>
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
              </div>
            </div>

            {/* Right: map */}
            <div className="contact-map">
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1.5rem' }}>Location</h2>
              <iframe
                src={contact.mapsEmbed}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="RISE Lab Location"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

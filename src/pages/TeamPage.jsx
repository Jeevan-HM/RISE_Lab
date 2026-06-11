import React, { useState } from 'react';
import { Mail, Link2, Globe } from 'lucide-react';

function MemberCard({ member, folder = 'teampic' }) {
  return (
    <div className="team-card animate-fade-up">
      <img
        className="team-avatar"
        src={`${import.meta.env.BASE_URL}images/${folder}/${member.photo}`}
        alt={member.name}
        onError={e => { e.target.src = `${import.meta.env.BASE_URL}images/teampic/sundevil.jpg`; }}
      />
      <div className="team-name">{member.name}</div>
      {member.info && <div className="team-info">{member.info}</div>}
      <div className="team-links">
        {member.email && (
          <a className="team-link" href={`mailto:${member.email}`} title="Email">
            <Mail size={12} />
          </a>
        )}
        {member.links?.map((l, i) => {
          const isLinkedIn = l.label?.toLowerCase().includes('linkedin');
          const isWebsite = l.label?.toLowerCase().includes('website');
          return (
            <a key={i} className="team-link" href={l.url} target="_blank" rel="noreferrer">
              {isLinkedIn ? <Link2 size={12} /> : isWebsite ? <Globe size={12} /> : null}
              {l.label}
            </a>
          );
        })}
      </div>
    </div>
  );
}

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
          <button key={t.id} className={`alumni-tab${tab === t.id ? ' active' : ''}`}
            onClick={() => setTab(t.id)}>
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

export default function TeamPage({ data }) {
  const [view, setView] = useState('current');

  return (
    <div className="page-wrapper">
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
            <div className="tabs">
              <button className={`tab-btn${view === 'current' ? ' active' : ''}`} onClick={() => setView('current')}>Current Members</button>
              <button className={`tab-btn${view === 'alumni' ? ' active' : ''}`} onClick={() => setView('alumni')}>Alumni</button>
            </div>
          </div>

          {view === 'current' && (
            <div>
              {/* Director */}
              {data?.director && (
                <div style={{ marginBottom: 'var(--space-2xl)' }}>
                  <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.1em' }}>Lab Director</h2>
                  <div className="director-card">
                    <img
                      className="director-avatar"
                      src={`${import.meta.env.BASE_URL}images/teampic/${data.director.photo}`}
                      alt={data.director.name}
                      onError={e => { e.target.src = `${import.meta.env.BASE_URL}images/teampic/sundevil.jpg`; }}
                    />
                    <div>
                      <p className="director-title">{data.director.title}</p>
                      <h2 className="director-name">Dr. {data.director.name}</h2>
                      <p className="director-affil">{data.director.affiliation}</p>
                      <p className="director-bio">{data.director.bio}</p>
                      <div style={{ marginTop: '1.25rem' }}>
                        <a href={`mailto:${data.director.email}`} className="team-link">
                          <Mail size={13} /> {data.director.email}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* PhD Students */}
              {data?.docStudents?.length > 0 && (
                <div style={{ marginBottom: 'var(--space-2xl)' }}>
                  <h2 style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    PhD Students <span style={{ color: 'var(--color-gold)' }}>({data.docStudents.length})</span>
                  </h2>
                  <div className="grid-4 stagger-children">
                    {data.docStudents.map((m, i) => <MemberCard key={i} member={m} />)}
                  </div>
                </div>
              )}

              {/* MS Students */}
              {data?.msStudents?.length > 0 && (
                <div style={{ marginBottom: 'var(--space-2xl)' }}>
                  <h2 style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    MS Students <span style={{ color: 'var(--color-gold)' }}>({data.msStudents.length})</span>
                  </h2>
                  <div className="grid-4 stagger-children">
                    {data.msStudents.map((m, i) => <MemberCard key={i} member={m} />)}
                  </div>
                </div>
              )}

              {/* BS/Undergrad Students */}
              {data?.bsStudents?.length > 0 && (
                <div style={{ marginBottom: 'var(--space-2xl)' }}>
                  <h2 style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    Undergraduate Students <span style={{ color: 'var(--color-gold)' }}>({data.bsStudents.length})</span>
                  </h2>
                  <div className="grid-4 stagger-children">
                    {data.bsStudents.map((m, i) => <MemberCard key={i} member={m} />)}
                  </div>
                </div>
              )}
            </div>
          )}

          {view === 'alumni' && <AlumniSection data={data} />}
        </div>
      </section>
    </div>
  );
}

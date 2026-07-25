import { useState } from 'react';
import { Mail, Link2, Globe } from 'lucide-react';
import { resolveImagePath } from '../lib/images';

// ── Section label pill ───────────────────────────────────────
function SectionLabel({ label, count }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
        background: 'linear-gradient(135deg, var(--color-maroon-soft), var(--color-gold-soft))',
        border: '1px solid var(--color-border-hover)',
        borderRadius: 'var(--r-full)',
        padding: '5px 14px',
        fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em',
        textTransform: 'uppercase', color: 'var(--color-maroon)',
      }}>
        {label}
        {count > 0 && (
          <span style={{
            background: 'var(--color-gold)', color: '#fff',
            borderRadius: 'var(--r-full)', padding: '1px 7px',
            fontSize: '0.68rem', fontWeight: 800, marginLeft: 2,
          }}>
            {count}
          </span>
        )}
      </div>
      <div style={{ flex: 1, height: 1, background: 'var(--color-border)' }} />
    </div>
  );
}

function MemberCard({ member, folder = 'teampic' }) {
  return (
    <div className="team-card animate-fade-up">
      <img
        className="team-avatar"
        src={resolveImagePath(member.photo, folder) || `${import.meta.env.BASE_URL}images/teampic/sundevil.jpg`}
        alt={member.name}
        onError={e => { e.target.src = `${import.meta.env.BASE_URL}images/teampic/sundevil.jpg`; }}
      />
      <div className="team-name">{member.name}</div>
      {member.info && <div className="team-info">{member.info}</div>}
      <div className="team-links">
        {member.email && (
          <a className="team-link" href={`mailto:${member.email}`} title="Email" aria-label={`Email ${member.name}`}>
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
    { id: 'phd', label: 'PhD Alumni',          count: data?.alumniPhd?.length },
    { id: 'msc', label: 'MS Alumni',           count: data?.alumniMsc?.length },
    { id: 'bs',  label: 'BS/Undergrad Alumni', count: data?.alumniBS?.length  },
    { id: 'nri', label: 'Research Visitors',   count: data?.alumniNri?.length },
  ];

  const getList = () => {
    switch (tab) {
      case 'phd': return data?.alumniPhd || [];
      case 'msc': return data?.alumniMsc || [];
      case 'bs':  return data?.alumniBS  || [];
      case 'nri': return data?.alumniNri || [];
      default:    return [];
    }
  };

  return (
    <div>
      <div className="alumni-tabs">
        {tabs.map(t => (
          <button key={t.id} className={`alumni-tab${tab === t.id ? ' active' : ''}`}
            onClick={() => setTab(t.id)}>
            {t.label}{t.count ? <span style={{ opacity: 0.6, fontSize: '0.78rem', marginLeft: 4 }}>({t.count})</span> : null}
          </button>
        ))}
      </div>
      <div className="grid-4 stagger-children">
        {getList().map((a, i) => (
          <div key={i} className="team-card animate-fade-up">
            <img
              className="team-avatar"
              src={resolveImagePath(a.photo, 'teampic') || `${import.meta.env.BASE_URL}images/teampic/sundevil.jpg`}
              alt={a.name}
              onError={e => { e.target.src = `${import.meta.env.BASE_URL}images/teampic/sundevil.jpg`; }}
            />
            {tab === 'phd' && (
              <>
                <div className="team-name">{a.name}</div>
                {a.graduated && <div className="team-info">Class of {a.graduated}</div>}
                {a.job && <div className="alumni-job">↗ {a.job}</div>}
                {a.thesis && <div className="alumni-thesis">"{a.thesis}"</div>}
              </>
            )}
            {(tab === 'msc' || tab === 'bs') && (
              <>
                <div className="team-name">{a.name}</div>
                {a.note && <div className="team-info">{a.note}</div>}
              </>
            )}
            {tab === 'nri' && (
              <>
                <div className="team-name">{a.name}</div>
                {a.note && <div className="team-info">{a.note}</div>}
                {a.title && <div className="alumni-note">{a.title}</div>}
              </>
            )}
            {(a.email || a.links?.length > 0) && (
              <div className="team-links">
                {a.email && (
                  <a className="team-link" href={`mailto:${a.email}`} title="Email" aria-label={`Email ${a.name}`}>
                    <Mail size={12} />
                  </a>
                )}
                {a.links?.map((l, i) => {
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
            )}
          </div>
        ))}
      </div>
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
                <div style={{ marginBottom: 'var(--space-2xl)' }} className="reveal">
                  <SectionLabel label="Lab Director" count={0} />
                  <div className="director-card animate-fade-up">
                    <img
                      className="director-avatar"
                      src={resolveImagePath(data.director.photo, 'teampic') || `${import.meta.env.BASE_URL}images/teampic/sundevil.jpg`}
                      alt={data.director.name}
                      onError={e => { e.target.src = `${import.meta.env.BASE_URL}images/teampic/sundevil.jpg`; }}
                    />
                    <div>
                      <p className="director-title">{data.director.title}</p>
                      <h2 className="director-name">Dr. {data.director.name}</h2>
                      <p className="director-affil">{data.director.affiliation}</p>
                      <p className="director-bio">{data.director.bio}</p>
                      <div style={{ marginTop: '1.25rem', display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
                        <a href={`mailto:${data.director.email}`} className="team-link">
                          <Mail size={13} /> {data.director.email}
                        </a>
                        {data.director.links?.map((l, i) => {
                          const isLinkedIn = l.label?.toLowerCase().includes('linkedin');
                          const isWebsite = l.label?.toLowerCase().includes('website');
                          return (
                            <a key={i} className="team-link" href={l.url} target="_blank" rel="noreferrer">
                              {isLinkedIn ? <Link2 size={13} /> : isWebsite ? <Globe size={13} /> : null}
                              {l.label}
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Post-Doctoral Researchers */}
              {data?.postdocStudents?.length > 0 && (
                <div style={{ marginBottom: 'var(--space-2xl)' }} className="reveal">
                  <SectionLabel label="Post-Doctoral Researchers" count={data.postdocStudents.length} />
                  <div className="grid-4 stagger-children">
                    {data.postdocStudents.map((m, i) => <MemberCard key={i} member={m} />)}
                  </div>
                </div>
              )}

              {/* PhD Students */}
              {data?.docStudents?.length > 0 && (
                <div style={{ marginBottom: 'var(--space-2xl)' }} className="reveal">
                  <SectionLabel label="PhD Students" count={data.docStudents.length} />
                  <div className="grid-4 stagger-children">
                    {data.docStudents.map((m, i) => <MemberCard key={i} member={m} />)}
                  </div>
                </div>
              )}

              {/* MS Students */}
              {data?.msStudents?.length > 0 && (
                <div style={{ marginBottom: 'var(--space-2xl)' }} className="reveal">
                  <SectionLabel label="MS Students" count={data.msStudents.length} />
                  <div className="grid-4 stagger-children">
                    {data.msStudents.map((m, i) => <MemberCard key={i} member={m} />)}
                  </div>
                </div>
              )}

              {/* BS/Undergrad Students */}
              {data?.bsStudents?.length > 0 && (
                <div style={{ marginBottom: 'var(--space-2xl)' }} className="reveal">
                  <SectionLabel label="Undergraduate Students" count={data.bsStudents.length} />
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

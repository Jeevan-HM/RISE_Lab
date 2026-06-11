import React, { useState } from 'react';
import { ChevronDown, ExternalLink, Navigation2, Layers, HeartHandshake, FlaskConical } from 'lucide-react';

const ICON_MAP = {
  'aerial-robotics':          Navigation2,    // GPS/nav icon for UAV autonomy
  'soft-robotics':            Layers,          // layered flexible actuators
  'human-robot-interaction':  HeartHandshake,  // human ↔ robot trust & collaboration
};


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
              <img src={`/images/${project.image}`} alt={project.title}
                style={{ width: '100%', borderRadius: 'var(--r-md)', objectFit: 'cover', maxHeight: 240 }} />
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ResearchPage({ data }) {
  const areas = data?.researchAreas || [];
  const [active, setActive] = useState(0);
  const area = areas[active];

  const funders = [
    { name: 'NSF', src: '/images/logopic/NSF_logo.svg' },
    { name: 'AFOSR', src: '/images/logopic/AFOSR.png' },
    { name: 'ONR', src: '/images/logopic/ONR.png' },
    { name: 'NASA', src: '/images/logopic/NASA_seal.svg' },
    { name: 'SFAz', src: '/images/logopic/sfaz.png' },
    { name: 'ADHS', src: '/images/logopic/ADHS-ABRC-full-v_3cc.png' },
    { name: 'Honeywell', src: '/images/logopic/Honeywell_logo.svg' },
    { name: 'NGC', src: '/images/logopic/ngc.svg' },
  ];

  return (
    <div className="page-wrapper">
      {/* Page hero */}
      <div className="page-hero">
        <div className="container">
          <span className="section-eyebrow">Our Work</span>
          <h1>Research</h1>
          <p>{data?.meta?.description}</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          {/* Tabs */}
          <div className="tabs">
            {areas.map((a, i) => (
              <button key={i} className={`tab-btn${active === i ? ' active' : ''}`}
                onClick={() => setActive(i)}>
                {a.title}
              </button>
            ))}
          </div>

          {area && (
            <div className="animate-fade-in">
              {/* Overview */}
              <div className="research-overview">
                <div>
                  <span className="section-eyebrow">{area.title}</span>
                  <h2 style={{ fontSize: '2rem', marginTop: '0.5rem', marginBottom: '1rem' }}>{area.title}</h2>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>{area.overview}</p>
                </div>
                {area.image && (
                  <img src={`/images/${area.image}`} alt={area.title}
                    onError={e => { e.target.style.display = 'none'; }} />
                )}
              </div>

              {/* Projects */}
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1rem' }}>Projects</h3>
              <div className="project-accordion">
                {area.projects?.map((proj, i) => <ProjectItem key={i} project={proj} />)}
              </div>
            </div>
          )}

          {/* Funders */}
          <div className="funders-strip">
            {funders.map(f => (
              <img key={f.name} className="funder-logo" src={f.src} alt={f.name}
                onError={e => { e.target.style.display = 'none'; }} />
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

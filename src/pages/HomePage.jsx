import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft, ChevronRight, ArrowRight,
  // Aerial robotics: compass/navigation for UAV autonomy
  Navigation2,
  // Soft robotics: layered flexible materials
  Layers,
  // Human-Robot Interaction: handshake between human & machine
  HeartHandshake,
  // Stats icons — specific to a robotics lab
  GraduationCap, BookOpen, Trophy, FlaskConical,
  // News & Socials
  Megaphone
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Map research area IDs → specific icons
const ICON_MAP = {
  'aerial-robotics':     Navigation2,  // UAV / autonomous navigation
  'soft-robotics':       Layers,        // layered soft actuators
  'human-robot-interaction': HeartHandshake, // human ↔ robot
};

function Carousel({ images }) {
  const [idx, setIdx] = useState(0);
  const timerRef = useRef(null);
  const next = () => setIdx(i => (i + 1) % images.length);
  const prev = () => setIdx(i => (i - 1 + images.length) % images.length);
  useEffect(() => {
    timerRef.current = setInterval(next, 5000);
    return () => clearInterval(timerRef.current);
  }, [images.length]);
  const resetTimer = () => { clearInterval(timerRef.current); timerRef.current = setInterval(next, 5000); };
  if (!images?.length) return null;
  return (
    <div className="carousel-wrapper">
      {images.map((img, i) => (
        <div key={i} className={`carousel-slide${i === idx ? ' active' : ''}`}>
          <img src={`/images/slide/${img}`} alt={`Lab photo ${i + 1}`} loading={i === 0 ? 'eager' : 'lazy'} />
        </div>
      ))}
      <button className="carousel-arrow prev" onClick={() => { prev(); resetTimer(); }} aria-label="Previous"><ChevronLeft size={18} /></button>
      <button className="carousel-arrow next" onClick={() => { next(); resetTimer(); }} aria-label="Next"><ChevronRight size={18} /></button>
      <div className="carousel-controls">
        {images.map((_, i) => (
          <button key={i} className={`carousel-dot${i === idx ? ' active' : ''}`}
            onClick={() => { setIdx(i); resetTimer(); }} aria-label={`Slide ${i + 1}`} />
        ))}
      </div>
    </div>
  );
}

export default function HomePage({ data }) {
  if (!data) return (
    <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <div className="badge">Loading…</div>
    </div>
  );

  const recentNews = (data.news || []).slice(0, 5);
  const areas = data.researchAreas || [];
  const totalStudents = (data.docStudents?.length || 0) + (data.msStudents?.length || 0) + (data.bsStudents?.length || 0);
  const totalPubs = (data.journalPubs?.length || 0) + (data.confPubs?.length || 0);

  return (
    <div className="page-wrapper">

      {/* ── HERO & NEWS SIDEBAR ── */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="container hero-layout">
          
          {/* Left Column: Welcome & Carousel */}
          <div className="hero-content animate-fade-up" style={{ maxWidth: '100%' }}>
            <span className="section-eyebrow">Arizona State University · Polytechnic Campus</span>
            <h1 style={{ marginBottom: '1.5rem', fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>
              Welcome to the <span className="gradient-text">{data.meta?.labFullName || 'RISE Lab'}</span>
            </h1>
            <p style={{ maxWidth: '100%', marginBottom: '2rem' }}>{data.meta?.shortDescription}</p>
            <div className="hero-actions" style={{ marginBottom: '3rem' }}>
              <Link to="/research" className="btn btn-primary">
                Explore Research <ArrowRight size={15} />
              </Link>
              <Link to="/team" className="btn btn-secondary">Meet the Team</Link>
            </div>
            
            <div className="animate-fade-in" style={{ animationDelay: '0.15s' }}>
              <Carousel images={data.homeCarouselImages} />
            </div>
          </div>

          {/* Right Column: News Sidebar */}
          <div className="news-sidebar animate-fade-up" style={{ animationDelay: '0.25s' }}>
            <div className="glass" style={{ padding: '2rem', background: 'var(--color-surface-2)', border: 'none', borderRadius: 'var(--r-xl)' }}>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>
                News
              </h3>
              <div className="news-list-sidebar" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {recentNews.map((item, i) => (
                  <div key={i} className="news-item-sidebar">
                    <div className="news-date" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.3rem' }}>{item.date}</div>
                    <p className="news-headline" style={{ fontSize: '0.95rem', lineHeight: 1.5, margin: 0 }} dangerouslySetInnerHTML={{ __html: item.headline }} />
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
                <Link to="/news" style={{ color: 'var(--color-maroon)', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none' }}>... see all News</Link>
              </div>
            </div>

            {/* Social Links under News */}
            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap', padding: '0 1rem' }}>
              <a href="#" className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.85rem', display: 'flex', gap: '6px', alignItems: 'center' }}>
                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                Follow @x
              </a>
              <a href="#" className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.85rem', display: 'flex', gap: '6px', alignItems: 'center', color: '#ff0000' }}>
                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.016 3.016 0 0 0-2.122 2.136C0 8.07 0 12 0 12s0 3.93.501 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.55 9.377.55 9.377.55s7.505 0 9.377-.55a3.016 3.016 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                YouTube
              </a>
              <a href="#" className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.85rem', display: 'flex', gap: '6px', alignItems: 'center', color: '#0077b5' }}>
                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                LinkedIn
              </a>
              <a href="#" className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.85rem', display: 'flex', gap: '6px', alignItems: 'center' }}>
                <GraduationCap size={14} /> Scholar
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* ── STATS ── */}
      <div className="container">
        <div className="stats-bar animate-fade-up" style={{ animationDelay: '0.25s' }}>
          {[
            { icon: <GraduationCap size={22} className="stat-icon" />, value: `${totalStudents}+`, label: 'Active Students' },
            { icon: <BookOpen       size={22} className="stat-icon" />, value: `${totalPubs}+`,     label: 'Publications' },
            { icon: <Trophy         size={22} className="stat-icon" />, value: data.alumniPhd?.length || 0, label: 'PhD Graduates' },
            { icon: <FlaskConical   size={22} className="stat-icon" />, value: data.researchAreas?.length || 3, label: 'Research Areas' },
          ].map((s, i) => (
            <div key={i} className="stat-item">
              {s.icon}
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── RESEARCH AREAS ── */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">What We Do</span>
            <h2>Research Areas</h2>
            <p>Integrating soft robot structures with novel learning and control algorithms for safe, efficient human–robot collaboration.</p>
          </div>
          <div className="grid-3 stagger-children">
            {areas.map((area, i) => {
              const IconComp = ICON_MAP[area.id] || FlaskConical;
              return (
                <div key={i} className="card glass-lift animate-fade-up">
                  <div className="card-icon"><IconComp size={24} /></div>
                  <h3>{area.title}</h3>
                  <p>{area.overview?.substring(0, 165)}…</p>
                  <div style={{ marginTop: '1.25rem' }}>
                    <Link to={`/research#${area.id}`} className="btn btn-ghost">
                      View Projects <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>



      {/* ── DIRECTOR ── */}
      {data.director && (
        <section className="section">
          <div className="container">
            <div className="section-header">
              <span className="section-eyebrow">Principal Investigator</span>
              <h2>Lab Director</h2>
            </div>
            <div className="director-card animate-fade-up">
              <img
                className="director-avatar"
                src={`/images/teampic/${data.director.photo}`}
                alt={data.director.name}
                onError={e => { e.target.src = '/images/teampic/sundevil.jpg'; }}
              />
              <div>
                <p className="director-title">{data.director.title}</p>
                <h2 className="director-name">Dr. {data.director.name}</h2>
                <p className="director-affil">{data.director.affiliation}</p>
                <p className="director-bio">{data.director.bio}</p>
                <div style={{ marginTop: '1.25rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <a href={`mailto:${data.director.email}`} className="btn btn-secondary" style={{ fontSize: '0.84rem', padding: '7px 15px' }}>
                    ✉ {data.director.email}
                  </a>
                  <Link to="/team" className="btn btn-ghost">Meet the full team <ArrowRight size={13} /></Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

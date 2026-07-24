import { useState, useEffect, useRef, useCallback } from 'react';
import {
  ChevronLeft, ChevronRight, ArrowRight,
  Navigation2, Layers, HeartHandshake,
  BookOpen, Trophy, FlaskConical
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ICON_MAP = {
  'aerial-robotics': Navigation2,
  'soft-robotics': Layers,
  'human-robot-interaction': HeartHandshake,
};

function Carousel({ images: imagesProp }) {
  const images = imagesProp || [];
  const count = images.length;
  const [idx, setIdx] = useState(0);
  const timerRef = useRef(null);
  const next = useCallback(() => setIdx(i => (i + 1) % count), [count]);
  const prev = useCallback(() => setIdx(i => (i - 1 + count) % count), [count]);
  useEffect(() => {
    if (!count) return;
    timerRef.current = setInterval(next, 5000);
    return () => clearInterval(timerRef.current);
  }, [count, next]);
  const resetTimer = () => { clearInterval(timerRef.current); timerRef.current = setInterval(next, 5000); };
  if (!count) return null;
  return (
    <div className="carousel-wrapper">
      {images.map((img, i) => (
        <div key={i} className={`carousel-slide${i === idx ? ' active' : ''}`}>
          <img src={`${import.meta.env.BASE_URL}images/slide/${img}`} alt={`Lab photo ${i + 1}`} loading={i === 0 ? 'eager' : 'lazy'} />
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

export function HeroBlock({ data }) {
  const recentNews = (data.news || []).slice(0, 5);
  return (
    <section className="hero">
      <div className="hero-bg" />
      <div className="container hero-layout">
        <div className="hero-content animate-fade-up" style={{ maxWidth: '100%' }}>
          <span className="section-eyebrow">Arizona State University · Polytechnic Campus</span>
          <h1 style={{ marginBottom: '1.5rem', fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>
            Welcome to the <span className="gradient-text">{data.meta?.labFullName || 'RISE Lab'}</span>
          </h1>
          <p style={{ maxWidth: '100%', marginBottom: '2rem' }}>{data.meta?.shortDescription}</p>
          <div className="hero-actions" style={{ marginBottom: '3rem' }}>
            {(data.heroButtons || [
              { label: 'Explore Research', link: '/research', style: 'primary' },
              { label: 'Meet the Team', link: '/team', style: 'secondary' }
            ]).map((btn, i) => (
              <Link key={i} to={btn.link} className={`btn btn-${btn.style}`}>
                {btn.label} {btn.style === 'primary' && <ArrowRight size={15} />}
              </Link>
            ))}
          </div>
          <div className="animate-fade-in" style={{ animationDelay: '0.15s' }}>
            <Carousel images={data.homeCarouselImages} />
          </div>
        </div>
        <div className="news-sidebar animate-fade-up reveal" style={{ animationDelay: '0.25s' }}>
          <div className="glass" style={{ padding: '2rem', background: 'var(--color-surface-2)', border: 'none', borderRadius: 'var(--r-xl)' }}>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>
              Latest News
            </h3>
            <div className="news-list-sidebar" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {recentNews.map((item, i) => (
                <div key={i} className="news-item-sidebar" style={{ paddingLeft: '0.75rem', borderLeft: '2px solid var(--color-gold)' }}>
                  <div className="news-date" style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.3rem' }}>{item.date}</div>
                  <p className="news-headline" style={{ fontSize: '0.93rem', lineHeight: 1.55, margin: 0 }} dangerouslySetInnerHTML={{ __html: item.headline }} />
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

export function StatsBlock({ data }) {
  const totalStudents = (data.docStudents?.length || 0) + (data.msStudents?.length || 0) + (data.bsStudents?.length || 0);
  const totalPubs = (data.journalPubs?.length || 0) + (data.confPubs?.length || 0);
  const stats = [
    { icon: <BookOpen size={22} className="stat-icon" />, value: `${totalStudents}+`, label: 'Active Students' },
    { icon: <BookOpen   size={22} className="stat-icon" />, value: `${totalPubs}+`,     label: 'Publications' },
    { icon: <Trophy     size={22} className="stat-icon" />, value: data.alumniPhd?.length || 0, label: 'PhD Graduates' },
    { icon: <FlaskConical size={22} className="stat-icon" />, value: data.researchAreas?.length || 3, label: 'Research Areas' },
  ];
  return (
    <div className="container" style={{ margin: '3rem auto' }}>
      <div className="stats-bar reveal animate-fade-up">
        {stats.map((s, i) => (
          <div key={i} className="stat-item">
            {s.icon}
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ResearchAreasBlock({ data }) {
  const areas = data.researchAreas || [];
  return (
    <section className="section">
      <div className="container">
        <div className="section-header reveal">
          <span className="section-eyebrow">What We Do</span>
          <h2>Research Areas</h2>
          <p>Integrating soft robot structures with novel learning and control algorithms for safe, efficient human–robot collaboration.</p>
        </div>
        <div className="grid-3 stagger-children">
          {areas.map((area, i) => {
            const IconComp = ICON_MAP[area.id] || FlaskConical;
            return (
              <div key={i} className="card glass-lift animate-fade-up reveal">
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
  );
}

export function DirectorBlock({ data }) {
  if (!data.director) return null;
  return (
    <section className="section">
      <div className="container">
        <div className="section-header">
          <span className="section-eyebrow">Principal Investigator</span>
          <h2>Lab Director</h2>
        </div>
        <div className="director-card animate-fade-up">
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
  );
}

export function CustomBlock({ block }) {
  if (!block) return null;
  
  // Custom blocks can contain text, image, and buttons.
  return (
    <section className="section" style={{ background: 'var(--color-surface-2)' }}>
      <div className="container">
        <div className="section-header">
          {block.title && <h2>{block.title}</h2>}
        </div>
        
        {block.image && (
          <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
            <img 
              src={block.image.startsWith('http') ? block.image : `${import.meta.env.BASE_URL}images/${block.image}`} 
              alt={block.title || 'Custom block image'}
              style={{ maxWidth: '100%', borderRadius: 'var(--r-md)' }} 
            />
          </div>
        )}

        {block.content && (
          <div className="custom-section-content" style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6, marginBottom: block.buttons?.length ? '2rem' : '0' }}>
            {block.content}
          </div>
        )}

        {block.buttons?.length > 0 && (
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {block.buttons.map((btn, i) => (
              <Link key={i} to={btn.link || '/'} className={`btn btn-${btn.style || 'primary'}`}>
                {btn.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default function HomePage({ data }) {
  if (!data) return (
    <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <div className="badge">Loading…</div>
    </div>
  );

  const defaultLayout = [
    { id: 'hero', type: 'hero' },
    { id: 'stats', type: 'stats' },
    { id: 'researchAreas', type: 'researchAreas' },
    { id: 'director', type: 'director' }
  ];

  const layout = data.homeLayout || defaultLayout;

  return (
    <div className="page-wrapper">
      {layout.map((block) => {
        switch (block.type) {
          case 'hero': return <HeroBlock key={block.id} data={data} />;
          case 'stats': return <StatsBlock key={block.id} data={data} />;
          case 'researchAreas': return <ResearchAreasBlock key={block.id} data={data} />;
          case 'director': return <DirectorBlock key={block.id} data={data} />;
          case 'custom': return <CustomBlock key={block.id} block={block} />;
          case 'custom-heading': return (
            <div key={block.id} className="section" style={{ padding: '3rem 0' }}>
              <div className="container" style={{ textAlign: block.align || 'center' }}>
                <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', marginBottom: block.subheading ? '0.75rem' : 0 }}>
                  {block.heading || 'Section Heading'}
                </h2>
                {block.subheading && <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>{block.subheading}</p>}
              </div>
            </div>
          );
          case 'custom-text': return (
            <div key={block.id} className="section" style={{ background: 'var(--color-surface-2)' }}>
              <div className="container">
                <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.8, fontSize: '1.05rem', color: 'var(--text-secondary)', maxWidth: '760px', margin: '0 auto' }}>
                  {block.content}
                </div>
                {block.buttons?.length > 0 && (
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1.5rem', justifyContent: 'center' }}>
                    {block.buttons.map((btn, i) => (
                      <Link key={i} to={btn.link} className={`btn btn-${btn.style || 'primary'}`}>{btn.label}</Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
          case 'custom-image': return (
            <div key={block.id} className="section" style={{ padding: '3rem 0' }}>
              <div className="container" style={{ textAlign: 'center' }}>
                <img
                  src={block.image?.startsWith('http') ? block.image : `${import.meta.env.BASE_URL}images/${block.image || 'placeholder.jpg'}`}
                  alt={block.caption || ''}
                  style={{
                    maxWidth: block.size === 'small' ? '40%' : block.size === 'medium' ? '60%' : block.size === 'wide' ? '90%' : '100%',
                    borderRadius: 'var(--r-md)', display: 'block', margin: '0 auto'
                  }}
                />
                {block.caption && <p style={{ marginTop: '0.75rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>{block.caption}</p>}
              </div>
            </div>
          );
          case 'custom-buttons': return (
            <div key={block.id} className="section" style={{ padding: '2.5rem 0', background: 'var(--color-surface-2)' }}>
              <div className="container" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                {(block.buttons || []).map((btn, i) => (
                  <Link key={i} to={btn.link} className={`btn btn-${btn.style || 'primary'}`} style={{ fontSize: '1rem', padding: '0.75rem 2rem' }}>{btn.label}</Link>
                ))}
              </div>
            </div>
          );
          case 'custom-callout': {
            const calloutColors = {
              info: { bg: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.4)', color: '#60a5fa' },
              warning: { bg: 'rgba(200,146,42,0.12)', border: 'var(--color-gold)', color: 'var(--color-gold)' },
              success: { bg: 'rgba(34,197,94,0.12)', border: 'rgba(34,197,94,0.4)', color: '#4ade80' },
              maroon: { bg: 'rgba(140,29,64,0.12)', border: 'var(--color-maroon)', color: 'var(--color-maroon)' },
            };
            const cc = calloutColors[block.calloutStyle || 'info'];
            return (
              <div key={block.id} className="section" style={{ padding: '3rem 0' }}>
                <div className="container">
                  <div style={{ background: cc.bg, border: `2px solid ${cc.border}`, borderRadius: 'var(--r-lg)', padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
                    {block.title && <h3 style={{ color: cc.color, marginBottom: '0.75rem' }}>{block.title}</h3>}
                    <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>{block.content}</p>
                  </div>
                </div>
              </div>
            );
          }
          case 'custom-divider': return (
            <div key={block.id} style={{ padding: '2rem 0' }}>
              <div className="container">
                <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)' }} />
              </div>
            </div>
          );
          default: return null;
        }
      })}
    </div>
  );
}

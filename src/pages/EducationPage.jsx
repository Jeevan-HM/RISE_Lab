import React from 'react';
import { ExternalLink } from 'lucide-react';

export default function EducationPage({ data }) {
  const courses = data?.courses || [];
  const outreach = data?.outreach;

  return (
    <div className="page-wrapper">
      <div className="page-hero">
        <div className="container">
          <span className="section-eyebrow">Teaching & Engagement</span>
          <h1>Education & Outreach</h1>
          <p>Our commitment to education extends beyond the lab through innovative courses and community engagement.</p>
        </div>
      </div>

      {/* Courses */}
      <section className="section">
        <div className="container">
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
          </div>
        </div>
      </section>

      {/* Outreach */}
      {outreach && (
        <section className="section" style={{ background: 'var(--color-surface)', borderTop: '1px solid var(--color-border)' }}>
          <div className="container">
            <div className="section-header">
              <span className="section-eyebrow">Community Engagement</span>
              <h2>Outreach</h2>
              <p>{outreach.description}</p>
            </div>
            <div className="grid-2">
              {outreach.events?.map((event, i) => (
                <div key={i} className="outreach-card animate-fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
                  {event.image && (
                    <img src={`${import.meta.env.BASE_URL}images/${event.image}`} alt={event.name}
                      onError={e => { e.target.style.display = 'none'; }} />
                  )}
                  <div className="outreach-body">
                    {event.logo && (
                      <img src={`${import.meta.env.BASE_URL}images/${event.logo}`} alt={event.name}
                        style={{ height: 48, width: 'auto', objectFit: 'contain', marginBottom: '1rem', filter: 'brightness(0.85)' }}
                        onError={e => { e.target.style.display = 'none'; }} />
                    )}
                    <div className="outreach-name">{event.name}</div>
                    <p className="outreach-desc">{event.description}</p>
                    <a className="btn btn-ghost" href={event.url} target="_blank" rel="noreferrer">
                      Learn More <ExternalLink size={13} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

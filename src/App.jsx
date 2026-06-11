import React, { useEffect, useState, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, ChevronUp, Sun, Moon } from 'lucide-react';

import './index.css';
import HomePage from './pages/HomePage';
import ResearchPage from './pages/ResearchPage';
import TeamPage from './pages/TeamPage';
import PublicationsPage from './pages/PublicationsPage';
import EducationPage from './pages/EducationPage';
import ContactPage from './pages/ContactPage';
import AdminPage from './pages/AdminPage';

// ── Navbar ─────────────────────────────────────────────────
function Navbar({ labName, theme, toggleTheme }) {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  if (location.pathname.startsWith('/admin')) return null;

  const links = [
    { to: '/', label: 'Home', exact: true },
    { to: '/research', label: 'Research' },
    { to: '/team', label: 'Team' },
    { to: '/publications', label: 'Publications' },
    { to: '/education', label: 'Education' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <nav className="navbar" style={{ boxShadow: scrolled ? '0 4px 24px rgba(0,0,0,0.4)' : 'none' }}>
      <div className="container">
        <Link to="/" className="nav-brand">
          <span>RISE</span>
          <span className="nav-brand-accent">Lab</span>
        </Link>

        {/* Desktop links */}
        <div className="nav-links" style={{ display: 'flex' }}>
          {links.map(l => (
            <NavLink key={l.to} to={l.to} end={l.exact}
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              {l.label}
            </NavLink>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle Theme" style={{ background: 'none', color: 'var(--text-primary)', display: 'flex', alignItems: 'center' }}>
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <Link to="/admin" className="nav-cta">Admin</Link>
          <button className="nav-hamburger" onClick={() => setMenuOpen(o => !o)} aria-label="Toggle menu">
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          position: 'fixed', top: 'var(--nav-h)', left: 0, right: 0,
          background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)',
          padding: '1rem 1.5rem', zIndex: 999, display: 'flex', flexDirection: 'column', gap: 4
        }}>
          {links.map(l => (
            <NavLink key={l.to} to={l.to} end={l.exact}
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              style={{ padding: '10px 14px' }}>
              {l.label}
            </NavLink>
          ))}
          <Link to="/admin" className="nav-link" style={{ padding: '10px 14px', color: 'var(--color-gold)' }}>Admin</Link>
        </div>
      )}
    </nav>
  );
}

// ── Footer ─────────────────────────────────────────────────
function Footer({ data }) {
  const location = useLocation();
  if (location.pathname.startsWith('/admin')) return null;

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-brand">
              RISE <span style={{ color: 'var(--color-gold)' }}>Lab</span>
            </div>
            <p className="footer-tagline">{data?.meta?.shortDescription || 'Robotics and Intelligent Systems Laboratory, Arizona State University.'}</p>
          </div>
          <div className="footer-col">
            <h5>Navigation</h5>
            <div className="footer-links">
              <Link to="/">Home</Link>
              <Link to="/research">Research</Link>
              <Link to="/team">Team</Link>
              <Link to="/publications">Publications</Link>
              <Link to="/education">Education</Link>
              <Link to="/contact">Contact</Link>
            </div>
          </div>
          <div className="footer-col">
            <h5>Contact</h5>
            <div className="footer-links">
              <a href={`mailto:${data?.director?.email}`}>{data?.director?.email}</a>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{data?.contact?.labLocation}</span>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span className="footer-copy">© {new Date().getFullYear()} {data?.meta?.university}. All rights reserved.</span>
          <span className="footer-asu">ASU RISE Lab</span>
        </div>
      </div>
    </footer>
  );
}

// ── Scroll to top button ────────────────────────────────────
function ScrollTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <button className={`scroll-top${visible ? ' visible' : ''}`}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Scroll to top">
      <ChevronUp size={18} />
    </button>
  );
}

// ── App ─────────────────────────────────────────────────────
function App() {
  const [data, setData] = useState(null);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const loadData = async () => {
    try {
      const res = await fetch('/database.json');
      if (res.ok) setData(await res.json());
    } catch (e) {
      console.error('Failed to load data:', e);
    }
  };

  useEffect(() => { loadData(); }, []);

  return (
    <Router>
      <Navbar labName={data?.meta?.labName} theme={theme} toggleTheme={toggleTheme} />
      <Routes>
        <Route path="/"            element={<HomePage data={data} />} />
        <Route path="/research"    element={<ResearchPage data={data} />} />
        <Route path="/team"        element={<TeamPage data={data} />} />
        <Route path="/publications" element={<PublicationsPage data={data} />} />
        <Route path="/education"   element={<EducationPage data={data} />} />
        <Route path="/contact"     element={<ContactPage data={data} />} />
        <Route path="/admin"       element={<AdminPage data={data} onSaved={loadData} />} />
      </Routes>
      <Footer data={data} />
      <ScrollTop />
    </Router>
  );
}

export default App;

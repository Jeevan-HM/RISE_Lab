import { useEffect, useState, useRef } from 'react';
import { Routes, Route, Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, ChevronUp, Sun, Moon } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from './firebase';

import './index.css';
import HomePage from './pages/HomePage';
import ResearchPage from './pages/ResearchPage';
import TeamPage from './pages/TeamPage';
import PublicationsPage from './pages/PublicationsPage';
import EducationPage from './pages/EducationPage';
import ContactPage from './pages/ContactPage';
import NewsPage from './pages/NewsPage';

// Edit mode
import { EditProvider, useEdit } from './context/EditContext';
import EditToolbar from './components/EditToolbar';
import EditDrawer from './components/EditDrawer';
import ThemeEditor from './components/ThemeEditor';


// Edit page variants
import EditHomePage from './pages/edit/EditHomePage';
import EditResearchPage from './pages/edit/EditResearchPage';
import EditTeamPage from './pages/edit/EditTeamPage';
import EditPublicationsPage from './pages/edit/EditPublicationsPage';
import EditEducationPage from './pages/edit/EditEducationPage';
import EditContactPage from './pages/edit/EditContactPage';
import EditNewsPage from './pages/edit/EditNewsPage';

// ── Scroll Reveal Hook ──────────────────────────────────────
function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    const revealEls = document.querySelectorAll('.reveal, .reveal-left');
    revealEls.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  });
}

// ── Branded Loading Screen ──────────────────────────────────
function AppLoading() {
  return (
    <div className="app-loading">
      <div className="app-loading-logo">
        RISE<span>Lab</span>
      </div>
      <div className="app-loading-bar" />
      <div className="app-loading-text">Loading…</div>
    </div>
  );
}

// ── Navbar ─────────────────────────────────────────────────
function Navbar({ theme, toggleTheme }) {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menu on route change
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setMenuOpen(false); }, [location]);

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuOpen]);

  if (location.pathname.startsWith('/admin')) return null;

  const links = [
    { to: '/', label: 'Home', exact: true },
    { to: '/research', label: 'Research' },
    { to: '/team', label: 'Team' },
    { to: '/publications', label: 'Publications' },
    { to: '/news', label: 'News' },
    { to: '/education', label: 'Education' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <nav
      className="navbar"
      style={{ boxShadow: scrolled ? '0 4px 24px rgba(0,0,0,0.4)' : 'none' }}
      ref={menuRef}
    >
      <div className="container">
        <Link to="/" className="nav-brand">
          <span>RISE</span>
          <span className="nav-brand-accent">Lab</span>
        </Link>

        <div className="nav-links" style={{ display: 'flex' }}>
          {links.map(l => (
            <NavLink key={l.to} to={l.to} end={l.exact}
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              {l.label}
            </NavLink>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            style={{ background: 'none', color: 'var(--text-primary)', display: 'flex', alignItems: 'center' }}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button className="nav-hamburger" onClick={() => setMenuOpen(o => !o)} aria-label="Toggle menu">
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div style={{
          position: 'fixed', top: 'var(--nav-h)', left: 0, right: 0,
          background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)',
          padding: '1rem 1.5rem', zIndex: 999, display: 'flex', flexDirection: 'column', gap: 4,
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        }}>
          {links.map(l => (
            <NavLink key={l.to} to={l.to} end={l.exact}
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              style={{ padding: '10px 14px' }}>
              {l.label}
            </NavLink>
          ))}
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
              RISE <span>Lab</span>
            </div>
            <p className="footer-tagline">
              {data?.meta?.shortDescription || 'Robotics and Intelligent Systems Laboratory, Arizona State University.'}
            </p>
          </div>
          <div className="footer-col">
            <h5>Navigation</h5>
            <div className="footer-links">
              <Link to="/">Home</Link>
              <Link to="/research">Research</Link>
              <Link to="/team">Team</Link>
              <Link to="/publications">Publications</Link>
              <Link to="/news">News</Link>
              <Link to="/education">Education</Link>
              <Link to="/contact">Contact</Link>
            </div>
          </div>
          <div className="footer-col">
            <h5>Contact</h5>
            <div className="footer-links">
              {data?.director?.email && (
                <a href={`mailto:${data.director.email}`}>{data.director.email}</a>
              )}
              {data?.contact?.labLocation && (
                <span>{data.contact.labLocation}</span>
              )}
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span className="footer-copy">
            © {new Date().getFullYear()} {data?.meta?.university || 'Arizona State University'}. All rights reserved.
          </span>
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
    <button
      className={`scroll-top${visible ? ' visible' : ''}`}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Scroll to top"
    >
      <ChevronUp size={18} />
    </button>
  );
}

// ── Edit Mode Wrapper ───────────────────────────────────────
function EditModeApp({ initialData, onSaved }) {
  const [showTheme, setShowTheme] = useState(false);
  const [loggedIn, setLoggedIn] = useState(null);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(u => setLoggedIn(!!u));
    return unsub;
  }, []);

  if (loggedIn === null) {
    return <AppLoading />;
  }

  if (!loggedIn) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ padding: '2rem', background: 'var(--color-surface)', borderRadius: 'var(--r-md)', textAlign: 'center' }}>
          <h2 style={{ marginBottom: '1rem' }}>Admin Access</h2>
          <p style={{ color: 'var(--text-muted)' }}>You must be logged in to access the admin panel.</p>
          <Link to="/" style={{ color: 'var(--color-gold)', display: 'block', marginTop: '1rem' }}>Return to Site</Link>
        </div>
      </div>
    );
  }

  return (
    <EditProvider initialData={initialData} onSaved={onSaved}>
      <EditModeInner
        showTheme={showTheme}
        setShowTheme={setShowTheme}
      />
    </EditProvider>
  );
}

function EditModeInner({ showTheme, setShowTheme }) {
  return (
    <>
      <EditToolbar onOpenTheme={() => setShowTheme(true)} />
      <div style={{ height: '48px' }} />
      <ThemeEditor open={showTheme} onClose={() => setShowTheme(false)} />
      <EditDrawer />
      <Routes>
        <Route path="/admin"              element={<EditHomePage />} />
        <Route path="/admin/research"     element={<EditResearchPage />} />
        <Route path="/admin/team"         element={<EditTeamPage />} />
        <Route path="/admin/publications" element={<EditPublicationsPage />} />
        <Route path="/admin/news"         element={<EditNewsPage />} />
        <Route path="/admin/education"    element={<EditEducationPage />} />
        <Route path="/admin/contact"      element={<EditContactPage />} />
        <Route path="*"                   element={<div style={{ padding: '4rem', textAlign: 'center' }}>404 Admin Page Not Found</div>} />
      </Routes>
    </>
  );
}

// ── Apply theme from Firestore data ────────────────────────
function applyTheme(theme) {
  if (!theme) return;
  const root = document.documentElement;
  const VAR_MAP = {
    colorMaroon: '--color-maroon', colorGold: '--color-gold', colorAccent: '--color-accent',
    colorBg: '--color-bg', colorSurface: '--color-surface', colorSurface2: '--color-surface-2',
    colorBorder: '--color-border', textPrimary: '--text-primary',
    textSecondary: '--text-secondary', textMuted: '--text-muted',
  };
  Object.entries(theme).forEach(([key, val]) => {
    if (VAR_MAP[key] && val) root.style.setProperty(VAR_MAP[key], val);
  });
}

// ── Public site wrapper (with scroll-reveal) ─────────────────
function PublicSite({ data, theme, toggleTheme }) {
  useScrollReveal();
  return (
    <>
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <Routes>
        <Route path="/"             element={<HomePage data={data} />} />
        <Route path="/research"     element={<ResearchPage data={data} />} />
        <Route path="/team"         element={<TeamPage data={data} />} />
        <Route path="/publications" element={<PublicationsPage data={data} />} />
        <Route path="/news"         element={<NewsPage data={data} />} />
        <Route path="/education"    element={<EducationPage data={data} />} />
        <Route path="/contact"      element={<ContactPage data={data} />} />
      </Routes>
      <Footer data={data} />
      <ScrollTop />
    </>
  );
}

// ── App ─────────────────────────────────────────────────────
function App() {
  const [data, setData] = useState(null);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const location = useLocation();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');


  const loadData = async () => {
    try {
      const docRef = doc(db, 'website', 'data');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const d = docSnap.data();
        setData(d);
        applyTheme(d.theme);
      } else {
        // Fallback: load from local public/database.json
        const res = await fetch(`${import.meta.env.BASE_URL}database.json`);
        const d = await res.json();
        setData(d);
        applyTheme(d.theme);
      }
    } catch (e) {
      console.error('Failed to load data from Firestore, trying local fallback:', e);
      try {
        const res = await fetch(`${import.meta.env.BASE_URL}database.json`);
        const d = await res.json();
        setData(d);
        applyTheme(d.theme);
      } catch (e2) {
        console.error('Local fallback also failed:', e2);
      }
    }
  };


  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { loadData(); }, []);

  if (!data) return <AppLoading />;

  const isAdmin = location.pathname.startsWith('/admin');
  if (isAdmin) return <EditModeApp initialData={data} onSaved={loadData} />;

  return <PublicSite data={data} theme={theme} toggleTheme={toggleTheme} />;
}

export default App;

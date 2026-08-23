import { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Save, LogOut, Palette, Eye, Edit3, AlertCircle, Check, GitBranch, History } from 'lucide-react';
import { useEdit } from '../context/EditContext';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import GitHubSettings from './GitHubSettings';
import VersionHistory from './VersionHistory';
import { getGitHubConfig } from '../lib/githubSync';

const PAGES = [
  { to: '/admin',              label: 'Home',         exact: true  },
  { to: '/admin/research',     label: 'Research'                   },
  { to: '/admin/team',         label: 'Team'                       },
  { to: '/admin/publications', label: 'Publications'               },
  { to: '/admin/news',         label: 'News'                       },
  { to: '/admin/education',    label: 'Education'                  },
  { to: '/admin/contact',      label: 'Contact'                    },
];

export default function EditToolbar({ onOpenTheme, onOpenAdvanced }) {
  const { save, saving, isDirty, toast, setCurrentPage } = useEdit();
  const location = useLocation();
  const navigate = useNavigate();
  const [showGitHub, setShowGitHub] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [gitHubConnected, setGitHubConnected] = useState(false);

  // Update current page label for commit messages
  useEffect(() => {
    const page = PAGES.find(p => p.exact ? location.pathname === p.to : location.pathname.startsWith(p.to));
    setCurrentPage?.(page?.label || 'Admin');
  }, [location.pathname, setCurrentPage]);

  // Check if GitHub is configured
  useEffect(() => {
    getGitHubConfig().then(cfg => setGitHubConnected(!!(cfg?.token && cfg?.owner && cfg?.repo)));
  }, [showGitHub]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/admin');
  };

  return (
    <>
      {/* GitHub Settings Modal */}
      {showGitHub && <GitHubSettings onClose={() => setShowGitHub(false)} />}

      {/* Version History Modal */}
      {showHistory && <VersionHistory onClose={() => setShowHistory(false)} />}

      {/* Toolbar */}
      <div className="edit-toolbar">
        {/* Left: Edit Mode badge + page tabs */}
        <div className="edit-toolbar-left">
          <div className="edit-mode-badge">
            <Edit3 size={13} />
            Edit Mode
          </div>
          <div className="edit-toolbar-divider" />
          <nav className="edit-page-tabs">
            {PAGES.map(p => (
              <NavLink
                key={p.to}
                to={p.to}
                end={p.exact}
                className={({ isActive }) => `edit-page-tab${isActive ? ' active' : ''}`}
              >
                {p.label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Right: Actions */}
        <div className="edit-toolbar-right">
          <button
            className="edit-toolbar-btn"
            onClick={onOpenTheme}
            title="Theme colors"
          >
            <Palette size={14} />
            Theme
          </button>



          {/* GitHub Settings */}
          <button
            className="edit-toolbar-btn"
            onClick={() => setShowGitHub(true)}
            title={gitHubConnected ? 'GitHub connected — click to configure' : 'Set up GitHub version control'}
            style={{ position: 'relative' }}
          >
            <GitBranch size={14} />
            GitHub
            {/* Connected indicator dot */}
            <span style={{
              position: 'absolute', top: 4, right: 4,
              width: 7, height: 7, borderRadius: '50%',
              background: gitHubConnected ? '#27ae60' : '#95a5a6',
              border: '1.5px solid var(--color-toolbar, #1a1a2e)',
            }} />
          </button>

          {/* Version History */}
          <button
            className="edit-toolbar-btn"
            onClick={() => setShowHistory(true)}
            title="View version history"
          >
            <History size={14} />
            History
          </button>

          <button
            className="edit-toolbar-btn danger"
            onClick={handleLogout}
            title="Exit edit mode"
          >
            <LogOut size={14} />
            Logout
          </button>

          <button
            className={`edit-toolbar-save${isDirty ? ' dirty' : ''}`}
            onClick={save}
            disabled={saving}
          >
            {saving ? (
              <>
                <div className="edit-save-spinner" />
                Saving…
              </>
            ) : (
              <>
                {isDirty && <span className="dirty-dot" />}
                <Save size={14} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      {/* Toast notification */}
      {toast && (
        <div className={`edit-toast${toast.startsWith('Error') ? ' error' : ''}`}>
          {toast.startsWith('Error') ? (
            <AlertCircle size={15} />
          ) : (
            <Check size={15} />
          )}
          {toast}
        </div>
      )}
    </>
  );
}

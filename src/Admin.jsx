import { useState, useEffect } from 'react';
import { Save, LogOut, CheckCircle, Edit3, LayoutDashboard, ShieldAlert } from 'lucide-react';

export default function Admin({ data, onSaved }) {
  const [token, setToken] = useState(localStorage.getItem('adminToken'));
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [editData, setEditData] = useState('');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(false);
  const [error, setError] = useState('');

  // Sync editData whenever the data prop changes (if not already set)
  useEffect(() => {
    if (data) {
      setEditData(prev => prev || JSON.stringify(data, null, 2));
    }
  }, [data]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (res.ok) {
        const json = await res.json();
        setToken(json.token);
        localStorage.setItem('adminToken', json.token);
        setError('');
      } else {
        setError('Invalid credentials');
      }
    } catch (e) {
      setError('Connection error');
    }
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('adminToken');
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const parsedData = JSON.parse(editData);
      const res = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, data: parsedData })
      });

      if (res.ok) {
        setToast(true);
        setTimeout(() => setToast(false), 3000);
        onSaved();
      } else {
        setError('Failed to save data. Token might be expired.');
      }
    } catch (e) {
      setError('Invalid JSON format.');
    }
    setSaving(false);
  };

  if (!token) {
    return (
      <div className="hero">
        <div className="glass-panel" style={{ padding: '3rem', width: '100%', maxWidth: '400px' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <ShieldAlert size={48} className="text-gradient" style={{ margin: '0 auto 1rem' }} />
            <h2>Admin Login</h2>
          </div>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Username</label>
              <input 
                type="text" 
                className="form-input" 
                value={username} 
                onChange={e => setUsername(e.target.value)} 
                required 
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input 
                type="password" 
                className="form-input" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required 
              />
            </div>
            {error && <p style={{ color: '#ef4444', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</p>}
            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-sidebar">
        <h2 className="nav-brand text-gradient" style={{ marginBottom: '3rem' }}>Lab Admin</h2>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'flex-start', background: 'var(--surface-hover)', borderColor: 'transparent' }}>
            <LayoutDashboard size={18} /> JSON Editor
          </button>
          <a href="/" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'flex-start', border: 'none' }}>
            <Edit3 size={18} /> View Site
          </a>
        </nav>

        <div style={{ position: 'absolute', bottom: '2rem', width: '250px', padding: '0 2rem', left: 0 }}>
          <button onClick={handleLogout} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>

      <div className="admin-content animate-fade-in">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ marginBottom: '0.5rem' }}>Database Editor</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Edit the raw JSON file directly to update website content.</p>
          </div>
          <button onClick={handleSave} className="btn btn-primary" disabled={saving}>
            <Save size={18} /> {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        <div className="glass-panel" style={{ padding: '1px' }}>
          <textarea
            className="form-input form-textarea"
            style={{ 
              minHeight: '600px', 
              fontFamily: 'monospace', 
              fontSize: '14px', 
              background: 'rgba(0,0,0,0.5)',
              border: 'none',
              borderRadius: '15px'
            }}
            value={editData}
            onChange={e => setEditData(e.target.value)}
          />
        </div>

        {toast && (
          <div className="save-toast">
            <CheckCircle size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '8px' }} />
            Changes saved successfully!
          </div>
        )}
      </div>
    </div>
  );
}

import { useEffect } from 'react';
import { X } from 'lucide-react';
import { useEdit } from '../context/EditContext';

export default function EditDrawer() {
  const { activePanel, closePanel } = useEdit();

  // Close on Escape key
  useEffect(() => {
    if (!activePanel) return;
    const handler = (e) => { if (e.key === 'Escape') closePanel(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [activePanel, closePanel]);

  if (!activePanel) return null;

  return (
    <>
      {/* Backdrop — clicking closes drawer */}
      <div className="edit-drawer-backdrop" onClick={closePanel} />

      {/* Drawer */}
      <div className="edit-drawer animate-slide-in-right">
        <div className="edit-drawer-header">
          <span className="edit-drawer-title">{activePanel.title}</span>
          <button className="edit-drawer-close" onClick={closePanel} aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <div className="edit-drawer-body">
          {activePanel.content}
        </div>
      </div>
    </>
  );
}

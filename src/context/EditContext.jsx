import { createContext, useContext, useState, useCallback, useRef } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { commitToGitHub } from '../lib/githubSync';

const EditContext = createContext(null);

export function EditProvider({ initialData, onSaved, children }) {
  const [liveData, setLiveData] = useState(initialData || {});
  const [activePanel, setActivePanel] = useState(null); // { title, content: ReactNode }
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');
  const isDirty = useRef(false);
  const [dirtyFlag, setDirtyFlag] = useState(false);
  // Track which page is active for the commit message
  const currentPageRef = useRef('');

  // Update a specific path in liveData using dot notation: 'meta.labName'
  const updateField = useCallback((path, value) => {
    setLiveData(prev => {
      const next = JSON.parse(JSON.stringify(prev)); // deep clone
      const keys = path.split('.');
      let obj = next;
      for (let i = 0; i < keys.length - 1; i++) {
        if (obj[keys[i]] === undefined) obj[keys[i]] = {};
        obj = obj[keys[i]];
      }
      obj[keys[keys.length - 1]] = value;
      return next;
    });
    isDirty.current = true;
    setDirtyFlag(true);
  }, []);

  // Replace an entire top-level key (e.g. news array)
  const updateSection = useCallback((key, value) => {
    setLiveData(prev => ({ ...prev, [key]: value }));
    isDirty.current = true;
    setDirtyFlag(true);
  }, []);

  const openPanel = useCallback((config) => {
    setActivePanel(config); // config = { title, content }
  }, []);

  const closePanel = useCallback(() => {
    setActivePanel(null);
  }, []);

  const save = useCallback(async () => {
    setSaving(true);
    try {
      // 1. Save to Firestore (always happens first)
      await setDoc(doc(db, 'website', 'data'), liveData);
      isDirty.current = false;
      setDirtyFlag(false);
      onSaved?.();

      // 2. Auto-commit to GitHub (best-effort — won't block if not configured)
      const page = currentPageRef.current || 'Admin';
      commitToGitHub(liveData, `Admin save: ${page}`)
        .then(result => {
          if (result.ok) {
            setToast('✓ Saved & committed to GitHub');
          } else if (result.error?.includes('not configured')) {
            setToast('Changes saved successfully!');
          } else {
            // GitHub failed but Firestore succeeded
            setToast(`Saved to database (GitHub: ${result.error})`);
          }
          setTimeout(() => setToast(''), 4000);
        })
        .catch(() => {
          setToast('Changes saved successfully!');
          setTimeout(() => setToast(''), 3000);
        });

    } catch (e) {
      setToast(`Error: ${e.message}`);
      setTimeout(() => setToast(''), 4000);
    } finally {
      setSaving(false);
    }
  }, [liveData, onSaved]);

  return (
    <EditContext.Provider value={{
      liveData,
      setLiveData,
      updateField,
      updateSection,
      activePanel,
      openPanel,
      closePanel,
      isDirty: dirtyFlag,
      saving,
      save,
      toast,
      setCurrentPage: (page) => { currentPageRef.current = page; },
    }}>
      {children}
    </EditContext.Provider>
  );
}

export function useEdit() {
  const ctx = useContext(EditContext);
  if (!ctx) throw new Error('useEdit must be used within EditProvider');
  return ctx;
}

import { useState, useRef } from 'react';
import { Pencil } from 'lucide-react';
import { useEdit } from '../context/EditContext';

/**
 * Wraps any section with edit-mode hover + click-to-edit behaviour.
 * The transparent overlay is REMOVED — child clicks always work.
 * Instead, a floating "Edit" pill appears on hover that opens the panel.
 *
 * Props:
 *   label      - displayed in the drawer header and on the button
 *   content    - ReactNode to render inside the drawer (form fields)
 *   position   - 'top-right' | 'top-left' | 'bottom-right' (default top-right)
 *   disabled   - if true, no edit overlay
 *   pill       - if true, shows a larger more prominent pill (default true)
 */
export default function Editable({
  label,
  content,
  children,
  position = 'top-right',
  disabled = false,
  className = '',
}) {
  const { openPanel } = useEdit();
  const [hovered, setHovered] = useState(false);
  const timerRef = useRef(null);

  if (disabled) return children;

  const handleEditClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    openPanel({ title: label, content });
  };

  // Use delayed hide so moving mouse to the button doesn't close it
  const handleMouseEnter = () => {
    clearTimeout(timerRef.current);
    setHovered(true);
  };
  const handleMouseLeave = () => {
    timerRef.current = setTimeout(() => setHovered(false), 150);
  };

  const positions = {
    'top-right':    { top: 10, right: 10 },
    'top-left':     { top: 10, left: 10 },
    'bottom-right': { bottom: 10, right: 10 },
  };

  return (
    <div
      className={`editable-zone${hovered ? ' hovered' : ''} ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ position: 'relative' }}
    >
      {children}

      {/* Floating Edit button — pointer-events auto, no overlay blocking children */}
      {hovered && (
        <button
          className="edit-pencil-btn"
          style={{
            position: 'absolute',
            zIndex: 200,
            ...positions[position],
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleEditClick}
          title={`Edit: ${label}`}
        >
          <Pencil size={14} />
        </button>
      )}
    </div>
  );
}

import { useState } from 'react';
import { HeroBlock, StatsBlock, ResearchAreasBlock, DirectorBlock, CustomBlock } from '../HomePage';
import Editable from '../../components/Editable';
import { useEdit } from '../../context/EditContext';
import { Field, ImageField } from '../../components/DrawerFields';
import {
  Plus, GripVertical, Trash2, ArrowUp, ArrowDown, X,
  AlignLeft, Image, MousePointer, Heading, Minus, Megaphone
} from 'lucide-react';

// ── Block Type Picker Modal ──────────────────────────────────────────────────

const BLOCK_TYPES = [
  { type: 'custom-text',    icon: AlignLeft,      label: 'Text Block',   desc: 'A paragraph of text' },
  { type: 'custom-heading', icon: Heading,        label: 'Heading',      desc: 'A large section title' },
  { type: 'custom-image',   icon: Image,          label: 'Image',        desc: 'A full-width or centered image' },
  { type: 'custom-buttons', icon: MousePointer,   label: 'Buttons',      desc: 'A row of CTA buttons' },
  { type: 'custom-callout', icon: Megaphone,      label: 'Callout Box',  desc: 'A highlighted callout or alert' },
  { type: 'custom-divider', icon: Minus,          label: 'Divider',      desc: 'A horizontal rule between sections' },
];

function BlockPicker({ onSelect, onClose }) {
  return (
    <div className="block-picker-overlay" onClick={onClose}>
      <div className="block-picker-modal" onClick={e => e.stopPropagation()}>
        <div className="block-picker-header">
          <h3>Add a Block</h3>
          <button className="block-picker-close" onClick={onClose}><X size={18}/></button>
        </div>
        <div className="block-picker-grid">
          {BLOCK_TYPES.map(({ type, icon: Icon, label, desc }) => (
            <button key={type} className="block-picker-item" onClick={() => onSelect(type)}>
              <div className="block-picker-icon"><Icon size={22}/></div>
              <div className="block-picker-label">{label}</div>
              <div className="block-picker-desc">{desc}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Drawers for Core Blocks ─────────────────────────────────────────────────

function HeroDrawer() {
  const { liveData, updateField, updateSection } = useEdit();
  const m = liveData.meta || {};
  const buttons = liveData.heroButtons || [
    { label: 'Explore Research', link: '/research', style: 'primary' },
    { label: 'Meet the Team', link: '/team', style: 'secondary' }
  ];

  const updateBtn = (i, f, v) => {
    const next = [...buttons]; next[i] = { ...next[i], [f]: v };
    updateSection('heroButtons', next);
  };
  const addBtn = () => updateSection('heroButtons', [...buttons, { label: 'New Button', link: '/', style: 'secondary' }]);
  const rmBtn = i => updateSection('heroButtons', buttons.filter((_, idx) => idx !== i));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <Field label="Lab Short Name" value={m.labName} onChange={v => updateField('meta.labName', v)} />
      <Field label="Lab Full Name" value={m.labFullName} onChange={v => updateField('meta.labFullName', v)} />
      <Field label="University" value={m.university} onChange={v => updateField('meta.university', v)} />
      <Field label="Hero Description" value={m.shortDescription} onChange={v => updateField('meta.shortDescription', v)} rows={4} />
      <div style={{ marginTop: '1rem', borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
        <h4 style={{ marginBottom: '0.5rem', fontSize: '0.9rem' }}>Hero Buttons</h4>
        <button className="btn-add" onClick={addBtn} style={{ marginBottom: '0.75rem' }}><Plus size={13}/> Add Button</button>
        {buttons.map((btn, i) => (
          <div key={i} style={{ background: 'var(--color-bg)', padding: '0.5rem', borderRadius: 'var(--r-md)', marginBottom: '0.5rem', border: '1px solid var(--color-border)' }}>
            <Field label="Label" value={btn.label} onChange={v => updateBtn(i, 'label', v)} />
            <Field label="Link" value={btn.link} onChange={v => updateBtn(i, 'link', v)} />
            <div style={{ marginTop: '0.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Style</label>
              <select value={btn.style} onChange={e => updateBtn(i, 'style', e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--r-sm)', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--text-primary)' }}>
                <option value="primary">Primary</option>
                <option value="secondary">Secondary</option>
                <option value="ghost">Ghost</option>
              </select>
            </div>
            <button className="btn-delete" onClick={() => rmBtn(i)} style={{ marginTop: '0.5rem' }}><Trash2 size={12}/> Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function NewsDrawer() {
  const { liveData, updateSection } = useEdit();
  const items = liveData.news || [];
  const update = (i, f, v) => updateSection('news', items.map((it, idx) => idx === i ? { ...it, [f]: v } : it));
  const remove = i => updateSection('news', items.filter((_, idx) => idx !== i));
  const add = () => updateSection('news', [{ date: '', headline: '' }, ...items]);

  return (
    <div>
      <button className="btn-add" onClick={add} style={{ marginBottom: '1rem' }}>
        <Plus size={13} /> Add News Item
      </button>
      {items.map((item, i) => (
        <div key={i} style={{ background: 'var(--color-bg)', borderRadius: 'var(--r-md)', padding: '0.75rem', marginBottom: '0.75rem', border: '1px solid var(--color-border)' }}>
          <Field label="Date" value={item.date} onChange={v => update(i, 'date', v)} />
          <div style={{ marginTop: '0.5rem' }}>
            <Field label="Headline" value={item.headline} onChange={v => update(i, 'headline', v)} rows={2} />
          </div>
          <button className="btn-delete" onClick={() => remove(i)} style={{ marginTop: '0.5rem' }}>
            <Trash2 size={12} /> Remove
          </button>
        </div>
      ))}
      {items.length === 0 && (
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontStyle: 'italic' }}>No news items yet.</p>
      )}
    </div>
  );
}

function CarouselDrawer() {
  const { liveData, updateSection } = useEdit();
  const images = liveData.homeCarouselImages || [];
  const addImg = () => updateSection('homeCarouselImages', [...images, '']);
  const updateImg = (i, v) => { const next = [...images]; next[i] = v; updateSection('homeCarouselImages', next); };
  const rmImg = i => updateSection('homeCarouselImages', images.filter((_, idx) => idx !== i));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {images.map((img, i) => (
        <div key={i} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}><ImageField label={`Image ${i + 1}`} value={img} onChange={v => updateImg(i, v)} folder="slide" /></div>
          <button className="btn-delete" onClick={() => rmImg(i)} style={{ padding: '0.5rem', marginTop: 22 }}><Trash2 size={14}/></button>
        </div>
      ))}
      <button className="btn-add" onClick={addImg} style={{ marginTop: '0.5rem' }}><Plus size={14}/> Add Carousel Image</button>
    </div>
  );
}

function DirectorHomeDrawer() {
  const { liveData, updateField } = useEdit();
  const d = liveData.director || {};
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <Field label="Name" value={d.name} onChange={v => updateField('director.name', v)} />
      <Field label="Title" value={d.title} onChange={v => updateField('director.title', v)} />
      <Field label="Email" value={d.email} onChange={v => updateField('director.email', v)} />
      <ImageField label="Photo" value={d.photo} onChange={v => updateField('director.photo', v)} folder="teampic" />
      <Field label="Affiliation" value={d.affiliation} onChange={v => updateField('director.affiliation', v)} />
      <Field label="Bio" value={d.bio} onChange={v => updateField('director.bio', v)} rows={6} />
    </div>
  );
}

// ── Drawers for Custom Block Types ──────────────────────────────────────────

function CustomBlockDrawer({ blockId }) {
  const { liveData, updateSection, closePanel } = useEdit();
  const layout = liveData.homeLayout || [];
  const blockIndex = layout.findIndex(b => b.id === blockId);
  const block = layout[blockIndex] || {};

  const update = (f, v) => {
    const next = [...layout]; next[blockIndex] = { ...block, [f]: v };
    updateSection('homeLayout', next);
  };
  const updateBtn = (i, f, v) => {
    const next = [...layout];
    const btns = [...(block.buttons || [])]; btns[i] = { ...btns[i], [f]: v };
    next[blockIndex] = { ...block, buttons: btns }; updateSection('homeLayout', next);
  };
  const addBtn = () => {
    const next = [...layout];
    const btns = [...(block.buttons || []), { label: 'New Button', link: '/', style: 'primary' }];
    next[blockIndex] = { ...block, buttons: btns }; updateSection('homeLayout', next);
  };
  const rmBtn = i => {
    const next = [...layout];
    const btns = (block.buttons || []).filter((_, idx) => idx !== i);
    next[blockIndex] = { ...block, buttons: btns }; updateSection('homeLayout', next);
  };
  const removeBlock = () => {
    updateSection('homeLayout', layout.filter((_, idx) => idx !== blockIndex));
    closePanel();
  };

  // Render different fields based on block type
  const renderTypeFields = () => {
    switch (block.type) {
      case 'custom-text':
        return <Field label="Content" value={block.content || ''} onChange={v => update('content', v)} rows={8} />;
      case 'custom-heading':
        return (
          <>
            <Field label="Heading Text" value={block.heading || ''} onChange={v => update('heading', v)} />
            <Field label="Sub-heading (optional)" value={block.subheading || ''} onChange={v => update('subheading', v)} />
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Alignment</label>
              <select value={block.align || 'center'} onChange={e => update('align', e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--r-sm)', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--text-primary)' }}>
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>
          </>
        );
      case 'custom-image':
        return (
          <>
            <ImageField label="Image" value={block.image || ''} onChange={v => update('image', v)} folder="" />
            <Field label="Alt text / Caption" value={block.caption || ''} onChange={v => update('caption', v)} />
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Size</label>
              <select value={block.size || 'full'} onChange={e => update('size', e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--r-sm)', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--text-primary)' }}>
                <option value="full">Full Width</option>
                <option value="wide">Wide (90%)</option>
                <option value="medium">Medium (60%)</option>
                <option value="small">Small (40%)</option>
              </select>
            </div>
          </>
        );
      case 'custom-buttons':
        return null; // Just the buttons section below
      case 'custom-callout':
        return (
          <>
            <Field label="Callout Title" value={block.title || ''} onChange={v => update('title', v)} />
            <Field label="Callout Text" value={block.content || ''} onChange={v => update('content', v)} rows={4} />
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Style</label>
              <select value={block.calloutStyle || 'info'} onChange={e => update('calloutStyle', e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--r-sm)', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--text-primary)' }}>
                <option value="info">Info (Purple)</option>
                <option value="warning">Warning (Gold)</option>
                <option value="success">Success (Green)</option>
                <option value="maroon">Maroon</option>
              </select>
            </div>
          </>
        );
      case 'custom-divider':
        return <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>This block adds a visual horizontal divider between sections.</p>;
      default:
        return (
          <>
            <Field label="Section Title" value={block.title || ''} onChange={v => update('title', v)} />
            <ImageField label="Image" value={block.image || ''} onChange={v => update('image', v)} folder="" />
            <Field label="Content (Text)" value={block.content || ''} onChange={v => update('content', v)} rows={6} />
          </>
        );
    }
  };

  const showButtons = ['custom', 'custom-buttons', 'custom-text', 'custom-heading'].includes(block.type);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {renderTypeFields()}

      {showButtons && (
        <div style={{ marginTop: '1rem', borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
          <h4 style={{ marginBottom: '0.5rem', fontSize: '0.9rem' }}>Buttons</h4>
          <button className="btn-add" onClick={addBtn} style={{ marginBottom: '0.75rem' }}><Plus size={13}/> Add Button</button>
          {(block.buttons || []).map((btn, i) => (
            <div key={i} style={{ background: 'var(--color-bg)', padding: '0.5rem', borderRadius: 'var(--r-md)', marginBottom: '0.5rem', border: '1px solid var(--color-border)' }}>
              <Field label="Label" value={btn.label} onChange={v => updateBtn(i, 'label', v)} />
              <Field label="Link" value={btn.link} onChange={v => updateBtn(i, 'link', v)} />
              <div style={{ marginTop: '0.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Style</label>
                <select value={btn.style} onChange={e => updateBtn(i, 'style', e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--r-sm)', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--text-primary)' }}>
                  <option value="primary">Primary</option>
                  <option value="secondary">Secondary</option>
                  <option value="ghost">Ghost</option>
                </select>
              </div>
              <button className="btn-delete" onClick={() => rmBtn(i)} style={{ marginTop: '0.5rem' }}><Trash2 size={12}/> Remove</button>
            </div>
          ))}
        </div>
      )}

      <button className="btn-delete" onClick={removeBlock} style={{ marginTop: '1.5rem' }}>
        <Trash2 size={12}/> Delete This Block
      </button>
    </div>
  );
}

// ── Custom Block Renderer ──────────────────────────────────────────────────

function CustomBlockRenderer({ block }) {
  switch (block.type) {
    case 'custom-heading':
      return (
        <div className="section" style={{ padding: '3rem 0' }}>
          <div className="container" style={{ textAlign: block.align || 'center' }}>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', marginBottom: block.subheading ? '0.75rem' : 0 }}>
              {block.heading || 'Section Heading'}
            </h2>
            {block.subheading && <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>{block.subheading}</p>}
          </div>
        </div>
      );
    case 'custom-text':
      return (
        <div className="section" style={{ background: 'var(--color-surface-2)' }}>
          <div className="container">
            <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.8, fontSize: '1.05rem', color: 'var(--text-secondary)', maxWidth: '760px', margin: '0 auto' }}>
              {block.content || 'Add text content in the editor.'}
            </div>
            {block.buttons?.length > 0 && (
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1.5rem', justifyContent: 'center' }}>
                {block.buttons.map((btn, i) => (
                  <a key={i} href={btn.link} className={`btn btn-${btn.style || 'primary'}`}>{btn.label}</a>
                ))}
              </div>
            )}
          </div>
        </div>
      );
    case 'custom-image':
      return (
        <div className="section" style={{ padding: '3rem 0' }}>
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
    case 'custom-buttons':
      return (
        <div className="section" style={{ padding: '2.5rem 0', background: 'var(--color-surface-2)' }}>
          <div className="container" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            {(block.buttons || [{ label: 'Click Me', link: '/', style: 'primary' }]).map((btn, i) => (
              <a key={i} href={btn.link} className={`btn btn-${btn.style || 'primary'}`} style={{ fontSize: '1rem', padding: '0.75rem 2rem' }}>{btn.label}</a>
            ))}
          </div>
        </div>
      );
    case 'custom-callout': {
      const calloutColors = {
        info: { bg: 'rgba(120,80,180,0.12)', border: 'rgba(120,80,180,0.4)', color: '#9c7fd4' },
        warning: { bg: 'rgba(200,146,42,0.12)', border: 'var(--color-gold)', color: 'var(--color-gold)' },
        success: { bg: 'rgba(34,197,94,0.12)', border: 'rgba(34,197,94,0.4)', color: '#4ade80' },
        maroon: { bg: 'rgba(140,29,64,0.12)', border: 'var(--color-maroon)', color: 'var(--color-maroon)' },
      };
      const cc = calloutColors[block.calloutStyle || 'info'];
      return (
        <div className="section" style={{ padding: '3rem 0' }}>
          <div className="container">
            <div style={{ background: cc.bg, border: `2px solid ${cc.border}`, borderRadius: 'var(--r-lg)', padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
              {block.title && <h3 style={{ color: cc.color, marginBottom: '0.75rem' }}>{block.title}</h3>}
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>{block.content || 'Add your callout text.'}</p>
            </div>
          </div>
        </div>
      );
    }
    case 'custom-divider':
      return (
        <div style={{ padding: '2rem 0' }}>
          <div className="container">
            <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)' }} />
          </div>
        </div>
      );
    default:
      return <CustomBlock block={block} />;
  }
}

// ── Main Page & Drag/Drop Wrapper ──────────────────────────────────────────

export default function EditHomePage() {
  const { liveData, updateSection } = useEdit();
  const [draggableBlockId, setDraggableBlockId] = useState(null);
  const [pickerInsertIndex, setPickerInsertIndex] = useState(null); // null = closed

  const defaultLayout = [
    { id: 'hero', type: 'hero' },
    { id: 'stats', type: 'stats' },
    { id: 'researchAreas', type: 'researchAreas' },
    { id: 'director', type: 'director' }
  ];
  const layout = liveData.homeLayout || defaultLayout;

  const moveBlock = (fromIndex, toIndex) => {
    const next = [...layout];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    updateSection('homeLayout', next);
  };

  const insertBlock = (index, type) => {
    const defaults = {
      'custom-text':    { content: 'Edit this text block.' },
      'custom-heading': { heading: 'New Section Heading', subheading: '' },
      'custom-image':   { image: '', caption: '', size: 'full' },
      'custom-buttons': { buttons: [{ label: 'Click Here', link: '/', style: 'primary' }] },
      'custom-callout': { title: 'Callout Title', content: 'Your callout message here.', calloutStyle: 'info' },
      'custom-divider': {},
    };
    const newBlock = {
      id: `block_${Date.now()}`,
      type,
      ...defaults[type],
    };
    const next = [...layout];
    next.splice(index, 0, newBlock);
    updateSection('homeLayout', next);
    setPickerInsertIndex(null);
  };

  const removeBlock = (index) => {
    const next = [...layout]; next.splice(index, 1);
    updateSection('homeLayout', next);
  };

  return (
    <div className="page-wrapper builder-wrapper">
      {/* Block type picker modal */}
      {pickerInsertIndex !== null && (
        <BlockPicker
          onSelect={(type) => insertBlock(pickerInsertIndex, type)}
          onClose={() => setPickerInsertIndex(null)}
        />
      )}

      <div style={{ position: 'relative' }}>
        {layout.map((block, index) => {
          // eslint-disable-next-line no-useless-assignment
          let ContentComp = null;
          // eslint-disable-next-line no-useless-assignment
          let DrawerComp = null;
          // eslint-disable-next-line no-useless-assignment
          let label = 'Edit Block';

          switch (block.type) {
            case 'hero':
              ContentComp = <HeroBlock data={liveData} />;
              DrawerComp = (
                <>
                  <h3 style={{ marginBottom: '1rem' }}>Hero Content</h3>
                  <HeroDrawer />
                  <hr style={{ margin: '2rem 0', borderColor: 'var(--color-border)' }}/>
                  <h3 style={{ marginBottom: '1rem' }}>Carousel Images</h3>
                  <CarouselDrawer />
                  <hr style={{ margin: '2rem 0', borderColor: 'var(--color-border)' }}/>
                  <h3 style={{ marginBottom: '1rem' }}>Latest News</h3>
                  <NewsDrawer />
                </>
              );
              label = 'Hero Section';
              break;
            case 'stats':
              ContentComp = <StatsBlock data={liveData} />;
              DrawerComp = <div><p style={{ color: 'var(--text-secondary)' }}>Stats are computed from lab members and publications. Edit those pages to update these numbers.</p></div>;
              label = 'Stats Overview';
              break;
            case 'researchAreas':
              ContentComp = <ResearchAreasBlock data={liveData} />;
              DrawerComp = <div><p style={{ color: 'var(--text-secondary)' }}>Research areas are managed on the Research page. Go there to add, remove, or reorder them.</p></div>;
              label = 'Research Areas';
              break;
            case 'director':
              ContentComp = <DirectorBlock data={liveData} />;
              DrawerComp = <DirectorHomeDrawer />;
              label = 'Lab Director';
              break;
            default:
              ContentComp = <CustomBlockRenderer block={block} />;
              DrawerComp = <CustomBlockDrawer blockId={block.id} />;
              label = block.heading || block.title || block.type?.replace('custom-', '') || 'Custom Block';
          }

          return (
            <div key={block.id} className="builder-block-row">
              {/* ── Insert Zone Above ── */}
              <div className="insert-zone" onClick={() => setPickerInsertIndex(index)}>
                <div className="insert-line" />
                <button className="btn-insert">
                  <Plus size={14} /> Add Block
                </button>
              </div>

              {/* ── Draggable Block ── */}
              <div
                className="draggable-block"
                draggable={draggableBlockId === block.id}
                onDragStart={e => { e.dataTransfer.setData('text/plain', index); e.dataTransfer.effectAllowed = 'move'; }}
                onDragOver={e => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; }}
                onDrop={e => {
                  e.preventDefault();
                  const fromIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
                  if (fromIndex !== index) moveBlock(fromIndex, index);
                }}
              >
                {/* Block Controls */}
                <div className="block-controls">
                  <div
                    className="drag-handle"
                    title="Drag to reorder"
                    onMouseDown={() => setDraggableBlockId(block.id)}
                    onMouseUp={() => setDraggableBlockId(null)}
                    onMouseLeave={() => setDraggableBlockId(null)}
                  >
                    <GripVertical size={18} />
                  </div>
                  <button onClick={() => { if (index > 0) moveBlock(index, index - 1); }} title="Move Up"><ArrowUp size={16} /></button>
                  <button onClick={() => { if (index < layout.length - 1) moveBlock(index, index + 1); }} title="Move Down"><ArrowDown size={16} /></button>
                  {!['hero','stats','researchAreas','director'].includes(block.type) && (
                    <button onClick={() => removeBlock(index)} title="Delete Block" className="danger-btn"><Trash2 size={16} /></button>
                  )}
                </div>

                {/* Editable block content — no pointerEvents wrapper */}
                <Editable label={label} content={DrawerComp}>
                  {ContentComp}
                </Editable>
              </div>

              {/* ── Final Insert Zone at bottom of last block ── */}
              {index === layout.length - 1 && (
                <div className="insert-zone" onClick={() => setPickerInsertIndex(index + 1)}>
                  <div className="insert-line" />
                  <button className="btn-insert">
                    <Plus size={14} /> Add Block
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

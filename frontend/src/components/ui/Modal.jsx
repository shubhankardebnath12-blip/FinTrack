import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children, footer, size = 'md' }) => {
  const overlayRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const widths = { sm: '440px', md: '520px', lg: '680px', xl: '880px' };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(12px)', padding: '0' }}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div
        className="modal-content w-full flex flex-col modal-slide-up sm:animation-scale-in"
        style={{
          maxWidth: widths[size] || widths.md,
          maxHeight: '92vh',
          height: 'auto',
          background: 'linear-gradient(180deg, #0f1520 0%, #0a0f18 100%)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(99,102,241,0.06), inset 0 1px 0 rgba(255,255,255,0.06)',
          borderRadius: '24px 24px 0 0',
          margin: 0,
        }}
      >
        {/* Drag handle — mobile affordance */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.15)' }} />
        </div>

        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 sm:py-5 flex-shrink-0"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        >
          <h2 className="text-base font-bold text-white tracking-tight">{title}</h2>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-200"
            style={{ color: 'rgba(255,255,255,0.4)', touchAction: 'manipulation' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; }}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body — scrollable */}
        <div className="px-6 py-5 overflow-y-auto flex-1">{children}</div>

        {/* Footer */}
        {footer && (
          <div
            className="px-6 py-4 flex justify-end gap-3 flex-shrink-0"
            style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;

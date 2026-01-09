import type { ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function Modal({ isOpen, onClose, title, children, footer }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative glass-card rounded-win11-xl shadow-win11-lg max-w-3xl w-full max-h-[90vh] overflow-hidden animate-modal-appear border border-white/20">
        {/* Header */}
        <div className="px-6 py-5 flex items-center justify-between border-b border-win11-gray-200/50">
          <h3 className="text-xl font-semibold text-win11-gray-900 tracking-tight">{title}</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center hover:bg-win11-gray-100 rounded-win11 transition-all duration-200 text-win11-gray-600 hover:text-win11-gray-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-160px)]">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="border-t border-win11-gray-200/50 px-6 py-4 glass-win11">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

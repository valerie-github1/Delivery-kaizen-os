import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface ToastProps {
  message: string | null;
}

export const Toast: React.FC<ToastProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-3 duration-200 pointer-events-none">
      <div className="bg-[#1F2426] text-white text-xs font-mono px-4 py-2.5 rounded-lg shadow-xl border border-white/10 flex items-center gap-2.5 max-w-md">
        <CheckCircle2 className="w-4 h-4 text-[#6DBB7A] shrink-0" />
        <span className="leading-snug">{message}</span>
      </div>
    </div>
  );
};

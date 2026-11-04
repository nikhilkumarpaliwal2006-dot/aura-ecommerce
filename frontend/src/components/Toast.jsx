import React from 'react';
import { useCart } from '../context/CartContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast() {
  const { toast } = useCart();
  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-sky-500 shrink-0" />
  };

  return (
    <aside aria-label="Notification" className="fixed bottom-6 right-6 z-50 animate-bounce-in">
      <div className="flex items-center gap-3 px-4 py-3 bg-zinc-900/95 text-white rounded-xl shadow-2xl border border-zinc-800 backdrop-blur-md max-w-md">
        {icons[toast.type] || icons.success}
        <span className="text-sm font-medium leading-snug">{toast.message}</span>
      </div>
    </aside>
  );
}

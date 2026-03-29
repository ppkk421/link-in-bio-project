import React, { useEffect } from "react";

export default function Modal({ open, title, children, onClose }) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-4 shadow-[0_18px_55px_rgba(0,0,0,0.35)] backdrop-blur">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="truncate text-base font-bold text-white/90">
              {title}
            </div>
            <div className="mt-0.5 text-xs text-white/50">
              Press Esc to close.
            </div>
          </div>
          <button
            type="button"
            className="rounded-xl border border-white/10 bg-white/0 px-3 py-1.5 text-xs font-semibold text-white/80 transition hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/70"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}


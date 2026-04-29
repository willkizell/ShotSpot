"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg";
}

const maxWidthClasses = { sm: "max-w-sm", md: "max-w-lg", lg: "max-w-2xl" };

export function Modal({ open, onClose, title, children, maxWidth = "md" }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div
        className={`relative w-full ${maxWidthClasses[maxWidth]} border-2 border-black bg-[#D7D7D7] shadow-xl`}
      >
        {title && (
          <div className="flex items-center justify-between border-b-2 border-black px-5 py-4">
            <h2 className="font-bold text-base">{title}</h2>
            <button
              onClick={onClose}
              className="hover:bg-black hover:text-[#D7D7D7] p-1 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        )}
        {!title && (
          <button
            onClick={onClose}
            className="absolute top-3 right-3 hover:bg-black hover:text-[#D7D7D7] p-1 transition-colors z-10"
          >
            <X size={16} />
          </button>
        )}
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

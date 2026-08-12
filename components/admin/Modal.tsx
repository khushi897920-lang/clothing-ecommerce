"use client";

import React, { useEffect } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center font-sans">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div 
        className="relative bg-white rounded-[12px] shadow-[0_8px_30px_rgb(0,0,0,0.12)] w-[90%] max-w-[440px] p-6 animate-fade-in-up"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between mb-4 border-b border-black/5 pb-4">
          <h2 className="text-[18px] font-bold text-[#2d2a26]">{title}</h2>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/5 text-[#a39e99] hover:text-[#2d2a26] transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>
        
        <div>
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}

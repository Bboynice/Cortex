'use client';
import { useModalStore } from '@/src/hooks/use-modal-store';
import { motion } from 'framer-motion';

interface SavePopUpProps {
    title: string;
    description: string;
    submitText: string;
    cancelText: string;
    onSubmit: () => void;
}

export default function SavePopUp({ title, description, submitText, cancelText }: SavePopUpProps) {
    const { isOpen, onClose, type, data } = useModalStore();

    if(!isOpen || type !== "save-code") return null;

    return (
      <span className="fixed left-1/2 top-1/2 bg-black/10 backdrop-blur-sm w-full h-full -translate-x-1/2 -translate-y-1/2 z-50 select-none">
        <span className="fixed left-1/2 top-1/2 w-auto h-[10em] -translate-x-1/2 -translate-y-1/2 bg-foreground flex items-center justify-center z-50 rounded-lg flex-col p-4 gap-4">
          <h1 className="text-white text-2xl font-bold">{title}</h1>
          <div className="flex flex-row justify-center w-full gap-8">
            <button className="bg-white text-primary px-4 py-2 rounded-md" onClick={onClose}>{submitText}</button>
            <button className="bg-white text-primary px-4 py-2 rounded-md" onClick={onClose}>{cancelText}</button>
          </div>
        </span>
      </span>
    )}

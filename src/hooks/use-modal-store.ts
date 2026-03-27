import { create } from 'zustand';

type ModalType = "save-code" | "user-settings" | "confirm-delete";

interface ModalStore {
  type: ModalType | null;
  isOpen: boolean;
  data: any; // Pass code or settings data here
  onOpen: (type: ModalType, data?: any) => void;
  onClose: () => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  type: null,
  isOpen: false,
  data: {},
  onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
  onClose: () => set({ isOpen: false, type: null, data: {} }),
}));
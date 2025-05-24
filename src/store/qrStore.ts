import { create } from 'zustand';

interface QrState {
  scannedData: string;
  setScannedData: (data: string) => void;
}

export const useQrStore = create<QrState>((set) => ({
  scannedData: '',
  setScannedData: (data) => set({ scannedData: data }),
}));
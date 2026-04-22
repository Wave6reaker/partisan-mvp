import { create } from 'zustand';

interface ProductState {
  selectedSize: string | null;
  selectedFabric: any | null; // using any since we don't have types generated yet
  selectedOrientation: 'left' | 'right';
  setSize: (size: string | null) => void;
  setFabric: (fabric: any | null) => void;
  setOrientation: (orientation: 'left' | 'right') => void;
}

export const useProductStore = create<ProductState>((set) => ({
  selectedSize: null,
  selectedFabric: null,
  selectedOrientation: 'left',
  setSize: (size) => set({ selectedSize: size }),
  setFabric: (fabric) => set({ selectedFabric: fabric }),
  setOrientation: (orientation) => set({ selectedOrientation: orientation }),
}));

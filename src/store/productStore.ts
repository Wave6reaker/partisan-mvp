import { create } from 'zustand';

interface Fabric {
  id: string;
  name: string;
  category: string;
  color: string;
  priceAdder: number;
  swatchUrl?: string;
}

interface ProductState {
  selectedSize: string | null;
  selectedFabric: Fabric | null;
  selectedOrientation: 'left' | 'right';
  setSize: (size: string | null) => void;
  setFabric: (fabric: Fabric | null) => void;
  setOrientation: (orientation: 'left' | 'right') => void;
  reset: () => void;
}

export const useProductStore = create<ProductState>((set) => ({
  selectedSize: null,
  selectedFabric: null,
  selectedOrientation: 'left',
  setSize: (size) => set({ selectedSize: size }),
  setFabric: (fabric) => set({ selectedFabric: fabric }),
  setOrientation: (orientation) => set({ selectedOrientation: orientation }),
  reset: () => set({ selectedSize: null, selectedFabric: null, selectedOrientation: 'left' }),
}));

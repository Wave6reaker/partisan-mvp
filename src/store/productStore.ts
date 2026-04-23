import { create } from 'zustand';

export interface Fabric {
  id: string;
  name: string;
  category: string;
  color: string;
  priceAdder: number;
  swatchUrl?: string;
}

export interface Filling {
  label: string;
  priceAdder: number;
}

interface ProductState {
  selectedSize: string | null;
  selectedFabric: Fabric | null;
  selectedFabricCategory: string | null;
  selectedFilling: Filling | null;
  selectedOrientation: 'left' | 'right';
  setSize: (size: string | null) => void;
  setFabric: (fabric: Fabric | null) => void;
  setFabricCategory: (category: string | null) => void;
  setFilling: (filling: Filling | null) => void;
  setOrientation: (orientation: 'left' | 'right') => void;
  reset: () => void;
}

export const useProductStore = create<ProductState>((set) => ({
  selectedSize: null,
  selectedFabric: null,
  selectedFabricCategory: null,
  selectedFilling: null,
  selectedOrientation: 'left',
  setSize: (size) => set({ selectedSize: size }),
  setFabric: (fabric) => set({ selectedFabric: fabric }),
  setFabricCategory: (category) => set({ selectedFabricCategory: category }),
  setFilling: (filling) => set({ selectedFilling: filling }),
  setOrientation: (orientation) => set({ selectedOrientation: orientation }),
  reset: () => set({
    selectedSize: null,
    selectedFabric: null,
    selectedFabricCategory: null,
    selectedFilling: null,
    selectedOrientation: 'left',
  }),
}));

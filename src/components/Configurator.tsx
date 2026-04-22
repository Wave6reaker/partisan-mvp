'use client';

import { useProductStore } from '@/store/productStore';
import { AlignLeft, AlignRight, Check } from 'lucide-react';
import { useEffect, useState } from 'react';

// Mock types
type Size = { label: string; dimensions: string; basePrice: number };
type Fabric = { id: string; name: string; category: string; color: string; priceAdder: number; image?: string };
type ProductMock = {
  name: string;
  sizes: Size[];
  fabrics: Fabric[];
};

export default function Configurator({ product }: { product: ProductMock }) {
  const { selectedSize, selectedFabric, selectedOrientation, setSize, setFabric, setOrientation } = useProductStore();
  
  // Set defaults
  useEffect(() => {
    if (!selectedSize && product.sizes.length > 0) setSize(product.sizes[0].label);
    if (!selectedFabric && product.fabrics.length > 0) setFabric(product.fabrics[0]);
  }, [product, selectedSize, selectedFabric, setSize, setFabric]);

  const activeSize = product.sizes.find(s => s.label === selectedSize) || product.sizes[0];
  const activeFabric = selectedFabric || product.fabrics[0];
  
  const totalPrice = (activeSize?.basePrice || 0) + (activeFabric?.priceAdder || 0);

  // Group fabrics by category
  const fabricsByCategory = product.fabrics.reduce((acc, fabric) => {
    if (!acc[fabric.category]) acc[fabric.category] = [];
    acc[fabric.category].push(fabric);
    return acc;
  }, {} as Record<string, Fabric[]>);

  return (
    <div className="flex flex-col gap-10">
      {/* Price Header */}
      <div className="pb-6 border-b border-border">
        <h1 className="font-serif text-4xl mb-4">{product.name}</h1>
        <div className="text-2xl font-medium">{totalPrice.toLocaleString('ru-RU')} ₽</div>
      </div>

      {/* Size Selector */}
      <div>
        <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Размер</h3>
        <div className="flex flex-col gap-2">
          {product.sizes.map((size) => (
            <button
              key={size.label}
              onClick={() => setSize(size.label)}
              className={`flex justify-between items-center p-4 border transition-colors ${
                selectedSize === size.label ? 'border-foreground bg-foreground text-background' : 'border-border hover:border-foreground/30'
              }`}
            >
              <span className="font-medium">{size.label}</span>
              <span className="text-sm opacity-80">{size.dimensions}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Orientation Selector */}
      <div>
        <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Угол</h3>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setOrientation('left')}
            className={`flex items-center justify-center gap-3 p-4 border transition-colors ${
              selectedOrientation === 'left' ? 'border-foreground bg-foreground text-background' : 'border-border hover:border-foreground/30'
            }`}
          >
            <AlignLeft size={20} strokeWidth={1.5} />
            <span>Левый</span>
          </button>
          <button
            onClick={() => setOrientation('right')}
            className={`flex items-center justify-center gap-3 p-4 border transition-colors ${
              selectedOrientation === 'right' ? 'border-foreground bg-foreground text-background' : 'border-border hover:border-foreground/30'
            }`}
          >
            <AlignRight size={20} strokeWidth={1.5} />
            <span>Правый</span>
          </button>
        </div>
      </div>

      {/* Fabric Selector */}
      <div>
        <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Материал обивки</h3>
        <div className="flex flex-col gap-6">
          {Object.entries(fabricsByCategory).map(([category, fabrics]) => (
            <div key={category}>
              <div className="text-xs font-medium mb-3">{category}</div>
              <div className="grid grid-cols-6 gap-2">
                {fabrics.map((fabric) => (
                  <button
                    key={fabric.id}
                    onClick={() => setFabric(fabric)}
                    title={`${fabric.name} (+${fabric.priceAdder} ₽)`}
                    className={`aspect-square rounded-none border relative focus:outline-none transition-all ${
                      selectedFabric?.id === fabric.id ? 'border-foreground border-2 p-0.5' : 'border-border hover:border-foreground/30'
                    }`}
                  >
                     <div 
                       className="w-full h-full" 
                       style={{ backgroundColor: fabric.color }}
                     />
                     {selectedFabric?.id === fabric.id && (
                       <div className="absolute inset-0 flex items-center justify-center bg-black/10 mix-blend-difference text-white">
                         <Check size={16} />
                       </div>
                     )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        {activeFabric && (
          <div className="mt-4 p-4 bg-muted/30 border border-border">
            <div className="flex justify-between items-center mb-1">
              <span className="font-medium text-sm">{activeFabric.name}</span>
              <span className="text-xs text-muted-foreground">+{activeFabric.priceAdder.toLocaleString('ru-RU')} ₽</span>
            </div>
            <div className="text-xs text-muted-foreground">Категория: {activeFabric.category}</div>
          </div>
        )}
      </div>

      {/* Order Form */}
      <div className="mt-8">
        <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Оформить предзаказ</h3>
        <form className="flex flex-col gap-4" onSubmit={(e) => { e.preventDefault(); alert("Заказ отправлен!"); }}>
          <input 
            type="text" 
            placeholder="Ваше имя" 
            className="w-full p-4 border border-border bg-background outline-none focus:border-foreground transition-colors placeholder:text-muted-foreground"
            required
          />
          <input 
            type="tel" 
            placeholder="Телефон" 
            className="w-full p-4 border border-border bg-background outline-none focus:border-foreground transition-colors placeholder:text-muted-foreground"
            required
          />
          <textarea 
            placeholder="Комментарий (опционально)" 
            className="w-full p-4 border border-border bg-background outline-none focus:border-foreground transition-colors resize-none placeholder:text-muted-foreground h-24"
          />
          <button 
            type="submit" 
            className="w-full py-5 bg-foreground text-background font-bold text-xs uppercase tracking-widest hover:bg-foreground/90 transition-colors mt-2"
          >
            Отправить заявку
          </button>
        </form>
      </div>
    </div>
  );
}

'use client';

import { useProductStore } from '@/store/productStore';
import { AlignLeft, AlignRight, Check } from 'lucide-react';
import { useEffect } from 'react';

type Size = { label: string; dimensions: string; basePrice: number };
type Fabric = { id: string; name: string; category: string; color: string; priceAdder: number; swatchUrl?: string };

type Product = {
  name: string;
  sizes: Size[];
  fabrics: Fabric[];
  hasOrientation?: boolean;
};

export default function Configurator({ product }: { product: Product }) {
  const { selectedSize, selectedFabric, selectedOrientation, setSize, setFabric, setOrientation, reset } =
    useProductStore();

  useEffect(() => {
    reset();
    if (product.sizes.length > 0) setSize(product.sizes[0].label);
    if (product.fabrics.length > 0) setFabric(product.fabrics[0]);
  }, [product.name]);

  const activeSize = product.sizes.find((s) => s.label === selectedSize) ?? product.sizes[0];
  const activeFabric = selectedFabric ?? product.fabrics[0];
  const totalPrice = (activeSize?.basePrice ?? 0) + (activeFabric?.priceAdder ?? 0);

  const fabricsByCategory = product.fabrics.reduce(
    (acc, fabric) => {
      if (!acc[fabric.category]) acc[fabric.category] = [];
      acc[fabric.category].push(fabric);
      return acc;
    },
    {} as Record<string, Fabric[]>
  );

  return (
    <div className="flex flex-col gap-10">
      {/* Header */}
      <div className="pb-6 border-b border-border">
        <h1 className="font-serif text-4xl mb-4">{product.name}</h1>
        <div className="text-2xl font-medium">{totalPrice.toLocaleString('ru-RU')} ₽</div>
      </div>

      {/* Size Selector */}
      {product.sizes.length > 0 && (
        <div>
          <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Размер</h3>
          <div className="flex flex-col gap-2">
            {product.sizes.map((size) => (
              <button
                key={size.label}
                onClick={() => setSize(size.label)}
                className={`flex justify-between items-center p-4 border transition-colors ${
                  selectedSize === size.label
                    ? 'border-foreground bg-foreground text-background'
                    : 'border-border hover:border-foreground/30'
                }`}
              >
                <span className="font-medium">{size.label}</span>
                <span className="text-sm opacity-80">{size.dimensions}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Orientation — only if product has it */}
      {product.hasOrientation && (
        <div>
          <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Угол</h3>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setOrientation('left')}
              className={`flex items-center justify-center gap-3 p-4 border transition-colors ${
                selectedOrientation === 'left'
                  ? 'border-foreground bg-foreground text-background'
                  : 'border-border hover:border-foreground/30'
              }`}
            >
              <AlignLeft size={20} strokeWidth={1.5} />
              <span>Левый</span>
            </button>
            <button
              onClick={() => setOrientation('right')}
              className={`flex items-center justify-center gap-3 p-4 border transition-colors ${
                selectedOrientation === 'right'
                  ? 'border-foreground bg-foreground text-background'
                  : 'border-border hover:border-foreground/30'
              }`}
            >
              <AlignRight size={20} strokeWidth={1.5} />
              <span>Правый</span>
            </button>
          </div>
        </div>
      )}

      {/* Fabric Selector */}
      {product.fabrics.length > 0 && (
        <div>
          <div className="flex items-baseline justify-between mb-4">
            <h3 className="text-xs uppercase tracking-widest text-muted-foreground">Ткань</h3>
            {activeFabric && (
              <span className="text-sm font-medium">
                {activeFabric.name}
                {activeFabric.priceAdder > 0 && (
                  <span className="text-muted-foreground font-normal ml-2">
                    +{activeFabric.priceAdder.toLocaleString('ru-RU')} ₽
                  </span>
                )}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-6">
            {Object.entries(fabricsByCategory).map(([category, fabrics]) => (
              <div key={category}>
                <div className="text-xs text-muted-foreground mb-3">{category}</div>
                <div className="flex flex-wrap gap-2">
                  {fabrics.map((fabric) => {
                    const isActive = (selectedFabric?.id ?? product.fabrics[0]?.id) === fabric.id;
                    return (
                      <button
                        key={fabric.id}
                        onClick={() => setFabric(fabric)}
                        title={`${fabric.name}${fabric.priceAdder > 0 ? ` +${fabric.priceAdder.toLocaleString('ru-RU')} ₽` : ''}`}
                        className={`w-10 h-10 relative border-2 transition-all focus:outline-none ${
                          isActive ? 'border-foreground' : 'border-transparent hover:border-foreground/30'
                        }`}
                      >
                        {fabric.swatchUrl ? (
                          <img src={fabric.swatchUrl} alt={fabric.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full" style={{ backgroundColor: fabric.color }} />
                        )}
                        {isActive && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Check size={14} className="text-white drop-shadow-[0_0_2px_rgba(0,0,0,0.8)]" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Fabric price breakdown */}
          {activeFabric && activeSize && (
            <div className="mt-4 pt-4 border-t border-border text-xs text-muted-foreground flex flex-col gap-1">
              <div className="flex justify-between">
                <span>Базовая цена ({activeSize.label})</span>
                <span>{activeSize.basePrice.toLocaleString('ru-RU')} ₽</span>
              </div>
              {activeFabric.priceAdder > 0 && (
                <div className="flex justify-between">
                  <span>Ткань ({activeFabric.name})</span>
                  <span>+{activeFabric.priceAdder.toLocaleString('ru-RU')} ₽</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Order Form */}
      <div className="mt-4">
        <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Оформить предзаказ</h3>
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            alert('Заказ отправлен!');
          }}
        >
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

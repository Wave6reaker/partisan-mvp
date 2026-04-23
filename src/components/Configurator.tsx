'use client';

import { useProductStore, type Fabric, type Filling } from '@/store/productStore';
import { AlignLeft, AlignRight, Check, ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

type Size = { label: string; dimensions: string; basePrice: number };

type Product = {
  name: string;
  sizes: Size[];
  fabrics: Fabric[];
  fillings: Filling[];
  hasOrientation?: boolean;
};

export default function Configurator({ product }: { product: Product }) {
  const {
    selectedSize, selectedFabric, selectedFabricCategory,
    selectedFilling, selectedOrientation,
    setSize, setFabric, setFabricCategory, setFilling, setOrientation, reset,
  } = useProductStore();

  // Derive unique categories from available fabrics, sorted by cat number
  const categories = Array.from(new Set(product.fabrics.map((f) => f.category))).sort((a, b) => {
    const n = (s: string) => parseInt(s.replace('cat', '')) || 0;
    return n(a) - n(b);
  });

  // Category label: "Категория N"
  const catLabel = (cat: string) => {
    const n = cat.replace('cat', '');
    return `Категория ${n}`;
  };

  // Price adder for a category = min priceAdder of fabrics in it
  const catPriceAdder = (cat: string) => {
    const fabrics = product.fabrics.filter((f) => f.category === cat);
    return fabrics.length > 0 ? Math.min(...fabrics.map((f) => f.priceAdder)) : 0;
  };

  const activeCategory = selectedFabricCategory ?? categories[0] ?? null;
  const fabricsInCategory = product.fabrics.filter((f) => f.category === activeCategory);

  // Init defaults on product change
  useEffect(() => {
    reset();
    if (product.sizes.length > 0) setSize(product.sizes[0].label);
    if (categories.length > 0) {
      const firstCat = categories[0];
      setFabricCategory(firstCat);
      const firstFabric = product.fabrics.find((f) => f.category === firstCat) ?? null;
      setFabric(firstFabric);
    }
    if (product.fillings.length > 0) setFilling(product.fillings[0]);
  }, [product.name]);

  // When category changes, auto-select first fabric in that category
  const handleCategoryChange = (cat: string) => {
    setFabricCategory(cat);
    const first = product.fabrics.find((f) => f.category === cat) ?? null;
    setFabric(first);
  };

  const activeSize = product.sizes.find((s) => s.label === selectedSize) ?? product.sizes[0];
  const activeFabric = selectedFabric ?? fabricsInCategory[0] ?? null;
  const activeFilling = selectedFilling ?? product.fillings[0] ?? null;

  const totalPrice =
    (activeSize?.basePrice ?? 0) +
    (activeFabric?.priceAdder ?? 0) +
    (activeFilling?.priceAdder ?? 0);

  const [catOpen, setCatOpen] = useState(false);
  const catRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (catRef.current && !catRef.current.contains(e.target as Node)) setCatOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

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
                className={`flex justify-between items-center p-4 border transition-colors text-left ${
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

      {/* Orientation */}
      {product.hasOrientation && (
        <div>
          <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Угол</h3>
          <div className="grid grid-cols-2 gap-2">
            {(['left', 'right'] as const).map((side) => (
              <button
                key={side}
                onClick={() => setOrientation(side)}
                className={`flex items-center justify-center gap-3 p-4 border transition-colors ${
                  selectedOrientation === side
                    ? 'border-foreground bg-foreground text-background'
                    : 'border-border hover:border-foreground/30'
                }`}
              >
                {side === 'left' ? <AlignLeft size={20} strokeWidth={1.5} /> : <AlignRight size={20} strokeWidth={1.5} />}
                <span>{side === 'left' ? 'Левый' : 'Правый'}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Filling Selector */}
      {product.fillings.length > 0 && (
        <div>
          <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Наполнение</h3>
          <div className="flex flex-col gap-2">
            {product.fillings.map((filling) => {
              const isActive = (activeFilling?.label) === filling.label;
              return (
                <button
                  key={filling.label}
                  onClick={() => setFilling(filling)}
                  className={`flex justify-between items-center p-4 border transition-colors text-left ${
                    isActive
                      ? 'border-foreground bg-foreground text-background'
                      : 'border-border hover:border-foreground/30'
                  }`}
                >
                  <span className="font-medium">{filling.label}</span>
                  <span className="text-sm opacity-80">
                    {filling.priceAdder === 0 ? '—' : `+${filling.priceAdder.toLocaleString('ru-RU')} ₽`}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Fabric Section */}
      {product.fabrics.length > 0 && (
        <div>
          <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Категория обивки</h3>

          {/* Category Dropdown */}
          <div className="relative mb-4" ref={catRef}>
            <button
              onClick={() => setCatOpen((v) => !v)}
              className="w-full flex justify-between items-center p-4 border border-border hover:border-foreground/30 transition-colors bg-background text-left"
            >
              <span className="font-medium">
                {activeCategory ? catLabel(activeCategory) : 'Выберите категорию'}
              </span>
              <div className="flex items-center gap-3 shrink-0">
                {activeCategory && (
                  <span className="text-sm text-muted-foreground">
                    {catPriceAdder(activeCategory) === 0
                      ? 'включено'
                      : `+${catPriceAdder(activeCategory).toLocaleString('ru-RU')} ₽`}
                  </span>
                )}
                <ChevronDown size={16} className={`transition-transform ${catOpen ? 'rotate-180' : ''}`} />
              </div>
            </button>

            {catOpen && (
              <div className="absolute z-20 top-full left-0 right-0 border border-border border-t-0 bg-background shadow-lg max-h-72 overflow-y-auto">
                {categories.map((cat) => {
                  const adder = catPriceAdder(cat);
                  return (
                    <button
                      key={cat}
                      onClick={() => { handleCategoryChange(cat); setCatOpen(false); }}
                      className={`w-full flex justify-between items-center px-4 py-3 text-left hover:bg-muted/40 transition-colors border-b border-border/40 last:border-0 ${
                        activeCategory === cat ? 'bg-muted/40 font-medium' : ''
                      }`}
                    >
                      <span>{catLabel(cat)}</span>
                      <span className="text-sm text-muted-foreground">
                        {adder === 0 ? 'включено' : `+${adder.toLocaleString('ru-RU')} ₽`}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Swatches for selected category */}
          {fabricsInCategory.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {fabricsInCategory.map((fabric) => {
                const isActive = activeFabric?.id === fabric.id;
                return (
                  <button
                    key={fabric.id}
                    onClick={() => setFabric(fabric)}
                    title={fabric.name}
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
          )}

          {/* Selected fabric name */}
          {activeFabric && (
            <div className="mt-3 text-sm text-muted-foreground">{activeFabric.name}</div>
          )}
        </div>
      )}

      {/* Price breakdown */}
      {activeSize && (
        <div className="pt-4 border-t border-border text-xs text-muted-foreground flex flex-col gap-1.5">
          <div className="flex justify-between">
            <span>Базовая цена ({activeSize.label})</span>
            <span>{activeSize.basePrice.toLocaleString('ru-RU')} ₽</span>
          </div>
          {activeFabric && activeFabric.priceAdder > 0 && (
            <div className="flex justify-between">
              <span>Обивка ({catLabel(activeFabric.category)})</span>
              <span>+{activeFabric.priceAdder.toLocaleString('ru-RU')} ₽</span>
            </div>
          )}
          {activeFilling && activeFilling.priceAdder > 0 && (
            <div className="flex justify-between">
              <span>Наполнение ({activeFilling.label})</span>
              <span>+{activeFilling.priceAdder.toLocaleString('ru-RU')} ₽</span>
            </div>
          )}
          <div className="flex justify-between font-medium text-foreground pt-1 border-t border-border/50 mt-1">
            <span>Итого</span>
            <span>{totalPrice.toLocaleString('ru-RU')} ₽</span>
          </div>
        </div>
      )}

      {/* Order Form */}
      <div>
        <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Оформить предзаказ</h3>
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => { e.preventDefault(); alert('Заказ отправлен!'); }}
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

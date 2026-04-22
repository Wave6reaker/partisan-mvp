import Configurator from '@/components/Configurator';
import Image from 'next/image';

// Mock fetching data
async function getProduct(slug: string) {
  // In real app, fetch from Payload CMS
  return {
    id: "laspi_corner_258cm",
    name: "Диван Ласпи угловой 258 см",
    slug,
    category: "sofas",
    description: "Модульный диван Ласпи 258 см. Современный дизайн. Обивка и размеры на заказ. Кастомизация по размерам.",
    images: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=80",
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=1200&q=80"
    ],
    sizes: [
      { label: "Угловой (Глубина 98 см)", dimensions: "Д258 х Г98–238 х В68 см", basePrice: 195000 },
      { label: "Угловой (Глубина 108 см)", dimensions: "Д258 х Г108–238 х В68 см", basePrice: 210000 }
    ],
    fabrics: [
      { id: "f1", name: "Категория 1 (Базовая)", category: "Категория 1", color: "#f5f5f0", priceAdder: 0 },
      { id: "f2", name: "Категория 2 (Велюр)", category: "Категория 2", color: "#4a4a4a", priceAdder: 15000 },
      { id: "f3", name: "Категория 3 (Букле)", category: "Категория 3", color: "#e8e5df", priceAdder: 30000 },
      { id: "f4", name: "Категория 4 (Премиум)", category: "Категория 4", color: "#1a1c23", priceAdder: 45000 },
    ],
    materials: {
      seat: "Высокоэластичная пена марки HR (плотность 35 кг/м³), верхние плоскости — высокоупругая пена HL",
      frame: "Берёзовая фанера, пружины zigzag",
      legs: "Пластик с прорезиненным основанием"
    },
    warranty: "2 года на каркас и механизмы",
    delivery: "Более 200 вариантов обивки. Доставка по Москве - рассчитывается индивидуально."
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);

  return (
    <div className="pt-8">
      <div className="max-w-[1920px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_500px] gap-16 items-start">
        {/* Left Side: Gallery */}
        <div className="flex flex-col gap-4 sticky top-[88px]">
          {product.images.map((img, idx) => (
            <div key={idx} className="aspect-[4/3] bg-neutral-100 relative w-full overflow-hidden">
              <img 
                src={img} 
                alt={`${product.name} галерея ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        {/* Right Side: Configurator */}
        <div className="pt-4 lg:pb-32">
          <Configurator product={product} />
        </div>
      </div>

      {/* Info Sections */}
      <div className="max-w-[1920px] mx-auto mt-24">
        <div className="flex flex-col border-t border-border">
          
          <div className="grid grid-cols-1 md:grid-cols-3 py-16 px-6 border-b border-border items-start gap-8">
            <h2 className="font-serif text-3xl md:text-5xl">Описание</h2>
            <div className="md:col-span-2 text-muted-foreground leading-relaxed text-lg max-w-3xl">
              {product.description}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 py-16 px-6 border-b border-border items-start gap-8">
            <h2 className="font-serif text-3xl md:text-5xl">Материалы</h2>
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8 text-sm">
              <div>
                <dt className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Сиденье и спинка</dt>
                <dd className="leading-relaxed">{product.materials.seat}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Каркас</dt>
                <dd className="leading-relaxed">{product.materials.frame}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Опоры</dt>
                <dd className="leading-relaxed">{product.materials.legs}</dd>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 py-16 px-6 border-b border-border items-start gap-8">
            <h2 className="font-serif text-3xl md:text-5xl">Доставка</h2>
            <div className="md:col-span-2 text-muted-foreground leading-relaxed max-w-3xl">
              <p>{product.delivery}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 py-16 px-6 border-b border-border items-start gap-8">
            <h2 className="font-serif text-3xl md:text-5xl">Гарантия</h2>
            <div className="md:col-span-2 text-muted-foreground leading-relaxed max-w-3xl">
              <p>{product.warranty}</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

import Configurator from '@/components/Configurator';
import { notFound } from 'next/navigation';

async function getProduct(slug: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/products?where[slug][equals]=${slug}&depth=2&limit=1`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.docs?.[0] || null;
  } catch {
    return null;
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) notFound();

  const images: string[] = product.defaultImages
    ?.map((item: any) => item.image?.url)
    .filter(Boolean) || [];

  const fabrics = product.availableFabrics?.map((fabric: any) => ({
    id: fabric.id,
    name: fabric.name,
    category: fabric.category,
    color: fabric.color || '#cccccc',
    priceAdder: fabric.priceAdder || 0,
  })) || [];

  const configuratorProduct = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description || '',
    sizes: product.sizes || [],
    fabrics,
    materials: {
      seat: product.materialSeat || '',
      frame: product.materialFrame || '',
      legs: product.materialLegs || '',
    },
    warranty: product.warranty || '',
    delivery: product.leadTime || '',
  };

  return (
    <div className="pt-8">
      <div className="max-w-[1920px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_500px] gap-16 items-start">
        {/* Left Side: Gallery */}
        <div className="flex flex-col gap-4 sticky top-[88px]">
          {images.length > 0 ? images.map((img, idx) => (
            <div key={idx} className="aspect-4/3 bg-neutral-100 relative w-full overflow-hidden">
              <img
                src={img}
                alt={`${product.name} галерея ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          )) : (
            <div className="aspect-4/3 bg-neutral-100 flex items-center justify-center text-muted-foreground text-sm">
              Фото не добавлено
            </div>
          )}
        </div>

        {/* Right Side: Configurator */}
        <div className="pt-4 lg:pb-32">
          <Configurator product={configuratorProduct} />
        </div>
      </div>

      {/* Info Sections */}
      <div className="max-w-[1920px] mx-auto mt-24">
        <div className="flex flex-col border-t border-border">

          {product.description && (
            <div className="grid grid-cols-1 md:grid-cols-3 py-16 px-6 border-b border-border items-start gap-8">
              <h2 className="font-serif text-3xl md:text-5xl">Описание</h2>
              <div className="md:col-span-2 text-muted-foreground leading-relaxed text-lg max-w-3xl">
                {product.description}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 py-16 px-6 border-b border-border items-start gap-8">
            <h2 className="font-serif text-3xl md:text-5xl">Материалы</h2>
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8 text-sm">
              {product.materialSeat && (
                <div>
                  <dt className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Сиденье и спинка</dt>
                  <dd className="leading-relaxed">{product.materialSeat}</dd>
                </div>
              )}
              {product.materialFrame && (
                <div>
                  <dt className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Каркас</dt>
                  <dd className="leading-relaxed">{product.materialFrame}</dd>
                </div>
              )}
              {product.materialLegs && (
                <div>
                  <dt className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Опоры</dt>
                  <dd className="leading-relaxed">{product.materialLegs}</dd>
                </div>
              )}
            </div>
          </div>

          {product.leadTime && (
            <div className="grid grid-cols-1 md:grid-cols-3 py-16 px-6 border-b border-border items-start gap-8">
              <h2 className="font-serif text-3xl md:text-5xl">Доставка</h2>
              <div className="md:col-span-2 text-muted-foreground leading-relaxed max-w-3xl">
                <p>{product.leadTime}</p>
              </div>
            </div>
          )}

          {product.warranty && (
            <div className="grid grid-cols-1 md:grid-cols-3 py-16 px-6 border-b border-border items-start gap-8">
              <h2 className="font-serif text-3xl md:text-5xl">Гарантия</h2>
              <div className="md:col-span-2 text-muted-foreground leading-relaxed max-w-3xl">
                <p>{product.warranty}</p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

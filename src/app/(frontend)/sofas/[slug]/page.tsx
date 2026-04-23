import Configurator from '@/components/Configurator';
import ProductGallery from '@/components/ProductGallery';
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

  const defaultImages: string[] = product.defaultImages
    ?.map((item: any) => item.image?.url)
    .filter(Boolean) ?? [];

  const renders = product.renders
    ?.filter((r: any) => r.fabric?.id && r.image?.url)
    .map((r: any) => ({ fabric: { id: r.fabric.id }, image: { url: r.image.url } })) ?? [];

  const fabrics = product.availableFabrics?.map((fabric: any) => ({
    id: fabric.id,
    name: fabric.name,
    category: fabric.category,
    color: fabric.color || '#cccccc',
    priceAdder: fabric.priceAdder || 0,
    swatchUrl: fabric.swatch?.url || null,
  })) ?? [];

  const configuratorProduct = {
    name: product.name,
    sizes: product.sizes ?? [],
    fabrics,
    hasOrientation: product.hasOrientation ?? false,
  };

  // Info rows: only render if field has value
  const infoRows = [
    { label: 'Описание', value: product.description },
    { label: 'Сиденье и спинка', value: product.materialSeat },
    { label: 'Каркас', value: product.materialFrame },
    { label: 'Опоры', value: product.materialLegs },
    { label: 'Срок изготовления', value: product.leadTime },
    { label: 'Гарантия', value: product.warranty },
  ].filter((row) => row.value);

  return (
    <div className="pt-8">
      <div className="max-w-[1920px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_500px] gap-16 items-start">
        {/* Left: Reactive gallery */}
        <div className="sticky top-[88px]">
          <ProductGallery
            defaultImages={defaultImages}
            renders={renders}
            productName={product.name}
          />
        </div>

        {/* Right: Configurator */}
        <div className="pt-4 lg:pb-32">
          <Configurator product={configuratorProduct} />
        </div>
      </div>

      {/* Info section */}
      {infoRows.length > 0 && (
        <div className="max-w-[1920px] mx-auto mt-24 border-t border-border">
          {infoRows.map((row) => (
            <div
              key={row.label}
              className="grid grid-cols-[200px_1fr] md:grid-cols-[280px_1fr] py-8 px-6 border-b border-border gap-8 items-start"
            >
              <dt className="text-xs uppercase tracking-widest text-muted-foreground pt-1">{row.label}</dt>
              <dd className="text-sm leading-relaxed">{row.value}</dd>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import Configurator from '@/components/Configurator';
import ProductGallery from '@/components/ProductGallery';
import { lexicalToHtml } from '@/lib/lexicalToHtml';
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

const DEFAULT_DELIVERY = `Вы можете приобрести нашу мебель, находясь в любом городе мира. По Москве и Подмосковью мы доставляем своей службой доставки и сборки. Мы придерживаемся очень высокого качества сервиса и поэтому настоятельно рекомендуем использовать нашу службу. Также вы можете забрать заказ самостоятельно с нашего склада в г. Химки (1 км от МКАД).

Если вы из другого города или страны, мы оказываем все необходимые для этого услуги. Мы тщательно подготовим груз к отправке и доставим его до транспортной компании. Мы также оформим все необходимые документы для такой отправки. Вам останется только принять груз у себя дома. В этом случае мебель надо будет собрать самостоятельно или при помощи ваших мастеров.`;

const DEFAULT_RETURN = `С момента доставки у вас есть 14 дней на простой обмен или возврат. В течение этого времени если вы решите, что мебель не подходит, сообщите нам об этом. Мы приедем, заберём мебель и вернем деньги за вычетом стоимости первоначальной доставки и забора. Если вдруг товар оказался бракованным, то стоимость доставки и забора также возмещаются.

Пожалуйста обратите внимание, что в этом случае мы не сможем принять к возврату мебель без оригинальной упаковки. Также мебель должна быть без повреждений, царапин и сколов.

Но мы вас уверяем, что вы останетесь довольны и мебелью, и сервисом.`;

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] py-8 px-6 border-b border-border gap-4 md:gap-8 items-start">
      <dt className="text-xs uppercase tracking-widest text-muted-foreground pt-1 shrink-0">{label}</dt>
      <dd className="text-sm leading-relaxed text-foreground">{children}</dd>
    </div>
  );
}

function RichContent({ html, fallback }: { html: string; fallback?: string }) {
  const content = html || (fallback ? fallback.split('\n\n').map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('') : '');
  if (!content) return null;
  return (
    <div
      className="prose prose-sm max-w-none [&_p]:mb-3 [&_p:last-child]:mb-0 [&_a]:underline [&_a]:hover:opacity-70"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
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

  const fillings = product.fillings?.map((f: any) => ({
    label: f.label,
    priceAdder: f.priceAdder || 0,
  })) ?? [];

  const configuratorProduct = {
    name: product.name,
    sizes: product.sizes ?? [],
    fabrics,
    fillings,
    hasOrientation: product.hasOrientation ?? false,
  };

  const deliveryHtml = lexicalToHtml(product.infoDelivery);
  const returnHtml = lexicalToHtml(product.infoReturn);
  const materialsHtml = lexicalToHtml(product.infoMaterials);
  const assemblyHtml = lexicalToHtml(product.infoAssembly);
  const sizesExtraHtml = lexicalToHtml(product.infoSizesText);

  return (
    <div className="pt-8">
      <div className="max-w-[1920px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_500px] gap-16 items-start">
        <div className="sticky top-[88px]">
          <ProductGallery defaultImages={defaultImages} renders={renders} productName={product.name} />
        </div>
        <div className="pt-4 lg:pb-32">
          <Configurator product={configuratorProduct} />
        </div>
      </div>

      {/* Подробная информация */}
      <div className="max-w-[1920px] mx-auto mt-24">
        <h2 className="font-serif text-3xl px-6 pb-8">Подробная информация</h2>
        <dl className="border-t border-border">

          {/* Размеры */}
          {(product.sizes?.length > 0 || sizesExtraHtml) && (
            <InfoRow label="Размеры">
              {product.sizes?.length > 0 && (
                <ul className="flex flex-col gap-1 mb-3">
                  {product.sizes.map((s: any) => (
                    <li key={s.id} className="flex gap-2">
                      <span className="font-medium">{s.label}</span>
                      {s.dimensions && <span className="text-muted-foreground">— {s.dimensions}</span>}
                    </li>
                  ))}
                </ul>
              )}
              {sizesExtraHtml && <RichContent html={sizesExtraHtml} />}
            </InfoRow>
          )}

          {/* Материалы */}
          {(materialsHtml || product.materialSeat || product.materialFrame || product.materialLegs) && (
            <InfoRow label="Материалы">
              {materialsHtml ? (
                <RichContent html={materialsHtml} />
              ) : (
                <ul className="flex flex-col gap-1">
                  {product.materialSeat && <li>Сиденье — {product.materialSeat}</li>}
                  {product.materialFrame && <li>Каркас — {product.materialFrame}</li>}
                  {product.materialLegs && <li>Опоры — {product.materialLegs}</li>}
                </ul>
              )}
            </InfoRow>
          )}

          {/* Описание */}
          {product.description && (
            <InfoRow label="Описание">
              <p>{product.description}</p>
            </InfoRow>
          )}

          {/* Сборка */}
          {assemblyHtml && (
            <InfoRow label="Сборка">
              <RichContent html={assemblyHtml} />
            </InfoRow>
          )}

          {/* Гарантия */}
          {product.warranty && (
            <InfoRow label="Гарантия">
              <p>{product.warranty}</p>
            </InfoRow>
          )}

          {/* 3D файлы */}
          {product.info3dFilesUrl && (
            <InfoRow label="3D файлы">
              <a
                href={product.info3dFilesUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:opacity-70 transition-opacity"
              >
                {product.info3dFilesLabel || 'Скачать'}
              </a>
            </InfoRow>
          )}

          {/* Доставка */}
          <InfoRow label="Доставка по России и миру">
            <RichContent html={deliveryHtml} fallback={DEFAULT_DELIVERY} />
            {product.infoDeliveryPricingUrl && (
              <a
                href={product.infoDeliveryPricingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3 underline hover:opacity-70 transition-opacity text-sm"
              >
                {product.infoDeliveryPricingLabel || 'Информация о стоимости доставки и сборки'}
              </a>
            )}
          </InfoRow>

          {/* Обмен и возврат */}
          <InfoRow label="Обмен и возврат">
            <RichContent html={returnHtml} fallback={DEFAULT_RETURN} />
          </InfoRow>

        </dl>
      </div>
    </div>
  );
}

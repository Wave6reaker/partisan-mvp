'use client';

import { useProductStore } from '@/store/productStore';

type Render = {
  fabric: { id: string };
  image: { url: string };
};

type Props = {
  defaultImages: string[];
  renders: Render[];
  productName: string;
};

export default function ProductGallery({ defaultImages, renders, productName }: Props) {
  const selectedFabric = useProductStore((s) => s.selectedFabric);

  // Find render for selected fabric
  const fabricRender = selectedFabric
    ? renders.find((r) => r.fabric?.id === selectedFabric.id)
    : null;

  const images = fabricRender
    ? [fabricRender.image.url, ...defaultImages.filter((img) => img !== fabricRender.image.url)]
    : defaultImages;

  if (images.length === 0) {
    return (
      <div className="aspect-4/3 bg-neutral-100 flex items-center justify-center text-muted-foreground text-sm">
        Фото не добавлено
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {images.map((img, idx) => (
        <div key={idx} className="aspect-4/3 bg-neutral-100 relative w-full overflow-hidden">
          <img
            src={img}
            alt={`${productName} ${idx + 1}`}
            className="w-full h-full object-cover transition-opacity duration-300"
          />
        </div>
      ))}
    </div>
  );
}

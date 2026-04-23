import Link from 'next/link';

async function getProducts() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/products?limit=10&depth=1`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.docs || [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const products = await getProducts();

  return (
    <div>
      {/* Full-bleed hero */}
      <section className="h-[80vh] bg-[#111] text-white flex flex-col justify-center items-center text-center px-6 relative overflow-hidden">
        <h1 className="font-serif text-6xl md:text-8xl mb-6 relative z-10 leading-none">
          Чистая <br /> форма
        </h1>
        <p className="text-neutral-400 max-w-md mx-auto mb-10 text-sm tracking-wide relative z-10">
          Коллекция минималистичной мебели для интерьеров, свободных от лишнего.
        </p>
        <Link
          href="/catalogue"
          className="bg-white text-[#111] px-8 py-4 text-xs uppercase tracking-widest font-bold hover:bg-neutral-200 transition-colors z-10"
        >
          Смотреть каталог
        </Link>
      </section>

      {/* Features grid */}
      <section className="bg-border p-[1px]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[1px]">
          <div className="bg-background p-16 text-center">
            <h3 className="font-serif text-2xl mb-4">Материалы</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Отборная древесина, натуральный камень и экологичные ткани высших категорий.
            </p>
          </div>
          <div className="bg-background p-16 text-center">
            <h3 className="font-serif text-2xl mb-4">Ручная сборка</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Каждый предмет мебели собирается вручную на нашем производстве с особым вниманием к деталям.
            </p>
          </div>
          <div className="bg-background p-16 text-center">
            <h3 className="font-serif text-2xl mb-4">Кастомизация</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Адаптация размеров и огромный выбор отделочных материалов под ваш уникальный проект.
            </p>
          </div>
        </div>
      </section>

      {/* Product catalog grid */}
      <section className="py-24 px-6 md:px-12">
        <div className="flex justify-between items-end mb-12">
          <h2 className="font-serif text-4xl">Новинки</h2>
          <Link href="/catalogue" className="text-xs uppercase tracking-widest hover:text-muted-foreground border-b border-foreground pb-1">
            Все товары
          </Link>
        </div>

        {products.length === 0 ? (
          <p className="text-muted-foreground text-sm">Товары пока не добавлены.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.map((product: any) => {
              const image = product.defaultImages?.[0]?.image?.url;
              const price = product.sizes?.[0]?.basePrice;
              return (
                <Link href={`/sofas/${product.slug}`} key={product.id} className="group block cursor-pointer">
                  <div className="aspect-[4/5] bg-neutral-100 overflow-hidden mb-4 relative">
                    {image && (
                      <img
                        src={image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out grayscale hover:grayscale-0"
                      />
                    )}
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-serif text-xl mb-1">{product.name}</h3>
                      <p className="text-xs text-muted-foreground">{product.shortDescription}</p>
                    </div>
                    {price && (
                      <div className="text-sm font-medium whitespace-nowrap ml-4">
                        от {price.toLocaleString('ru-RU')} ₽
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

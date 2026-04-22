import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import '../globals.css';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';

const inter = Inter({ subsets: ['latin', 'cyrillic'], variable: '--font-sans' });
const playfair = Playfair_Display({ subsets: ['latin', 'cyrillic'], variable: '--font-serif' });

export const metadata: Metadata = {
  title: 'Partisan — Минималистичная мебель',
  description: 'Эстетика и комфорт в каждой детали. Дизайнерская мебель для вашего дома.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased bg-background text-foreground`}>
        <header className="h-[56px] border-b border-border flex items-center justify-between px-6 sticky top-0 bg-background/80 backdrop-blur-md z-50">
          <Link href="/" className="font-serif text-xl uppercase tracking-widest font-black">
            Partisan
          </Link>
          <nav className="flex gap-8 text-xs uppercase tracking-widest font-medium">
            <Link href="/catalogue/sofas" className="hover:text-muted-foreground transition-colors">Диваны</Link>
            <Link href="/catalogue/beds" className="hover:text-muted-foreground transition-colors">Кровати</Link>
            <Link href="/catalogue/tables" className="hover:text-muted-foreground transition-colors">Столы</Link>
          </nav>
          <button className="flex items-center gap-2 hover:text-muted-foreground transition-colors text-xs uppercase tracking-widest">
            <ShoppingBag size={16} strokeWidth={1.5} />
            Корзина
          </button>
        </header>

        <main className="min-h-[calc(100vh-56px)]">
          {children}
        </main>

        <footer className="bg-[#111] text-white py-16 px-6 mt-20">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-serif text-2xl uppercase tracking-widest mb-6">Partisan</h3>
              <p className="text-sm text-neutral-400">Минимализм и чистота формы.</p>
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-widest mb-4 text-neutral-500">Каталог</h4>
              <ul className="flex flex-col gap-2 text-sm text-neutral-300">
                <li><Link href="/catalogue/sofas">Диваны</Link></li>
                <li><Link href="/catalogue/beds">Кровати</Link></li>
                <li><Link href="/catalogue/tables">Столы</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-widest mb-4 text-neutral-500">Информация</h4>
              <ul className="flex flex-col gap-2 text-sm text-neutral-300">
                <li><Link href="/about">О нас</Link></li>
                <li><Link href="/delivery">Доставка и оплата</Link></li>
                <li><Link href="/warranty">Гарантия</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-widest mb-4 text-neutral-500">Контакты</h4>
              <ul className="flex flex-col gap-2 text-sm text-neutral-300">
                <li>hello@partisan-furniture.ru</li>
                <li>+7 (495) 000-00-00</li>
              </ul>
            </div>
          </div>
          <div className="mt-16 pt-8 border-t border-neutral-800 text-xs text-neutral-500 uppercase tracking-widest flex justify-between">
            <span>© 2026 Partisan Furniture</span>
            <Link href="/admin">Вход для администратора</Link>
          </div>
        </footer>
      </body>
    </html>
  );
}

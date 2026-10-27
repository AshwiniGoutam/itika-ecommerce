import { Unbounded, Instrument_Sans } from 'next/font/google';
import './globals.css';

const display = Unbounded({ subsets: ['latin'], variable: '--font-display', weight: ['300', '400', '500', '600'] });
const body = Instrument_Sans({ subsets: ['latin'], variable: '--font-body' });

export const metadata = {
  title: 'Itika E-Commerce',
  description: 'E-commerce growth partner for Amazon, Flipkart, Meesho, Myntra and AJIO sellers.',
};

export const viewport = { themeColor: '#FFFFFF' };

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}

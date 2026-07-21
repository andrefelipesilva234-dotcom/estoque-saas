import "./globals.css";
import { Analytics } from '@vercel/analytics/next';

export const metadata = {
  title: "Estoque Fácil",
  description: "Sistema de controle de estoque",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
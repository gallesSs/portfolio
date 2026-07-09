import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Портфолио — коридор",
  description: "Портфолио, по которому можно пройтись. Или прочитать за тридцать секунд.",
};

export const viewport: Viewport = {
  themeColor: "#0b0d11",
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}

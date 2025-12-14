import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cinema 22 - Dashboard",
  description:
    "Plataforma de gestión y visualización del catálogo de Cinema 22. Explora nuestra colección de cine de autor, películas clásicas y funciones especiales.",
  keywords: [
    "cine",
    "películas",
    "cinema 22",
    "cine de autor",
    "catálogo",
    "funciones",
  ],
  authors: [{ name: "Cinema 22" }],
  openGraph: {
    title: "Cinema 22 - Dashboard",
    description:
      "Explora nuestro catálogo de cine de autor y películas especiales",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

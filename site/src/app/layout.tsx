import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "Corbo — Claus Åne Sørbøe Solbakken",
  description: "Personal professional homepage",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="no" className="dark">
      <body className={`${spaceGrotesk.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Poke-clone",
  description: "Advanced Battle Simulator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-neutral-950 text-slate-50">
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
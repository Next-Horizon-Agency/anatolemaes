import type { Metadata, Viewport } from "next";
import { Anton, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const anton = Anton({ subsets: ["latin"], weight: "400", variable: "--font-anton" });
const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const metadata: Metadata = {
  title: "Anatole Maes | Vidéaste & Photographe",
  description:
    "CV en ligne d’Anatole Maes, vidéaste et photographe basé à Namur (Belgique). Parcours, compétences, projets photo et vidéo.",
  openGraph: {
    title: "Anatole Maes | Vidéaste & Photographe",
    description: "Parcours, compétences et projets photo et vidéo.",
    locale: "fr_BE",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0c0c0d",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${anton.variable} ${geist.variable} ${geistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}

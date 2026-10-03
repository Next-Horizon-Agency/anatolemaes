import type { Metadata, Viewport } from "next";
import { Anton, Geist, Geist_Mono } from "next/font/google";
import { profile } from "@/data/content";
import { siteUrl } from "@/lib/site";
import "./globals.css";

const anton = Anton({ subsets: ["latin"], weight: "400", variable: "--font-anton" });
const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

const title = `${profile.firstName} ${profile.lastName} | ${profile.role}`;
const description =
  "CV en ligne d’Anatole Maes, vidéaste et photographe basé à Namur (Belgique). Parcours, compétences, projets photo et vidéo.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  authors: [{ name: `${profile.firstName} ${profile.lastName}` }],
  creator: "Next Horizon",
  alternates: { canonical: "/" },
  openGraph: {
    title,
    description: "Parcours, compétences et projets photo et vidéo.",
    url: "/",
    siteName: `${profile.firstName} ${profile.lastName}`,
    locale: "fr_BE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: "Parcours, compétences et projets photo et vidéo.",
  },
  robots: { index: true, follow: true },
};

/** Données structurées : aident Google à relier le site à la personne. */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: `${profile.firstName} ${profile.lastName}`,
  jobTitle: profile.role,
  email: `mailto:${profile.email}`,
  telephone: profile.phone,
  url: siteUrl,
  image: `${siteUrl}/media/anatole_maes.jpg`,
  address: { "@type": "PostalAddress", addressLocality: "Biesme", addressRegion: "Namur", addressCountry: "BE" },
};

export const viewport: Viewport = {
  themeColor: "#0c0c0d",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${anton.variable} ${geist.variable} ${geistMono.variable}`}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        {children}
      </body>
    </html>
  );
}

/**
 * URL publique du site (balises canoniques, Open Graph, sitemap).
 * NEXT_PUBLIC_SITE_URL pour un domaine personnalisé, sinon le domaine de production Vercel.
 */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000")
).replace(/\/$/, "");

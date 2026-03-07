export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://garmin-body-fit.vercel.app/sitemap.xml',
  }
}

export default function sitemap() {
  const baseUrl = 'https://garmin-body-fit.vercel.app';
  const languages = ['', 'en', 'es', 'zh'];
  
  return languages.map((lang) => ({
    url: `${baseUrl}${lang ? `?lang=${lang}` : ''}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: lang === '' ? 1 : 0.8,
  }));
}

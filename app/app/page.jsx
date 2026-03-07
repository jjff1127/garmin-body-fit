import ClientHome from '@/components/ClientHome';

const SEO_DICT = {
  zh: {
    title: 'Garmin 身体数据同步工具 — 轻松上传体重与体脂',
    description: '生成 .fit 文件并直接上传身体组成数据至 Garmin Connect。支持体重、体脂率、肌肉量等。',
    keywords: 'Garmin, 身体数据, 同步, FIT 文件, 体重, 体脂, Garmin Connect, 上传'
  },
  es: {
    title: 'Garmin Body Fit — Sube tus datos corporales a Garmin Connect',
    description: 'Genera archivos .fit y sube tu peso, porcentaje de grasa y más directamente a Garmin Connect. Exporta datos de composición corporal fácilmente.',
    keywords: 'Garmin, datos corporales, FIT, peso, grasa corporal, Garmin Connect, subir, sincronizar'
  },
  en: {
    title: 'Garmin Body Fit — Securely Upload Body Composition to Garmin Connect',
    description: 'Generate .fit files and push your weight, body fat %, and muscle mass directly to Garmin Connect. Simple and fast body data sync.',
    keywords: 'Garmin, body data, sync, FIT file, weight, body fat, Garmin Connect, upload, composition'
  }
};

export async function generateMetadata({ searchParams }) {
  const lang = searchParams.lang || 'es';
  const t = SEO_DICT[lang] || SEO_DICT.es;
  const baseUrl = 'https://garmin-body-fit.vercel.app';
  const currentUrl = lang === 'es' ? baseUrl : `${baseUrl}?lang=${lang}`;

  return {
    title: t.title,
    description: t.description,
    keywords: t.keywords,
    alternates: {
      canonical: currentUrl,
      languages: {
        'en-US': `${baseUrl}?lang=en`,
        'es-ES': baseUrl,
        'zh-CN': `${baseUrl}?lang=zh`,
      },
    },
    openGraph: {
      title: t.title,
      description: t.description,
      url: currentUrl,
      siteName: 'Garmin Body Fit',
      locale: lang === 'zh' ? 'zh_CN' : (lang === 'en' ? 'en_US' : 'es_ES'),
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t.title,
      description: t.description,
    },
  };
}

export default function Page({ searchParams }) {
  const lang = searchParams.lang || 'es';
  
  return (
    <>
      <ClientHome initialLang={lang} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Garmin Body Fit",
            "operatingSystem": "Web",
            "applicationCategory": "HealthApplication",
            "offers": {
              "@type": "Offer",
              "price": "0"
            },
            "description": "Tool to generate and upload .fit body composition files to Garmin Connect."
          })
        }}
      />
    </>
  );
}

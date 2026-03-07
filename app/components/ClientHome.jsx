'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import BodyDataForm from '@/components/BodyDataForm';

const DICT = {
  zh: {
    badge: '🏃 Garmin Connect',
    titleLine1: '上传您的',
    titleLine2: '身体数据',
    subtitle: '填写表单，生成 .fit 文件并可导入至 Garmin Connect。',
  },
  es: {
    badge: '🏃 Garmin Connect',
    titleLine1: 'Sube tus datos',
    titleLine2: 'corporales',
    subtitle: 'Rellena el formulario, genera un archivo .fit y súbelo a Garmin Connect.',
  },
  en: {
    badge: '🏃 Garmin Connect',
    titleLine1: 'Upload your',
    titleLine2: 'body data',
    subtitle: 'Fill out the form, generate a .fit file and upload it to Garmin Connect.',
  }
};

export default function ClientHome({ initialLang = 'es' }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [lang, setLang] = useState(initialLang);

  // Sync state with URL but allow local override
  useEffect(() => {
    const urlLang = searchParams.get('lang');
    if (urlLang && DICT[urlLang]) {
      setLang(urlLang);
    }
  }, [searchParams]);

  const handleLangChange = (newLang) => {
    setLang(newLang);
    // Standard SEO practice: update URL when language changes
    router.push(`?lang=${newLang}`, { scroll: false });
  };

  const t = DICT[lang] || DICT.es;

  return (
    <main className="main">
      <div className="header-actions">
        <select 
          className="lang-selector"
          value={lang} 
          onChange={e => handleLangChange(e.target.value)}
          aria-label="Select Language"
        >
          <option value="es">Español</option>
          <option value="en">English</option>
          <option value="zh">中文</option>
        </select>
      </div>
      <div className="hero">
        <div className="hero-badge">{t.badge}</div>
        <h1 className="hero-title">
          {t.titleLine1}<br />
          <span className="gradient-text">{t.titleLine2}</span>
        </h1>
        <p className="hero-subtitle">
          {t.subtitle}
        </p>
      </div>
      <BodyDataForm lang={lang} />
    </main>
  );
}

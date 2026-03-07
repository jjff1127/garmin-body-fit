'use client';

import { useState } from 'react';
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

export default function Home() {
  const [lang, setLang] = useState('es');
  const t = DICT[lang];

  return (
    <main className="main">
      <div className="header-actions">
        <select 
          className="lang-selector"
          value={lang} 
          onChange={e => setLang(e.target.value)}
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

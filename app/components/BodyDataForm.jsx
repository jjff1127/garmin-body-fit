'use client';

import { useState } from 'react';
import { generateFitBlob, downloadFit } from './FitGenerator';

const DICT = {
  zh: {
    date: '📅 测量日期时间',
    success: '✅ .fit 文件生成并下载成功！',
    error: '生成 .fit 文件时出错',
    generating: '生成中…',
    downloadBtn: '📥 生成并下载 .fit 文件',
    hint: '* 仅体重为必填项，其余项目为可选。生成的 .fit 文件可以直接导入 Garmin Connect。',
    fields: {
      weight: '体重', percentFat: '体脂率', percentHydration: '体水分',
      muscleMass: '肌肉量', boneMass: '骨量', visceralFatRating: '内脏脂肪', bmi: 'BMI'
    }
  },
  es: {
    date: '📅 Fecha y hora de medición',
    success: '✅ ¡Archivo .fit generado y descargado!',
    error: 'Error al generar archivo .fit',
    generating: 'Generando...',
    downloadBtn: '📥 Generar y descargar .fit',
    hint: '* Solo el peso es obligatorio. El archivo .fit puede ser importado en Garmin Connect.',
    fields: {
      weight: 'Peso', percentFat: '% Grasa', percentHydration: '% Agua',
      muscleMass: 'Masa Muscular', boneMass: 'Masa Ósea', visceralFatRating: 'Grasa Visceral', bmi: 'BMI'
    }
  },
  en: {
    date: '📅 Date and time',
    success: '✅ .fit file generated and downloaded!',
    error: 'Error generating .fit file',
    generating: 'Generating...',
    downloadBtn: '📥 Generate & Download .fit',
    hint: '* Only weight is required. The generated .fit file can be imported into Garmin Connect.',
    fields: {
      weight: 'Weight', percentFat: 'Body Fat %', percentHydration: 'Water %',
      muscleMass: 'Muscle Mass', boneMass: 'Bone Mass', visceralFatRating: 'Visceral Fat', bmi: 'BMI'
    }
  }
};

const FIELDS_CONFIG = [
  { key: 'weight', unit: 'kg', required: true, min: 20, max: 300, step: 0.01, placeholder: '70.5' },
  { key: 'percentFat', unit: '%', required: false, min: 1, max: 70, step: 0.01, placeholder: '20.0' },
  { key: 'percentHydration', unit: '%', required: false, min: 20, max: 80, step: 0.01, placeholder: '55.0' },
  { key: 'muscleMass', unit: 'kg', required: false, min: 5, max: 150, step: 0.01, placeholder: '35.0' },
  { key: 'boneMass', unit: 'kg', required: false, min: 0.5, max: 10, step: 0.01, placeholder: '3.2' },
  { key: 'visceralFatRating', unit: '', required: false, min: 1, max: 59, step: 1, placeholder: '10' },
  { key: 'bmi', unit: '', required: false, min: 10, max: 60, step: 0.01, placeholder: '23.5' },
];

export default function BodyDataForm({ lang = 'es' }) {
  const t = DICT[lang] || DICT.es;
  const [values, setValues] = useState({ weight: '' });
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 16));
  const [status, setStatus] = useState(null); // null | 'loading' | 'success' | 'error'
  const [error, setError] = useState('');

  const handleChange = (key, val) => setValues(prev => ({ ...prev, [key]: val }));

  const handleDownload = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setError('');

    try {
      const payload = {
        date: new Date(date),
        weight: parseFloat(values.weight),
        percentFat: values.percentFat ? parseFloat(values.percentFat) : undefined,
        percentHydration: values.percentHydration ? parseFloat(values.percentHydration) : undefined,
        muscleMass: values.muscleMass ? parseFloat(values.muscleMass) : undefined,
        boneMass: values.boneMass ? parseFloat(values.boneMass) : undefined,
        visceralFatRating: values.visceralFatRating ? parseInt(values.visceralFatRating) : undefined,
        bmi: values.bmi ? parseFloat(values.bmi) : undefined,
      };

      const blob = await generateFitBlob(payload);


      const ts = new Date(date).toISOString().replace(/[:.]/g, '-').slice(0, 16);
      downloadFit(blob, `garmin-body-${ts}.fit`);

      setStatus('success');

      // Limpiamos el botón de loading enseguida
      setTimeout(() => setStatus(null), 3000);

    } catch (err) {
      console.error(err);
      setError(t.error);
      setStatus('error');
    }
  };

  return (
    <form className="form-card" onSubmit={handleDownload}>
      {/* Fecha */}
      <div className="form-group">
        <label className="form-label">{t.date}</label>
        <input
          type="datetime-local"
          className="form-input"
          value={date}
          onChange={e => setDate(e.target.value)}
          required
        />
      </div>

      {/* Campos numéricos */}
      <div className="fields-grid">
        {FIELDS_CONFIG.map(f => (
          <div className="form-group" key={f.key}>
            <label className="form-label">
              {t.fields[f.key]}
              {f.unit && <span className="unit-badge">{f.unit}</span>}
              {f.required && <span className="required-star">*</span>}
            </label>
            <input
              type="number"
              className="form-input"
              placeholder={f.placeholder}
              min={f.min}
              max={f.max}
              step={f.step}
              required={f.required}
              value={values[f.key] || ''}
              onChange={e => handleChange(f.key, e.target.value)}
            />
          </div>
        ))}
      </div>

      {/* Estado / Error */}
      {status === 'success' && (
        <div className="alert alert-success">{t.success}</div>
      )}
      {status === 'error' && (
        <div className="alert alert-error">❌ {error}</div>
      )}

      {/* Botón */}
      <button
        type="submit"
        className={`btn-primary ${status === 'loading' ? 'btn-loading' : ''}`}
        disabled={status === 'loading'}
      >
        {status === 'loading' ? (
          <><span className="spinner" /> {t.generating}</>
        ) : (
          t.downloadBtn
        )}
      </button>

      <p className="form-hint">
        {t.hint}
      </p>
    </form>
  );
}

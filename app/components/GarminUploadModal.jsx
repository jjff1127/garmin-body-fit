'use client';
import { useState } from 'react';

// Use environment variable or fallback to localhost during development
const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

export default function GarminUploadModal({ blob, onClose, lang = 'es' }) {
  const [step, setStep] = useState('credentials'); // credentials | mfa | uploading | success | error
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mfaCode, setMfaCode] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // i18n simple mapping
  const t = {
    es: {
      title: '☁️ Subir a Garmin Connect',
      hint: 'Tus credenciales se envían cifradas y nunca se almacenan.',
      emailPlaceholder: 'Email de Garmin Connect',
      passPlaceholder: 'Contraseña',
      connectBtn: 'Conectar y subir',
      mfaTitle: '🔐 Verificación en dos pasos',
      mfaHint: 'Introduce el código que has recibido en tu email o app de autenticación.',
      mfaPlaceholder: 'Código de verificación',
      verifyBtn: 'Verificar y subir',
      connecting: 'Conectando con Garmin Connect…',
      successTitle: '¡Subido correctamente!',
      successDesc: 'Los datos ya están en Garmin Connect. Revisa Health Stats → Weight.',
      closeBtn: 'Cerrar',
      retryBtn: 'Intentar de nuevo',
      errorTitle: 'Error'
    },
    en: {
      title: '☁️ Upload to Garmin Connect',
      hint: 'Your credentials are sent encrypted and are never stored.',
      emailPlaceholder: 'Garmin Connect Email',
      passPlaceholder: 'Password',
      connectBtn: 'Connect & Upload',
      mfaTitle: '🔐 Two-Step Verification',
      mfaHint: 'Enter the code you received in your email or authentication app.',
      mfaPlaceholder: 'Verification Code',
      verifyBtn: 'Verify & Upload',
      connecting: 'Connecting to Garmin Connect…',
      successTitle: 'Uploaded successfully!',
      successDesc: 'Data is now in Garmin Connect. Check Health Stats → Weight.',
      closeBtn: 'Close',
      retryBtn: 'Try Again',
      errorTitle: 'Error'
    },
    zh: {
      title: '☁️ 上传到 Garmin Connect',
      hint: '您的凭据经过加密传输，永不存储。',
      emailPlaceholder: 'Garmin Connect 邮箱',
      passPlaceholder: '密码',
      connectBtn: '连接并上传',
      mfaTitle: '🔐 两步验证',
      mfaHint: '请输入您在邮件或身份验证器中收到的验证码。',
      mfaPlaceholder: '验证码',
      verifyBtn: '验证并上传',
      connecting: '正在连接 Garmin Connect...',
      successTitle: '上传成功！',
      successDesc: '数据已同步至 Garmin Connect。请检查健康统计 → 体重。',
      closeBtn: '关闭',
      retryBtn: '重试',
      errorTitle: '错误'
    }
  }[lang] || { /* fallback to es if lang not found */ };

  // ── Paso 1: Login ────────────────────────────────────────────
  const handleLogin = async () => {
    setStep('uploading');
    setErrorMsg('');
    try {
      const res = await fetch(`${BACKEND}/api/garmin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || 'Error de login');
      }

      setSessionId(data.session_id);

      if (data.status === 'needs_mfa') {
        setStep('mfa');
      } else {
        await doUpload(data.session_id);
      }
    } catch (err) {
      setErrorMsg(err.message);
      setStep('error');
    }
  };

  // ── Paso 2 (solo MFA): Verificar código ──────────────────────
  const handleVerify = async () => {
    setStep('uploading');
    try {
      const res = await fetch(`${BACKEND}/api/garmin/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, mfa_code: mfaCode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Código incorrecto');

      await doUpload(sessionId);
    } catch (err) {
      setErrorMsg(err.message);
      setStep('error');
    }
  };

  // ── Paso 3: Upload ───────────────────────────────────────────
  const doUpload = async (sid) => {
    try {
      const arrayBuffer = await blob.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      const base64 = btoa(String.fromCharCode(...uint8Array));

      const res = await fetch(`${BACKEND}/api/garmin/upload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sid, fit_bytes_base64: base64 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Error al subir');

      setStep('success');
    } catch (err) {
      setErrorMsg(err.message);
      setStep('error');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>

        {/* PASO 1: Credenciales */}
        {step === 'credentials' && (
          <>
            <h2 style={{ fontSize: '20px', fontWeight: '700' }}>{t.title}</h2>
            <p className="modal-hint">{t.hint}</p>
            <input
              type="email"
              placeholder={t.emailPlaceholder}
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="form-input"
              autoFocus
            />
            <input
              type="password"
              placeholder={t.passPlaceholder}
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="form-input"
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
            />
            <button className="btn-primary" onClick={handleLogin}
              disabled={!email || !password}>
              {t.connectBtn}
            </button>
          </>
        )}

        {/* PASO 2: MFA */}
        {step === 'mfa' && (
          <>
            <h2 style={{ fontSize: '20px', fontWeight: '700' }}>{t.mfaTitle}</h2>
            <p className="modal-hint">{t.mfaHint}</p>
            <input
              type="text"
              placeholder={t.mfaPlaceholder}
              value={mfaCode}
              onChange={e => setMfaCode(e.target.value)}
              className="form-input"
              maxLength={8}
              autoFocus
              onKeyDown={e => e.key === 'Enter' && handleVerify()}
            />
            <button className="btn-primary" onClick={handleVerify}
              disabled={!mfaCode}>
              {t.verifyBtn}
            </button>
          </>
        )}

        {/* Cargando */}
        {step === 'uploading' && (
          <div className="modal-center">
            <div className="spinner-large" />
            <p style={{ fontWeight: '500' }}>{t.connecting}</p>
          </div>
        )}

        {/* Éxito */}
        {step === 'success' && (
          <div className="modal-center">
            <div className="success-icon">✅</div>
            <h2 style={{ fontSize: '20px', fontWeight: '700' }}>{t.successTitle}</h2>
            <p className="modal-hint">{t.successDesc}</p>
            <button className="btn-primary" style={{ width: '100%' }} onClick={onClose}>
              {t.closeBtn}
            </button>
          </div>
        )}

        {/* Error */}
        {step === 'error' && (
          <div className="modal-center">
            <div className="error-icon">❌</div>
            <h2 style={{ fontSize: '20px', fontWeight: '700' }}>{t.errorTitle}</h2>
            <p className="modal-hint" style={{ color: 'var(--error)' }}>{errorMsg}</p>
            <button className="btn-secondary" style={{ width: '100%' }} onClick={() => setStep('credentials')}>
              {t.retryBtn}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

const DICT = {
  es: {
    question: '¿Te ha sido útil esta herramienta?',
    hint: 'Invítame a un café para mantener el proyecto activo 🙌',
    btn: 'Buy me a coffee'
  },
  en: {
    question: 'Was this tool helpful?',
    hint: 'Buy me a coffee to keep the project active 🙌',
    btn: 'Buy me a coffee'
  },
  zh: {
    question: '这个工具对您有帮助吗？',
    hint: '请我喝杯咖啡，支持项目持续运行 🙌',
    btn: '请我喝杯咖啡'
  }
};

export default function BuyMeCoffee({ username = 'jjff1127', lang = 'en' }) {
  const t = DICT[lang] || DICT.en;

  return (
    <div className="bmc-card">
      <div className="bmc-content">
        <img 
          src="/bmc-logo-yellow.png" 
          alt="Buy Me a Coffee" 
          style={{ width: '48px', height: '48px', borderRadius: '10px' }} 
        />
        <div className="bmc-text">
          <p className="bmc-question">{t.question}</p>
          <p className="bmc-hint">{t.hint}</p>
        </div>
      </div>
      
      <a
        href={`https://www.buymeacoffee.com/${username}`}
        target="_blank"
        rel="noopener noreferrer"
        className="bmc-button"
      >
        <img 
          src="/bmc-logo-yellow.png" 
          alt="" 
          style={{ width: '20px', height: '20px' }} 
        />
        <span>{t.btn}</span>
      </a>

      <style jsx>{`
        .bmc-card {
          margin-top: 32px;
          padding: 24px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
          text-align: center;
          transition: all 0.3s ease;
        }
        .bmc-card:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 221, 0, 0.3);
        }
        .bmc-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }
        .bmc-text {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .bmc-question {
          margin: 0;
          font-weight: 700;
          font-size: 16px;
          color: #fff;
        }
        .bmc-hint {
          margin: 0;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.6);
        }
        .bmc-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          max-width: 240px;
          background-color: #FFDD00;
          color: #000;
          font-weight: 800;
          font-size: 14px;
          padding: 12px 20px;
          border-radius: 12px;
          text-decoration: none;
          transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .bmc-button:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 20px rgba(255, 221, 0, 0.25);
        }
        
        @media (min-width: 640px) {
          .bmc-card {
            flex-direction: row;
            justify-content: space-between;
            text-align: left;
          }
          .bmc-content {
            flex-direction: row;
          }
          .bmc-button {
            width: auto;
          }
        }
      `}</style>
    </div>
  );
}

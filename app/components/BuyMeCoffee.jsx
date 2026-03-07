'use client';
import { useEffect } from 'react';

export default function BuyMeCoffee() {
  useEffect(() => {
    // Evitar duplicados si el componente se monta dos veces
    if (document.querySelector('script[data-name="BMC-Widget"]')) return;

    const script = document.createElement('script');
    script.src = 'https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js';
    script.setAttribute('data-name', 'BMC-Widget');
    script.setAttribute('data-cfasync', 'false');
    script.setAttribute('data-id', 'jjff1127');
    script.setAttribute('data-description', 'Support me on Buy me a coffee!');
    script.setAttribute('data-message', 'If you like my work, you can buy me a coffee ☕');
    script.setAttribute('data-color', '#FF813F');
    script.setAttribute('data-position', 'Right');
    script.setAttribute('data-x_margin', '18');
    script.setAttribute('data-y_margin', '18');
    script.async = true;

    document.head.appendChild(script);

    return () => {
      // Cleanup: eliminar script y widget al desmontar
      const existingScript = document.querySelector('script[data-name="BMC-Widget"]');
      if (existingScript) existingScript.remove();
      const widget = document.getElementById('bmc-wbtn');
      if (widget) widget.remove();
    };
  }, []);

  return null;
}

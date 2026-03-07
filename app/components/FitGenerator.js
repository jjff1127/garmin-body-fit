'use client';

/**
 * FitGenerator.js
 * Genera un archivo .fit con datos de composición corporal
 * usando el SDK oficial de Garmin (@garmin/fitsdk)
 */

/**
 * Construye el archivo .fit en memoria y retorna un Blob listo para descargar.
 * @param {Object} data - Datos del formulario
 * @param {number} data.weight        - Peso en kg
 * @param {number} data.percentFat    - % grasa corporal
 * @param {number} data.percentHydration - % hidratación
 * @param {number} data.muscleMass    - Masa muscular en kg
 * @param {number} data.boneMass      - Masa ósea en kg
 * @param {number} data.visceralFatRating - Grasa visceral (1-59)
 * @param {number} data.bmi           - IMC
 * @param {Date}   data.date          - Fecha y hora de la medición
 * @returns {Blob} Blob del archivo .fit
 */
export async function generateFitBlob(data) {
  // Importación dinámica para evitar SSR (solo corre en el navegador)
  const { Encoder, Profile, Utils } = await import('@garmin/fitsdk');

  // Recommended SDK way: convert date using Utils.convertDateToDateTime
  const timestamp = Utils.convertDateToDateTime(data.date);

  const encoder = new Encoder();

  // ── Mensaje FILE_ID ────────────────────────────────────────────
  // ── Mensaje FILE_ID ────────────────────────────────────────────
  encoder.onMesg(Profile.MesgNum.FILE_ID, {
    type: "weight",
    manufacturer: "development",
    product: 0,
    timeCreated: timestamp,
    serialNumber: 1,
  });

  // ── Mensaje WEIGHT_SCALE ───────────────────────────────────────
  encoder.onMesg(Profile.MesgNum.WEIGHT_SCALE, {
    timestamp: timestamp,
    weight: parseFloat(data.weight) * 100,              // kg * 100
    percentFat: data.percentFat ?? undefined,
    percentHydration: data.percentHydration ?? undefined,       // % (directo)
    boneMass: data.boneMass ?? undefined,
    muscleMass: data.muscleMass ?? undefined,
    visceralFatRating: data.visceralFatRating ?? undefined,
    visceralFatMass: undefined,
    bmi: (data.bmi ? parseFloat(data.bmi) * 100 : undefined), // bmi * 10
    physiqueRating: data.physiqueRating ?? undefined,
    metabolicAge: data.metabolicAge ?? undefined,
  });

  const fitBytes = encoder.close();

  // Handle various possible return formats from SDK
  let uint8Array;
  if (fitBytes instanceof Uint8Array) {
    uint8Array = fitBytes;
  } else if (Array.isArray(fitBytes)) {
    uint8Array = new Uint8Array(fitBytes);
  } else if (fitBytes?.buffer instanceof ArrayBuffer) {
    uint8Array = new Uint8Array(fitBytes.buffer, fitBytes.byteOffset, fitBytes.byteLength);
  } else if (typeof fitBytes === 'object' && fitBytes !== null) {
    const values = Object.values(fitBytes);
    uint8Array = new Uint8Array(values);
  } else {
    throw new Error(`encoder.close() returned unknown type: ${typeof fitBytes}`);
  }

  // Validate data is not empty
  if (uint8Array.length === 0) {
    throw new Error('Generated .fit file is empty, check SDK usage');
  }

  console.log(`✅ .fit file generated successfully, size: ${uint8Array.length} bytes`);
  return new Blob([uint8Array], { type: 'application/octet-stream' });
}

/**
 * Dispara la descarga del archivo .fit en el navegador.
 * @param {Blob} blob
 * @param {string} filename
 */
export function downloadFit(blob, filename = 'body-data.fit') {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

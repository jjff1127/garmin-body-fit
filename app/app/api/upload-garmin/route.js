import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://backend:8000/upload';

export async function POST(request) {
  try {
    const { fitBytesBase64, email, password } = await request.json();

    if (!fitBytesBase64 || !email || !password) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    console.log('--- Forwarding upload request to Python backend ---');

    // Proxy the request to our FastAPI service
    const response = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fitBytesBase64,
        email,
        password,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Python backend error:', result);
      return NextResponse.json(
        { error: result.detail || 'Error en el servidor de carga' },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: '¡Datos subidos correctamente a Garmin Connect!',
      result,
    });

  } catch (err) {
    console.error('Proxy error:', err);
    return NextResponse.json(
      { error: 'No se pudo conectar con el servicio de carga: ' + (err.message || 'Unknown error') },
      { status: 500 }
    );
  }
}

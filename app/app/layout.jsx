import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Garmin Body Fit — Subir datos corporales',
  description: 'Genera y sube tu archivo .fit con datos corporales directamente a Garmin Connect',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={inter.className}>{children}</body>
    </html>
  )
}

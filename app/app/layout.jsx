import { Inter } from 'next/font/google'
import './globals.css'
import BuyMeCoffee from '@/components/BuyMeCoffee'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={inter.className}>
        {children}
        <BuyMeCoffee />
      </body>
    </html>
  )
}

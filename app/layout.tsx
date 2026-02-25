import './globals.css'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'

export const metadata = {
  title: "Hotlob | Get Rollin' with Us; Fast, Tasty, Brioche Rolls - Australia",
  description: 'Premium Aussie lobster rolls — plus prawn, crab, meat & vegetarian favorites.'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}

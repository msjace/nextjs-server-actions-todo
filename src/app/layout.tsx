import { GeistSans } from 'geist/font/sans'
import '@/styles/globals.css'
import { ToastContainer } from 'material-react-toastify'
import 'material-react-toastify/dist/ReactToastify.css'

import Header from '@/components/molecules/Header'

export const dynamic = 'force-dynamic'

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000'

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'NextJS server actions ',
  description: 'This was created to test server actions in NextJS',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={GeistSans.variable}>
      <body className="sticky top-0 bg-background text-foreground">
        <ToastContainer />
        <Header />
        <main className="flex flex-col items-center">{children}</main>
      </body>
    </html>
  )
}

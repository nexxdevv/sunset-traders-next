import "@/app/globals.css"
import BottomNav from "@/components/bottom-nav"

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900 antialiased">
        {children}
        <BottomNav activePath="/" />
      </body>
    </html>
  )
}

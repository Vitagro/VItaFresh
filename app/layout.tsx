import type { Metadata, Viewport } from "next"
import { Inter, Tajawal } from "next/font/google"
import { CartProvider } from "@/lib/cart"
import { SessionProvider } from "@/lib/session"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" })
const tajawal = Tajawal({ subsets: ["arabic"], weight: ["400", "500", "700"], variable: "--font-arabic", display: "swap" })

export const metadata: Metadata = {
  metadataBase: new URL("https://shop.vita-core.org"),
  title: {
    default: "Vita Fresh — Fruits & légumes frais à Casablanca",
    template: "%s · Vita Fresh",
  },
  description:
    "Commandez fruits et légumes ultra-frais à Casablanca. Livraison standard 24h (gratuite dès 150 MAD) ou express 2h. Particuliers, hôtels, restaurants. 500+ clients · 98% satisfaction.",
  keywords: ["fruits frais Casablanca", "légumes frais Casablanca", "livraison fruits Casablanca", "grossiste fruits Maroc", "fournisseur CHR Maroc"],
  authors: [{ name: "Vita Agro Capital" }],
  openGraph: {
    type: "website",
    locale: "fr_MA",
    alternateLocale: ["ar_MA"],
    siteName: "Vita Fresh",
    title: "Vita Fresh — Fruits & Légumes Frais à Casablanca",
    description: "Livraison 24h ou express 2h. Pour particuliers, hôtels, restaurants. 500+ clients actifs · 98% satisfaction.",
    images: [{ url: "/og-image.svg", width: 1200, height: 630, alt: "Vita Fresh" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@VitaFreshMaroc",
    title: "Vita Fresh — Casablanca",
    description: "Fruits & légumes frais, livraison 24h. CHR, hôtels, restaurants.",
    images: ["/og-image.svg"],
  },
  alternates: { canonical: "https://shop.vita-core.org" },
  robots: { index: true, follow: true },
  manifest: "/manifest.webmanifest",
}

export const viewport: Viewport = {
  themeColor: "#1a4d2e",
  width: "device-width",
  initialScale: 1,
}

// Inline script that runs BEFORE React hydrates — prevents the dark-mode
// flash on first render (matches the ThemeToggle storage key).
const noFlashScript = `
(function(){try{var m=localStorage.getItem('vita-theme');var h=new Date().getHours();var night=h>=19||h<7;var d=m==='dark'||(m==='system'&&matchMedia('(prefers-color-scheme: dark)').matches)||((m==='auto'||!m)&&night);if(d){document.documentElement.classList.add('dark');document.documentElement.style.colorScheme='dark'}}catch(_){}})()
`.trim()

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" dir="ltr" className={`${inter.variable} ${tajawal.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: noFlashScript }} />
      </head>
      <body className="min-h-screen bg-white font-sans text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-100">
        <SessionProvider>
          <CartProvider>
            <Header />
            <main className="min-h-[calc(100vh-4rem)]">{children}</main>
            <Footer />
          </CartProvider>
        </SessionProvider>
      </body>
    </html>
  )
}

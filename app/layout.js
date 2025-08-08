import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Menu from "@/components/menu";
import { CartProvider } from "./CartContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// app/landing/page.tsx (or layout.tsx)
export const metadata = {
  title: "Kyraco CI",
  description:
    "KYRACO Côte d'Ivoire : véhicules électriques, transport, communication digitale, impression. Solutions durables pour entreprises et institutions.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://kyraco-ci"),
  openGraph: {
    title: "Kyraco CI",
    description:
      "Solutions durables pour entreprises et institutions en Côte d'Ivoire.",
    url: "/landing",
    siteName: "Kyraco CI",
    locale: "fr_FR",
    type: "website",
    images: [
      {
        url: "/media/images/campaign3.jpg",
        width: 1200,
        height: 630,
        alt: "Kyraco – Mobilité électrique et solutions durables",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kyraco CI",
    description:
      "Solutions durables pour entreprises et institutions en Côte d'Ivoire.",
    images: ["/media/images/campaign3.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
    
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* This is a JSX comment and will not show in HTML */}
      <div style={{ display: "none" }}>
        Built by @twelveisk for Maat
      </div>
        <CartProvider>
          <Menu />
          {children}
        </CartProvider>
        
      </body>
    </html>
  );
}

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

export const metadata = {
  title: "Kyraco CI",
  description: "KYRACO Côte d'Ivoire : véhicules électriques, transport, communication digitale, impression. Solutions durables pour entreprises et institutions.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CartProvider>
          <Menu />
          {children}
        </CartProvider>
        
      </body>
    </html>
  );
}

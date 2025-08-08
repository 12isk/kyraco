// app/landing/page.jsx
import ClientPage from './ClientPage'

export const metadata = {
  title: "Un Billet pour l'Écologie - KYRACO",
  description: "Participez par don volontaire et gagnez un véhicule électrique en Côte d'Ivoire. Mobilité durable accessible.",
  keywords: "véhicule électrique, Côte d'Ivoire, KYRACO, mobilité durable, don volontaire",
  openGraph: {
    title: "Un Billet pour l'Écologie - KYRACO",
    description: "Gagnez un véhicule électrique en soutenant la mobilité durable",
    url: "https://kyraco-ci.com/landing",
    siteName: "KYRACO",
    images: [
      {
        url: "/media/images/campaign3.jpg",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Un Billet pour l'Écologie - KYRACO",
    description: "Participez et gagnez un véhicule électrique",
    images: ["/media/images/campaign3.jpg"],
  },
}

export default function Page() {
  return <ClientPage />
}

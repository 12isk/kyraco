// app/landing/page.jsx
import ClientPage from './ClientPage'

export const metadata = {
  title: "Un Billet pour l'Écologie - KYRACO",
  description: "Participez par don volontaire et contribuez à la mobilité durable accessible.",
  keywords: "véhicule électrique, Côte d'Ivoire, KYRACO, mobilité durable, don volontaire",
  openGraph: {
    title: "Un Billet pour l'Écologie - KYRACO",
    description: "Participez et contribuez à un avenir plus vert.",
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
    description: "Participez et contribuez à un avenir plus vert.",
    images: ["/media/images/campaign3.jpg"],
  },
}


export default function Page() {
  return <ClientPage />
}

// app/about/page.jsx
import AboutClient from "./AboutClient";

export const metadata = {
  title: "Un Billet pour l'Écologie | Kyraco CI",
  description:
    "Participez à la campagne Mobilité Solidaire CI et contribuez à la mobilité durable en Côte d’Ivoire.",
  alternates: { canonical: "/landing" },
}

export default function AboutPage() {
  return <AboutClient />;
}

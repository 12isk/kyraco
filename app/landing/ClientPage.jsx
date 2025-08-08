"use client"

import { useState , useEffect} from "react"
import { Button } from "@/components/landing/Button"
import { Input } from "@/components/landing/Input"
import { Label } from "@/components/landing/Label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/landing/Select"
import { RadioGroup, RadioGroupItem } from "@/components/landing/RadioGroup"
import {
  Menu,
  X,
  Phone,
  Shield,
  Check,
  Truck,
  Users,
  Car,
} from "lucide-react"
import Image from "next/image"
import styles from "./styles.module.css"
import { supabaseBrowser } from "@/lib/supabaseBrowser"

export default function EcologieLanding() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [formData, setFormData] = useState({
    nom: "",
    telephone: "",
    email: "",
    profession: "",
    montant: "",
    immatriculation: "",
    motivation: "",
  })
  const [loading, setLoading] = useState(false);
  const [participantCount, setParticipantCount] = useState(null);

  useEffect(() => {
  const fetchCount = async () => {
    const { count, error } = await supabaseBrowser
      .from("donations")
      .select("*", { count: "exact", head: true })
      .eq("status", "completed") // or remove this if you want *all* rows
    if (!error) setParticipantCount(count ?? 0)
  }

  fetchCount()

  // live updates
  const channel = supabaseBrowser
    .channel("donations-realtime")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "donations" },
      (payload) => {
        if (payload.eventType === "INSERT") {
          if (payload.new?.status === "completed") {
            setParticipantCount((c) => (c ?? 0) + 1)
          }
        } else if (payload.eventType === "UPDATE") {
          const was = payload.old?.status
          const now = payload.new?.status
          if (was !== "completed" && now === "completed") {
            setParticipantCount((c) => (c ?? 0) + 1)
          } else if (was === "completed" && now !== "completed") {
            setParticipantCount((c) => Math.max(0, (c ?? 0) - 1))
          }
        } else if (payload.eventType === "DELETE") {
          if (payload.old?.status === "completed") {
            setParticipantCount((c) => Math.max(0, (c ?? 0) - 1))
          }
        }
      }
    )
    .subscribe()

  return () => {
    supabaseBrowser.removeChannel(channel)
  }
}, [])

  const formatPhoneNumber = v =>
    v.replace(/\D/g, "")
      .replace(/(\d{2})(?=\d)/g, "$1 ")
      .trim()

  const handleTelephoneChange = e => {
    const formatted = formatPhoneNumber(e.target.value)
    if (formatted.replace(/\s/g, "").length <= 10) {
      setFormData(f => ({ ...f, telephone: formatted }))
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    const phoneForWave = "+225" + formData.telephone.replace(/\s/g, "")
    const res = await fetch('/api/donations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        telephone: phoneForWave,
      }),
    })
    const json = await res.json()
    setLoading(false)
    if (json.url) {
      window.location.href = json.url
    } else {
      alert('Erreur : ' + (json.error || 'Unknown'))
    }
  }

  const scrollToForm = () => {
    document.getElementById("participation-form")?.scrollIntoView({ behavior: "smooth" })
  }

  const MOTIVATIONS = [
    { value: "nouveau-vehicule", label: "Je veux obtenir un nouveau véhicule" },
    { value: "ameliorer-revenus", label: "Je veux améliorer mes revenus (chauffeur, livreur, etc.)" },
    { value: "interesse-ecologie", label: "Je suis intéressé(e) par les solutions écologiques" },
    { value: "entrepreneur-projet", label: "Je suis entrepreneur ou j’ai un petit projet à développer" },
    { value: "parent-au-foyer", label: "Je suis parent au foyer et je cherche une opportunité" },
    { value: "autre", label: "Autre (veuillez préciser plus tard)" },
  ]

  // inside EcologieLanding component
useEffect(() => {
  const scrollToHash = () => {
    const id = window.location.hash?.slice(1);
    if (!id) return;
    const el = document.getElementById(id);
    if (!el) return;
    // wait a tick so layout is ready (images, fonts, etc.)
    setTimeout(() => {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  scrollToHash();
  window.addEventListener("hashchange", scrollToHash);
  return () => window.removeEventListener("hashchange", scrollToHash);
}, []);


  return (
    <div className={styles.container}>
      {/* GLOBAL BACKGROUND VIDEO + OVERLAY */}
      <video className={styles.videoBackground} autoPlay muted loop playsInline>
        <source src="/media/videos/campaign3.mp4" type="video/mp4" />
      </video>
      <div className={styles.videoBackgroundOverlay} />

      {/* HEADER */}
      <header className={styles.header}>
        <nav className={`${styles.glassmorphicNav} ${styles.navContainer}`}>
          <div className={styles.logoContainer}>
            <div className={styles.logo}>
              <img src="/icons/kyraco.svg" className={styles.logoImg} alt="Kyraco" />
            </div>
          </div>
          <h1 className={styles.navTitle}>Un Billet pour l'Écologie</h1>
          <button
            onClick={() => setIsMenuOpen(o => !o)}
            className={`${styles.pillButton} ${styles.menuButton}`}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>

        {/* MOBILE MENU OVERLAY */}
        {isMenuOpen && (
          <div className={`${styles.mobileOverlay} ${styles.glassmorphicOverlay}`}>
            <div className={styles.mobileMenuContent}>
              <nav className={styles.mobileNav}>
                {[
                  { href: "#prizes", label: "Récompenses" },
                  { href: "#participation", label: "Participer" },
                  { href: "/reglementcampagne", label: "Règlement" }, // NEW
                  { href: "#contact", label: "Contact" },
                ].map((item, i) => (
                  <a
                    key={i}
                    href={item.href}
                    className={styles.mobileNavItem}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>
          </div>
        )}
      </header>

      {/* HERO SECTION */}
      <section className={styles.heroSection}>
        <div className={styles.heroContainer}>
          <div className={styles.videoContainer}>
            <div className={`${styles.heroOverlay} ${styles.glassmorphicOverlay}`}>
              <div className={styles.heroContent}>
                <h1 className={styles.heroTitle}>
                  Votre véhicule <span className={styles.emph}>électrique</span> vous attend
                </h1>
                <p className={styles.desc}>
                  Participez à notre campagne de dons volontaires et devenez le potentiel
                  Écomobiliste de la toute première édition de la campagne Mobilité Solidaire CI, lancée par Kyraco Holding et ses partenaires.
                  Merci pour votre geste écologique qui contribue à un avenir plus vert. 
                </p>
                <Button onClick={scrollToForm} className={styles.heroCta} size="lg">
                  Participer Maintenant
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRIZES SECTION */}
      <section id="prizes" className={styles.prizesSection}>
        <div className={styles.prizesContainer}>
          <h2 className={styles.sectionTitle}>Récompenses</h2>
          <div className={styles.prizesGrid}>
            {[
              {
                name: "Moto Électrique",
                description: "Pour livraisons rapides",
                image:
                  "https://global.niu.com/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2Fcd9iwvgl%2Fproduction%2Fe4b10e88df2fe90fa3e941236cc95ed0dfe0484d-2500x1406.jpg%3Ffit%3Dmax%26auto%3Dformat&w=3840&q=75",
              },
              { name: "Tricycle Électrique", description: "Transport commercial", image: "/media/images/Tricycleaveccabine.webp" },
              { name: "Citadine Électrique", description: "Mobilité urbaine", image: "/media/images/netaaya.jpg" },
              { name: "Berline Électrique", description: "Confort professionnel", image: "/media/images/xisu7.webp" },
            ].map((vehicle, index) => (
              <div key={index} className={styles.prizeCard}>
                <div className={styles.prizeImageContainer}>
                  <Image
                    src={vehicle.image}
                    alt={vehicle.name}
                    width={200}
                    height={200}
                    className={styles.prizeImage}
                  />
                </div>
                <h3 className={styles.prizeTitle}>{vehicle.name}</h3>
                <p className={styles.prizeDescription}>{vehicle.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PARTICIPATION FORM */}
      <section id="form" className={styles.formSection}>
        <div className={styles.formContainer}>
          <div className={styles.glassmorphicFormContainer}>
            <h2 className={styles.formTitle}>Participer à la préselection</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
              {/* Nom */}
              <div className={styles.formGroup}>
                <Label htmlFor="nom" required>Nom complet</Label>
                <Input
                  id="nom"
                  type="text"
                  value={formData.nom}
                  onChange={e => setFormData(f => ({ ...f, nom: e.target.value }))}
                  placeholder="Votre nom complet"
                  required
                />
              </div>

              {/* Téléphone */}
              <div className={styles.formGroup}>
                <Label htmlFor="telephone" required>Numéro de téléphone</Label>
                <Input
                  id="telephone"
                  type="tel"
                  value={formData.telephone}
                  onChange={handleTelephoneChange}
                  placeholder="XX XX XX XX XX"
                  required
                />
              </div>

              {/* Email (optional) */}
              <div className={styles.formGroup}>
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData(f => ({ ...f, email: e.target.value }))}
                  placeholder="votre@email.com"
                />
              </div>

              {/* Profession */}
              <div className={styles.formGroup}>
                <Label htmlFor="profession" required>Profession</Label>
                <Select onValueChange={value => setFormData(f => ({ ...f, profession: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez votre profession" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="chauffeur">Chauffeur de taxi</SelectItem>
                    <SelectItem value="livreur">Livreur/Coursier</SelectItem>
                    <SelectItem value="service">Personnel de service</SelectItem>
                    <SelectItem value="autre">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Immatriculation (optional) */}
              <div className={styles.formGroup}>
                <Label htmlFor="immatriculation">Immatriculation du dernier véhicule utilisé</Label>
                <Input
                  id="immatriculation"
                  type="text"
                  value={formData.immatriculation}
                  onChange={e => setFormData(f => ({ ...f, immatriculation: e.target.value }))}
                  placeholder="Ex: 1234-AB-01"
                />
              </div>

              {/* Motivation (optional) */}
              <div className={styles.formGroup}>
                <Label htmlFor="motivation">Pourquoi souhaitez-vous participer ?</Label>
                <Select
                  value={formData.motivation || ""}
                  onValueChange={(value) => {
                    setFormData(f => ({ ...f, motivation: value }))
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez une raison" />
                  </SelectTrigger>
                  <SelectContent>
                    {MOTIVATIONS.map(m => (
                      <SelectItem key={m.value} value={m.value}>
                        {m.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Montant du don */}
              <div className={styles.formGroup}>
                <Label required>Montant du don</Label>
                <RadioGroup
                  value={formData.montant}
                  onValueChange={value => setFormData(f => ({ ...f, montant: value }))}
                  className={styles.radioGroup}
                >
                  {["1", "1000", "2000", "5000", "10000"].map(amount => (
                    <div key={amount} className={styles.radioItem}>
                      <RadioGroupItem value={amount} id={amount} className={styles.radioInput} />
                      <Label htmlFor={amount} className={styles.pillRadioButton}>
                        {amount} FCFA
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Pay button + consent note */}
              <div className={styles.paymentSection}>
                <Button
                  type="submit"
                  className={styles.paymentButton}
                  size="lg"
                  disabled={loading}
                >
                  {loading ? "Patientez…" : "Payer avec Wave"}
                </Button>

                {/* Consent note (NEW) */}
                <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.9)", marginTop: "0.5rem" }}>
                  En procédant au paiement, vous acceptez le{" "}
                  <a href="/reglementcampagne" style={{ textDecoration: "underline" }}>
                    règlement du concours
                  </a>.
                </p>

                <div className={`${styles.glassmorphicBadge} ${styles.securityBadge}`}>
                  <Shield size={16} className={styles.securityIcon} />
                  <span className={styles.securityText}>Paiement sécurisé</span>
                  <div className={styles.greenDot} />
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* TRUST & STATS */}
      <section className={styles.trustSection}>
        <div className={styles.trustContainer}>
          <div className={styles.trustGrid}>
            {[{
              icon: <Check size={24} className={styles.trustIcon} />,
              text: "Sélection Transparente via kyraco-ci.com"
            },{
              icon: <Truck size={24} className={styles.trustIcon} />,
              text: "Livraison à domicile gratuite"
            },{
              icon: <Shield size={24} className={styles.trustIcon} />,
              text: "Campagne officielle Kyraco"
            }].map((item,i)=>(
              <div key={i} className={`${styles.glassmorphicPill} ${styles.trustItem}`}>
                {item.icon}<span>{item.text}</span>
              </div>
            ))}
          </div>
          <div className={styles.statsGrid}>
            <div className={`${styles.glassmorphicCard} ${styles.statCard}`}>
              <div className={styles.statIconContainer}>
                <Users size={20} className={styles.trustIcon} /><div className={styles.greenDot}/>
              </div>
              <div className={styles.statNumber}>{
                participantCount === null ? "—" : participantCount.toLocaleString("fr-FR")}
              </div>
              <div className={styles.statLabel}>participants</div>
            </div>
            <div className={`${styles.glassmorphicCard} ${styles.statCard}`}>
              <div className={styles.statIconContainer}>
                <Car size={20} className={styles.trustIcon} /><div className={styles.greenDot}/>
              </div>
              <div className={styles.statNumber}>4</div>
              <div className={styles.statLabel}>véhicules récompenses</div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <div className={styles.contactInfo}>
            <Phone size={16} className={styles.contactIcon} />
            <span className={styles.contactText}>Contact: +225 07 07 45 39 17</span>
          </div>
          <p className={styles.footerCopyright}>
            Powered by Kyraco – Mobilité Électrique
          </p>
          <div className={styles.socialMedia}>
            <div className={styles.socialIcon}>
              <img src='/media/images/partner1.png'/>
            </div>
            <div className={styles.socialIcon}>
              <img src='/media/images/partner2.png'/>
            </div>
            {/* <div className={styles.socialIcon} /> */}
          </div>
        </div>
      </footer>
    </div>
  )
}

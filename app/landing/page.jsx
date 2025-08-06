"use client"

import { useState } from "react"
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
} from "lucide-react"
import Image from "next/image"
import styles from "./styles.module.css"

export default function EcologieLanding() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [formData, setFormData] = useState({
    nom: "",
    telephone: "",
    email: "",
    profession: "",
    montant: "",
  })
  const [loading, setLoading] = useState(false)   

  const formatPhoneNumber = v =>
  v
    .replace(/\D/g, "")
    .replace(/(\d{2})(?=\d)/g, "$1 ")
    .trim()

const handleTelephoneChange = e => {
  const formatted = formatPhoneNumber(e.target.value)
  if (formatted.replace(/\s/g, "").length <= 8) {
    setFormData(f => ({ ...f, telephone: formatted }))
  }
}


  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    const phoneForWave = "+225" + formData.telephone.replace(/\s/g, "")
    const res = await fetch('/api/donations', {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({
        ...formData,
        telephone: phoneForWave,
      })
    })
    const json = await res.json()
    setLoading(false)
    if (json.url) window.location.href = json.url
    else alert('Erreur : ' + (json.error || 'Unknown'))
  }

  const scrollToForm = () => {
    document
      .getElementById("participation-form")
      ?.scrollIntoView({ behavior: "smooth" })
  }

  

  return (
    <div className={styles.container}>
      {/* --- GLOBAL BACKGROUND VIDEO + OVERLAY */}
      <video
        className={styles.videoBackground}
        autoPlay
        muted
        loop
        playsInline
      >
        <source
          src="/media/videos/campaign2.webm"
          type="video/webm"
        />
      </video>
      <div className={styles.videoBackgroundOverlay} />

      {/* --- HEADER */}
      <header className={styles.header}>
        <nav
          className={`${styles.glassmorphicNav} ${styles.navContainer}`}
        >
          <div className={styles.logoContainer}>
            <div className={styles.logo}>
              <span className={styles.logoText}>K</span>
            </div>
          </div>
          <h1 className={styles.navTitle}>
            Un Billet pour l'Écologie
          </h1>
          <button
            onClick={() =>
              setIsMenuOpen((o) => !o)
            }
            className={`${styles.pillButton} ${styles.menuButton}`}
          >
            {isMenuOpen ? (
              <X size={20} />
            ) : (
              <Menu size={20} />
            )}
          </button>
        </nav>

        {isMenuOpen && (
          <div
            className={`${styles.mobileOverlay} ${styles.glassmorphicOverlay}`}
          >
            <div className={styles.mobileMenuContent}>
              <h2 className={styles.mobileMenuTitle}>
                Un Billet pour l'Écologie
              </h2>
              <nav className={styles.mobileNav}>
                <a
                  href="#prizes"
                  className={styles.mobileNavLink}
                >
                  Véhicules à Gagner
                </a>
                <a
                  href="#participation"
                  className={styles.mobileNavLink}
                >
                  Participer
                </a>
                <a
                  href="#contact"
                  className={styles.mobileNavLink}
                >
                  Contact
                </a>
              </nav>
            </div>
          </div>
        )}
      </header>

      {/* --- HERO SECTION (no local video) */}
      <section className={styles.heroSection}>
        <div className={styles.heroContainer}>
          <div className={styles.videoContainer}>
            {/* apply the same glassmorphic overlay here */}
            <div
              className={`${styles.heroOverlay} ${styles.glassmorphicOverlay}`}
            >
              <div className={styles.heroContent}>
                <h1 className={styles.heroTitle}>
                  Votre véhicule <span className={styles.emph}>électrique</span> vous attend
                </h1>
                <Button
                  onClick={scrollToForm}
                  className={styles.heroCta}
                  size="lg"
                >
                  Participer Maintenant
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Prizes Section */}
      <section id="prizes" className={styles.prizesSection}>
        <div className={styles.prizesContainer}>
          <h2 className={styles.sectionTitle}>
            Véhicules à Gagner
          </h2>
          
          <div className={styles.prizesGrid}>
            {[
              {
                name: "Moto Électrique",
                description: "Pour livraisons rapides",
                image: "electric motorcycle for delivery in Africa"
              },
              {
                name: "Tricycle Électrique",
                description: "Transport commercial",
                image: "electric tricycle for commercial transport"
              },
              {
                name: "Citadine Électrique",
                description: "Mobilité urbaine",
                image: "compact electric car for urban mobility"
              },
              {
                name: "Berline Électrique",
                description: "Confort professionnel",
                image: "electric sedan professional comfort"
              }
            ].map((vehicle, index) => (
              <div key={index} className={styles.prizeCard}>
                <div className={styles.prizeImageContainer}>
                  <Image
                    src={`/media/images/abstract-geometric-shapes.png?height=200&width=200&query=${vehicle.image}`}
                    alt={vehicle.name}
                    width={200}
                    height={200}
                    className={styles.prizeImage}
                  />
                </div>
                <h3 className={styles.prizeTitle}>
                  {vehicle.name}
                </h3>
                <p className={styles.prizeDescription}>
                  {vehicle.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Participation Form */}
      <section id="participation-form" className={styles.formSection}>
        <div className={styles.formContainer}>
          <div className={styles.glassmorphicFormContainer}>
            <h2 className={styles.formTitle}>
              Participer au Tirage
            </h2>
            
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <Label htmlFor="nom" required>
                  Nom complet
                </Label>
                <Input
                  id="nom"
                  type="text"
                  value={formData.nom}
                  onChange={(e) => setFormData({...formData, nom: e.target.value})}
                  placeholder="Votre nom complet"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <Label htmlFor="telephone" required>
                  Numéro de téléphone
                </Label>
                <Input
                  id="telephone"
                  type="tel"
                  value={formData.telephone}
                  onChange={handleTelephoneChange}
                  placeholder="XX XX XX XX XX"
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <Label htmlFor="email" required>
                  E-mail
                </Label>
                <Input
                  id="nom"
                  type="text"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="votre@email.com"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <Label htmlFor="profession" required>
                  Profession
                </Label>
                <Select onValueChange={(value) => setFormData({...formData, profession: value})}>
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

              <div className={styles.formGroup}>
                <Label required>
                  Montant du don
                </Label>
                <RadioGroup
                  value={formData.montant}
                  onValueChange={(value) => setFormData({...formData, montant: value})}
                  className={styles.radioGroup}
                >
                  {["1","1000", "2000", "5000"].map((amount) => (
                    <div key={amount} className={styles.radioItem}>
                      <RadioGroupItem
                        value={amount}
                        id={amount}
                        className={styles.radioInput}
                      />
                      <Label
                        htmlFor={amount}
                        className={styles.pillRadioButton}
                      >
                        {amount} FCFA
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Wave Payment Button */}
              <div className={styles.paymentSection}>
                <Button
                  type="submit"
                  className={styles.paymentButton}
                  size="lg"
                  disabled={loading}
                >
                  {loading ? "Patientez…" : "Payer avec Wave"}
                </Button>

                
                <div className={`${styles.glassmorphicBadge} ${styles.securityBadge}`}>
                  <Shield size={16} className={styles.securityIcon} />
                  <span className={styles.securityText}>Paiement sécurisé</span>
                  <div className={styles.greenDot}></div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className={styles.trustSection}>
        <div className={styles.trustContainer}>
          <div className={styles.trustGrid}>
            {[
              {
                icon: <Check className={styles.trustIcon} size={24} />,
                text: "Sélection Transparente via kyraco-ci.com"
              },
              {
                icon: <Truck className={styles.trustIcon} size={24} />,
                text: "Livraison à domicile gratuite"
              },
              {
                icon: <Shield className={styles.trustIcon} size={24} />,
                text: "Campagne officielle Kyraco"
              }
            ].map((item, index) => (
              <div key={index} className={`${styles.glassmorphicPill} ${styles.trustItem}`}>
                {item.icon}
                <span className={styles.trustText}>{item.text}</span>
              </div>
            ))}
          </div>

          <div className={styles.statsGrid}>
            <div className={`${styles.glassmorphicCard} ${styles.statCard}`}>
              <div className={styles.statIconContainer}>
                <Users className={styles.trustIcon} size={20} />
                <div className={styles.greenDot}></div>
              </div>
              <div className={styles.statNumber}>XXX</div>
              <div className={styles.statLabel}>participants</div>
            </div>
            
            <div className={`${styles.glassmorphicCard} ${styles.statCard}`}>
              <div className={styles.statIconContainer}>
                <div className={styles.vehicleIcon}>
                  <span className={styles.vehicleIconText}>E</span>
                </div>
                <div className={styles.greenDot}></div>
              </div>
              <div className={styles.statNumber}>4</div>
              <div className={styles.statLabel}>véhicules à gagner</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <div className={styles.footerContent}>
            <div className={styles.contactInfo}>
              <Phone size={16} className={styles.contactIcon} />
              <span className={styles.contactText}>Contact: +225 07 07 98 23 80</span>
            </div>
          </div>
          
          <p className={styles.footerCopyright}>
            Powered by Kyraco - Mobilité Électrique
          </p>
          
          <div className={styles.socialMedia}>
            <div className={styles.socialIcon}></div>
            <div className={styles.socialIcon}></div>
            <div className={styles.socialIcon}></div>
          </div>
        </div>
      </footer>
    </div>
  )
}
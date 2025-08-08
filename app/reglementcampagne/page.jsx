'use client'

import { Button } from '../../components/landing/Button'
import { ArrowLeft, FileText, Users, Award, Shield, Eye, Megaphone, CheckCircle, Scale } from 'lucide-react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import styles from './styles.module.css'

export default function Rules() {
  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  }

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  }

  const staggerItem = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  }

    const currentYear= new Date().getFullYear();


  // Custom hook for scroll animations
  const AnimatedSection = ({ children, className = "", delay = 0 }) => {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: "-100px" })
    
    return (
      <motion.div
        ref={ref}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={fadeInUp}
        transition={{ delay }}
        className={className}
      >
        {children}
      </motion.div>
    )
  }

  const rules = [
    {
      id: 1,
      icon: <FileText size={28} />,
      title: "Objet de la campagne",
      content: "La campagne « Mobilité Solidaire CI – Un billet pour l'écologie » a pour objectif de soutenir la mobilité durable en Côte d'Ivoire et de récompenser les habitudes écoresponsables des automobilistes et usagers de la route, par l'attribution au mérite de véhicules 100 % électriques."
    },
    {
      id: 2,
      icon: <Scale size={28} />,
      title: "Nature de la campagne",
      content: "Cette campagne n'est pas un jeu de hasard, une tombola ni une loterie. Les récompenses sont attribuées sur la base du mérite, selon des critères sociaux et professionnels clairs, définis à l'avance et consultables par tous. La sélection est réalisée par un comité de jurés de manière transparente et équitable."
    },
    {
      id: 3,
      icon: <Users size={28} />,
      title: "Conditions de participation",
      content: "Peuvent participer :",
      details: [
        "Professionnels : chauffeurs VTC et taxi actifs (indépendants ou employés), conducteurs de moto-taxi et tricycle, livreurs à moto.",
        "Personnels de service : usagers engagés dans les métiers de santé, éducation, action sociale, emploi salarié ou entrepreneurial, détenteurs d'un permis de conduire et/ou d'un véhicule."
      ]
    },
    {
      id: 4,
      icon: <CheckCircle size={28} />,
      title: "Modalités de participation",
      content: "La participation se fait par un don volontaire via Mobile Money d'un montant de : 1 000 FCFA, 2 000 FCFA, 5 000 FCFA ou 10 000 FCFA. Les informations nécessaires à l'évaluation sont recueillies via la plateforme officielle : www.kyraco-ci.com."
    },
    {
      id: 5,
      icon: <Award size={28} />,
      title: "Critères d'attribution des récompenses",
      content: "Les récompenses sont attribuées au mérite en fonction de :",
      details: [
        "La situation socio-économique du participant",
        "Son engagement professionnel et/ou communautaire",
        "L'impact potentiel du véhicule électrique sur son activité et sa communauté",
        "La cohérence avec les objectifs écologiques de la campagne"
      ]
    },
    {
      id: 6,
      icon: <Award size={28} />,
      title: "Récompenses",
      content: "Les participants retenus pourront recevoir : une moto électrique, un tricycle électrique, une citadine électrique ou une berline électrique. La livraison des véhicules se fera directement au domicile des bénéficiaires, partout en Côte d'Ivoire."
    },
    {
      id: 7,
      icon: <Eye size={28} />,
      title: "Transparence",
      content: "Le comité de jurés établira un procès-verbal listant les bénéficiaires sélectionnés. Ce document pourra être rendu public pour garantir la transparence."
    },
    {
      id: 8,
      icon: <Megaphone size={28} />,
      title: "Diffusion",
      content: "Les attributions seront diffusées sur les canaux officiels de KYRACO HOLDING : YouTube, Facebook, TikTok, ainsi que dans les médias partenaires."
    },
    {
      id: 9,
      icon: <Shield size={28} />,
      title: "Acceptation du règlement",
      content: "La participation à la campagne implique l'acceptation sans réserve du présent règlement. KYRACO HOLDING se réserve le droit de modifier le présent règlement en cas de nécessité, tout en garantissant le respect des principes de transparence et d'équité."
    }
  ]

  return (
    <div className={styles.container}>
      {/* Header */}
      {/* <motion.header 
        className={styles.header}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <nav className={`${styles.glassmorphicNav} ${styles.navContainer}`}>
          <div className={styles.logoContainer}>
            <div className={styles.logo}>
              <span className={styles.logoText}>K</span>
            </div>
          </div>
          
          <h1 className={styles.navTitle}>
            Règlement Officiel
          </h1>
          
          <Link href="/" className={`${styles.pillButton} ${styles.backButton}`}>
            <ArrowLeft size={20} />
          </Link>
        </nav>
      </motion.header> */}

      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.contentContainer}>
          
          {/* Hero Section */}
          <AnimatedSection className={styles.heroSection}>
            <div className={styles.glassmorphicCard}>
              <div className={styles.heroContent}>
                <motion.div
                  className={styles.heroIcon}
                  variants={fadeIn}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.2 }}
                >
                  <FileText size={48} />
                </motion.div>
                <motion.h1 
                  className={styles.pageTitle}
                  variants={fadeIn}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.3 }}
                >
                  Règlement Officiel
                </motion.h1>
                <motion.h2 
                  className={styles.campaignTitle}
                  variants={fadeIn}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.4 }}
                >
                  Campagne Mobilité Solidaire CI
                </motion.h2>
                <motion.p 
                  className={styles.campaignSubtitle}
                  variants={fadeIn}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.5 }}
                >
                  "Un billet pour l'écologie"
                </motion.p>
              </div>
            </div>
          </AnimatedSection>

          {/* Rules Articles */}
          <motion.div 
            className={styles.rulesContainer}
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {rules.map((rule, index) => (
              <motion.article 
                key={rule.id}
                className={styles.ruleCard}
                variants={staggerItem}
              >
                <div className={styles.glassmorphicCard}>
                  <div className={styles.ruleHeader}>
                    <div className={styles.ruleIconContainer}>
                      <div className={styles.ruleIcon}>
                        {rule.icon}
                      </div>
                    </div>
                    <div className={styles.ruleTitleContainer}>
                      <span className={styles.ruleNumber}>Article {rule.id}</span>
                      <h3 className={styles.ruleTitle}>{rule.title}</h3>
                    </div>
                  </div>
                  
                  <div className={styles.ruleContent}>
                    <p className={styles.ruleText}>{rule.content}</p>
                    
                    {rule.details && (
                      <ul className={styles.ruleList}>
                        {rule.details.map((detail, detailIndex) => (
                          <li key={detailIndex} className={styles.ruleListItem}>
                            <span className={styles.bulletPoint}>•</span>
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>

          {/* Important Notice */}
          <AnimatedSection className={styles.noticeSection} delay={0.3}>
            <div className={`${styles.glassmorphicCard} ${styles.noticeCard}`}>
              <div className={styles.noticeHeader}>
                <Shield className={styles.noticeIcon} size={32} />
                <h3 className={styles.noticeTitle}>Important</h3>
              </div>
              <p className={styles.noticeText}>
                En participant à cette campagne, vous acceptez l'intégralité de ce règlement. 
                Pour toute question ou clarification, contactez-nous via nos canaux officiels.
              </p>
            </div>
          </AnimatedSection>

          {/* CTA Section */}
          <AnimatedSection className={styles.ctaSection} delay={0.4}>
            <div className={styles.glassmorphicCard}>
              <h2 className={styles.ctaTitle}>
                Prêt à participer ?
              </h2>
              <p className={styles.ctaDescription}>
                Participez à notre campagne écoresponsable et contribuez à un avenir plus vert grâce à la mobilité électrique.
              </p>
              <div className={styles.ctaButtons}>
                <Link href="/">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button className={styles.participateButton} size="lg">
                      Participer maintenant
                    </Button>
                  </motion.div>
                </Link>
                <Link href="/about">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button variant="secondary" className={styles.learnMoreButton} size="lg">
                      En savoir plus
                    </Button>
                  </motion.div>
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </main>

      {/* Footer */}
      <motion.footer 
        className={styles.footer}
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className={styles.footerContainer}>
          <p className={styles.footerCopyright}>
            © {currentYear} Kyraco Holding - Règlement officiel de la campagne "Un billet pour l'écologie"
          </p>
        </div>
      </motion.footer>
    </div>
  )
}

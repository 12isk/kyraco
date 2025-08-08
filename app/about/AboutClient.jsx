'use client'

import { Button } from '../../components/landing/Button'
import { Phone, Mail, Globe, MapPin, Users, Leaf, Heart, Shield } from 'lucide-react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import styles from './styles.module.css'

export default function About() {
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
        staggerChildren: 0.2,
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

  // Scroll-into-view wrapper
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

  const currentYear = new Date().getFullYear();

  return (
    <div className={styles.container}>
      {/* Main Content (header/menu removed) */}
      <main className={styles.main}>
        <div className={styles.contentContainer}>
          
          {/* Hero Section */}
          <AnimatedSection className={styles.heroSection}>
            <div className={styles.glassmorphicCard}>
              <div className={styles.heroContent}>
                <motion.h1 
                  className={styles.pageTitle}
                  variants={fadeIn}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.2 }}
                >
                  À propos de Kyraco
                </motion.h1>
                <motion.p 
                  className={styles.heroDescription}
                  variants={fadeIn}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.4 }}
                >
                  Une entreprise citoyenne engagée pour la transformation durable 
                  des entreprises, institutions et citoyens en Côte d'Ivoire.
                </motion.p>
              </div>
            </div>
          </AnimatedSection>

          {/* Mission Section */}
          <AnimatedSection className={styles.section} delay={0.1}>
            <div className={styles.glassmorphicCard}>
              <div className={styles.sectionHeader}>
                <Heart className={styles.sectionIcon} size={28} />
                <h2 className={styles.sectionTitle}>Notre mission</h2>
              </div>
              <p className={styles.missionText}>
                Proposer des services diversifiés, accessibles et de qualité pour 
                accompagner la transformation des entreprises, des institutions et des citoyens.
              </p>
            </div>
          </AnimatedSection>

          {/* Services Section */}
          <AnimatedSection className={styles.section} delay={0.2}>
            <div className={styles.glassmorphicCard}>
              <div className={styles.sectionHeader}>
                <Users className={styles.sectionIcon} size={28} />
                <h2 className={styles.sectionTitle}>Nos domaines d'intervention</h2>
              </div>
              
              <motion.div 
                className={styles.servicesGrid}
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
              >
                <motion.div className={styles.serviceItem} variants={staggerItem}>
                  <div className={styles.serviceIcon}>🚗</div>
                  <h3 className={styles.serviceTitle}>Transport & Mobilité</h3>
                  <p className={styles.serviceDescription}>
                    Le transport terrestre et urbain, y compris l'intégration progressive 
                    de flottes électriques.
                  </p>
                </motion.div>

                <motion.div className={styles.serviceItem} variants={staggerItem}>
                  <div className={styles.serviceIcon}>🎨</div>
                  <h3 className={styles.serviceTitle}>Communication Visuelle</h3>
                  <p className={styles.serviceDescription}>
                    La communication visuelle et digitale, du conseil stratégique 
                    à la production.
                  </p>
                </motion.div>

                <motion.div className={styles.serviceItem} variants={staggerItem}>
                  <div className={styles.serviceIcon}>🖨️</div>
                  <h3 className={styles.serviceTitle}>Impression & Équipement</h3>
                  <p className={styles.serviceDescription}>
                    L'impression professionnelle, la quincaillerie et la literie.
                  </p>
                </motion.div>

                <motion.div className={styles.serviceItem} variants={staggerItem}>
                  <div className={styles.serviceIcon}>💻</div>
                  <h3 className={styles.serviceTitle}>Solutions Numériques</h3>
                  <p className={styles.serviceDescription}>
                    La création de sites web et d'outils numériques.
                  </p>
                </motion.div>

                <motion.div className={styles.serviceItem} variants={staggerItem}>
                  <div className={styles.serviceIcon}>🌍</div>
                  <h3 className={styles.serviceTitle}>Import-Export</h3>
                  <p className={styles.serviceDescription}>
                    L'import-export de biens et matériels divers.
                  </p>
                </motion.div>
              </motion.div>
            </div>
          </AnimatedSection>

          {/* Engagement Section */}
          <AnimatedSection className={styles.section} delay={0.3}>
            <div className={styles.glassmorphicCard}>
              <div className={styles.sectionHeader}>
                <Leaf className={styles.sectionIcon} size={28} />
                <h2 className={styles.sectionTitle}>Une entreprise citoyenne engagée</h2>
              </div>
              
              <p className={styles.engagementIntro}>
                Chez KYRACO, nous croyons qu'une entreprise ne doit pas seulement produire, 
                mais aussi contribuer positivement à la société.
              </p>

              <motion.div 
                className={styles.engagementGrid}
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
              >
                <motion.div className={styles.engagementItem} variants={staggerItem}>
                  <div className={styles.engagementIcon}>👥</div>
                  <h3 className={styles.engagementTitle}>Emploi Local</h3>
                  <p className={styles.engagementDescription}>
                    Favoriser l'emploi local et la formation des jeunes.
                  </p>
                </motion.div>

                <motion.div className={styles.engagementItem} variants={staggerItem}>
                  <div className={styles.engagementIcon}>🌱</div>
                  <h3 className={styles.engagementTitle}>Écoresponsabilité</h3>
                  <p className={styles.engagementDescription}>
                    Réduire notre impact environnemental avec des solutions écoresponsables.
                  </p>
                </motion.div>

                <motion.div className={styles.engagementItem} variants={staggerItem}>
                  <div className={styles.engagementIcon}>❤️</div>
                  <h3 className={styles.engagementTitle}>Initiatives Sociales</h3>
                  <p className={styles.engagementDescription}>
                    Soutenir des initiatives sociales dans l'éducation, la santé, l'insertion.
                  </p>
                </motion.div>

                <motion.div className={styles.engagementItem} variants={staggerItem}>
                  <div className={styles.engagementIcon}>✨</div>
                  <h3 className={styles.engagementTitle}>Innovation Inclusive</h3>
                  <p className={styles.engagementDescription}>
                    Encourager la transparence, l'éthique et l'innovation inclusive.
                  </p>
                </motion.div>
              </motion.div>
            </div>
          </AnimatedSection>

          {/* Legal Information */}
          <AnimatedSection className={styles.section} delay={0.4}>
            <div className={styles.glassmorphicCard}>
              <div className={styles.sectionHeader}>
                <Shield className={styles.sectionIcon} size={28} />
                <h2 className={styles.sectionTitle}>Informations légales</h2>
              </div>
              
              <div className={styles.legalInfo}>
                <motion.p 
                  className={styles.legalText}
                  variants={fadeIn}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  <strong>KYRACO HOLDING</strong> est une SARL Unipersonnelle enregistrée au 
                  RCCM n° <strong>CI-ABJ-03-2022-M-16830</strong>, avec un capital social de 
                  <strong> 5.000.000 FCFA</strong>.
                </motion.p>
                
                <motion.div 
                  className={styles.addressInfo}
                  variants={fadeInUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                >
                  <MapPin className={styles.addressIcon} size={18} />
                  <div className={styles.addressText}>
                    <strong>Siège social :</strong><br />
                    Abidjan, Cocody – Riviera Bonoumin<br />
                    Cité EMERAUDE 4, Lot 371 – ilot 23
                  </div>
                </motion.div>
              </div>
            </div>
          </AnimatedSection>

          {/* Contact Section */}
          <AnimatedSection className={styles.section} delay={0.5}>
            <div className={styles.glassmorphicCard}>
              <div className={styles.sectionHeader}>
                <Phone className={styles.sectionIcon} size={28} />
                <h2 className={styles.sectionTitle}>Contact</h2>
              </div>
              
              <motion.div 
                className={styles.contactGrid}
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
              >
                <motion.a 
                  href="tel:+22507079823880" 
                  className={styles.contactItem}
                  variants={staggerItem}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Phone className={styles.contactIcon} size={18} />
                  <span className={styles.contactText}>+225 07 07 98 23 80</span>
                </motion.a>

                <motion.a 
                  href="mailto:infos@kyraco-ci.com" 
                  className={styles.contactItem}
                  variants={staggerItem}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Mail className={styles.contactIcon} size={18} />
                  <span className={styles.contactText}>infos@kyraco-ci.com</span>
                </motion.a>

                <motion.a 
                  href="https://www.kyraco-ci.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={styles.contactItem}
                  variants={staggerItem}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Globe className={styles.contactIcon} size={18} />
                  <span className={styles.contactText}>www.kyraco-ci.com</span>
                </motion.a>
              </motion.div>
            </div>
          </AnimatedSection>

          {/* CTA Section */}
          <AnimatedSection className={styles.ctaSection} delay={0.6}>
            <div className={styles.glassmorphicCard}>
              <motion.h2 
                className={styles.ctaTitle}
                variants={fadeIn}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                Rejoignez notre mission pour l'écologie
              </motion.h2>
              <motion.p 
                className={styles.ctaDescription}
                variants={fadeIn}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                Participez à notre campagne écoresponsable et
                contribuez à un avenir plus vert grâce à la mobilité électrique.
              </motion.p>
              <motion.div
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                <Link href="/">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button className={styles.ctaButton} size="lg">
                      Participer à la campagne
                    </Button>
                  </motion.div>
                </Link>
              </motion.div>
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
            © {currentYear} Kyraco Holding - Mobilité Électrique
          </p>
        </div>
      </motion.footer>
    </div>
  )
}

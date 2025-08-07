'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '../../components/Button'
import { CheckCircle, XCircle, Loader2, ArrowLeft, Share2, Phone } from 'lucide-react'
import Link from 'next/link'
import styles from './styles.module.css'

export default function ThankYou() {
  const params = useSearchParams()
  const donationId = params.get('donationId')
  const [status, setStatus] = useState('Vérification…')
  const [isComplete, setIsComplete] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  // fetch the Wave session ID from your DB
  async function getWaveSessionId(donationId) {
    const res = await fetch(`/api/donations/search?id=${donationId}`)
    if (!res.ok) throw new Error(`Erreur: ${res.statusText}`)
    const { donation } = await res.json()
    return donation.wave_session_id
  }

  useEffect(() => {
    if (!donationId) {
      setStatus("Aucun don spécifié.")
      setError(true)
      setIsLoading(false)
      return
    }

    // wrap async work in a function
    async function verify() {
      try {
        setIsLoading(true)
        const waveSessionId = await getWaveSessionId(donationId)
        if (!waveSessionId) {
          setStatus("Impossible de récupérer la session Wave.")
          setError(true)
          setIsLoading(false)
          return
        }

        const res = await fetch(
          `/api/donations/verify?session_id=${waveSessionId}`
        )
        if (!res.ok) throw new Error(res.statusText)
        
        const { complete } = await res.json()
        
        if (complete) {
          setStatus('Votre don est confirmé ! 🎉')
          setIsComplete(true)
        } else {
          setStatus('En attente de confirmation…')
          setIsComplete(false)
        }
        setError(false)
      } catch (err) {
        console.error(err)
        setStatus('Erreur lors de la vérification.')
        setError(true)
      } finally {
        setIsLoading(false)
      }
    }

    verify()
  }, [donationId])

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Un Billet pour l\'Écologie',
          text: 'Je viens de participer au tirage pour gagner un véhicule électrique !',
          url: window.location.origin,
        })
      } catch (err) {
        console.log('Erreur lors du partage:', err)
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.origin)
      alert('Lien copié dans le presse-papiers !')
    }
  }

  return (
    <div className={styles.container}>
      {/* Background Video */}
      <video
        className={styles.videoBackground}
        autoPlay
        muted
        loop
        playsInline
        webkit-playsinline="true"
      >
        <source src="/media/videos/campaign2.webm" type="video/webm" />
        <source src="/media/videos/campaign2.mp4" type="video/mp4" />
      </video>
      <div className={styles.videoBackgroundOverlay} />

      {/* Header */}
      <header className={styles.header}>
        <nav className={`${styles.glassmorphicNav} ${styles.navContainer}`}>
          <div className={styles.logoContainer}>
            <div className={styles.logo}>
              <span className={styles.logoText}>K</span>
            </div>
          </div>
          
          <h1 className={styles.navTitle}>
            Un Billet pour l'Écologie
          </h1>
          
          <Link href="/" className={`${styles.pillButton} ${styles.backButton}`}>
            <ArrowLeft size={20} />
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.contentContainer}>
          <div className={styles.glassmorphicCard}>
            
            {/* Status Icon */}
            <div className={styles.iconContainer}>
              {isLoading && (
                <Loader2 className={`${styles.icon} ${styles.loading}`} size={64} />
              )}
              {!isLoading && isComplete && (
                <CheckCircle className={`${styles.icon} ${styles.success}`} size={64} />
              )}
              {!isLoading && error && (
                <XCircle className={`${styles.icon} ${styles.error}`} size={64} />
              )}
              {!isLoading && !isComplete && !error && (
                <Loader2 className={`${styles.icon} ${styles.pending}`} size={64} />
              )}
            </div>

            {/* Title */}
            <h1 className={styles.title}>
              {isComplete ? 'Félicitations !' : error ? 'Oups !' : 'Vérification...'}
            </h1>

            {/* Status Message */}
            <p className={styles.statusMessage}>
              {status}
            </p>

            {/* Success Content */}
            {isComplete && (
              <div className={styles.successContent}>
                <div className={styles.successDetails}>
                  <h2 className={styles.successTitle}>
                    Votre participation est confirmée
                  </h2>
                  <p className={styles.successDescription}>
                    Merci pour votre contribution à la mobilité électrique en Côte d'Ivoire. 
                    Vous recevrez un email de confirmation avec tous les détails du tirage.
                  </p>
                  
                  <div className={styles.nextSteps}>
                    <h3 className={styles.nextStepsTitle}>Prochaines étapes :</h3>
                    <ul className={styles.stepsList}>
                      <li>📧 Vérifiez votre email pour la confirmation</li>
                      <li>📱 Suivez-nous pour les mises à jour du tirage</li>
                      <li>🎯 Le tirage aura lieu bientôt</li>
                      <li>🚗 Livraison gratuite si vous gagnez</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Error Content */}
            {error && (
              <div className={styles.errorContent}>
                <p className={styles.errorDescription}>
                  Une erreur s'est produite lors de la vérification de votre don. 
                  Veuillez contacter notre support si le problème persiste.
                </p>
                <div className={styles.contactInfo}>
                  <Phone size={16} />
                  <span>Contact: +225 XX XX XX XX</span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className={styles.actionButtons}>
              {isComplete && (
                <>
                  <Button
                    onClick={handleShare}
                    variant="secondary"
                    className={styles.shareButton}
                  >
                    <Share2 size={16} />
                    Partager
                  </Button>
                  <Link href="/">
                    <Button className={styles.homeButton}>
                      Retour à l'accueil
                    </Button>
                  </Link>
                </>
              )}
              
              {error && (
                <Link href="/">
                  <Button className={styles.homeButton}>
                    Retour à l'accueil
                  </Button>
                </Link>
              )}
              
              {!isLoading && !isComplete && !error && (
                <Button
                  onClick={() => window.location.reload()}
                  className={styles.retryButton}
                >
                  Réessayer
                </Button>
              )}
            </div>

            {/* Donation ID */}
            {donationId && (
              <div className={styles.donationId}>
                <small>ID de don: {donationId}</small>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <p className={styles.footerCopyright}>
            Powered by Kyraco - Mobilité Électrique
          </p>
        </div>
      </footer>
    </div>
  )
}

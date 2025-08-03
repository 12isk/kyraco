import React from 'react'
import styles from './styles.module.css'
import GenericBtn from '../buttons/genericBtn'
import Link from 'next/link'

export default function Campaign() {
  return (
    <div className={styles.campaignContainer}>
      <video className={styles.campaignVid} loop autoPlay muted src="media/videos/campaign1.webm"/>
        <div className={styles.campaignOverlayText}>
        <h2 className={styles.campaignTitle}>Mobilité Solidaire </h2>
        <p className={styles.campaignDesc}>
            Rejoignez notre initiative citoyenne pour offrir des véhicules électriques aux professionnels du transport. Ensemble, construisons une mobilité plus verte en Côte d'Ivoire.
        </p>
        
      </div>
      <div className={styles.campaignBtnContainer}>
        <Link href="/campaign">
          <GenericBtn text="Participer" />
        </Link>
      </div>
      <div className={styles.campaignOverlay}>


      </div>
      
      
      
    </div>
  )
}

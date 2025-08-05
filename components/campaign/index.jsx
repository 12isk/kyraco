import Link from 'next/link'
import React from 'react'

import GenericBtn from '../buttons/genericBtn'
import styles from './styles.module.css'

export default function Campaign() {
  return (
    <>
    
    <div className={styles.campaignContainer}>
      <video className={styles.campaignVid} 
        preload="auto" loop 
        autoPlay muted 
        playsInline                
        webkit-playsinline="true" 
        src="media/videos/campaign2.webm"/>
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
    </>
  )
}

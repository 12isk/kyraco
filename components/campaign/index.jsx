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
        src="/media/videos/campaign3.mp4"/>
        <div className={styles.campaignOverlayText}>
        <h2 className={styles.campaignTitle}>Mobilité Solidaire </h2>
        <p className={styles.campaignDesc}>
            Participez à notre campagne de dons et devenez Écomobiliste.
            Votre geste pour un avenir plus vert.
        </p>
        
      </div>
      <div className={styles.campaignBtnContainer}>
        <Link href="/landing">
          <GenericBtn text="Participer" />
        </Link>
      </div>
      <div className={styles.campaignOverlay}>


      </div>
      
      
      
    </div>
    </>
  )
}

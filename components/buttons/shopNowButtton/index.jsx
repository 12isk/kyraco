"use client";
import React, { useState } from 'react'
import { motion } from 'motion/react'
import styles from './styles.module.css'

export default function ShopNowButton() {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
      <motion.div className={styles.buttonContainer}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        animate={{ 
          borderColor: isHovered ? '#848482' : 'transparent' // Move border animation here
        }}
        transition={{
          duration: 0.2,
          delay: 0.1,
          ease: [0.87, 0, 0.13, 1]
        }}
      >
        <motion.div className={styles.circle}
          animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 25 : 1 }}
          transition={{
            duration: 0.4,
            delay: 0.1,
            ease: [0.87, 0, 0.13, 1]
          }}
        />
        <motion.button className={styles.shopNowButton}>
           <motion.span className={styles.shopNowText}
            animate={{ color: isHovered ? '#fff' : '#000' }}
            transition={{
              duration: 0.3,
              delay: 0.1,
              ease: [0.87, 0, 0.13, 1]
            }}
           >
             Acheter
           </motion.span>
        </motion.button>
      </motion.div>
  )
}
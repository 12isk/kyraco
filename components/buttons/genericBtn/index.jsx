"use client";
import React, { useState } from 'react'
import { motion } from 'motion/react'
import styles from './styles.module.css'

export default function GenericBtn({text, onClick}) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
      <div className={styles.genericBtnContainer}>
        <div className={styles.bg}></div>
        <div className={styles.text}>{text}</div>

      </div>
  )
}
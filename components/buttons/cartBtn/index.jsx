"use client";
import React, { useState } from 'react'
import styles from './styles.module.css'

export default function CartBtn({text, onClick}) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
      <div className={styles.cartBtnContainer} onClick={onClick}>
        <div className={styles.bg}></div>
        <div className={styles.text}>{text}</div>

      </div>
  )
}
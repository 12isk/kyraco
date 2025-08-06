import React from 'react'
import styles from './Label.module.css'

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode
  required?: boolean
}

export const Label: React.FC<LabelProps> = ({ 
  className = '', 
  children, 
  required = false,
  ...props 
}) => {
  return (
    <label
      className={`${styles.label} ${className}`}
      {...props}
    >
      {children}
      {required && <span className={styles.required}>*</span>}
    </label>
  )
}

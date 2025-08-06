import React from 'react'
import styles from './Input.module.css'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
}

export const Input: React.FC<InputProps> = ({ 
  className = '', 
  error = false,
  ...props 
}) => {
  return (
    <input
      className={`${styles.input} ${error ? styles.error : ''} ${className}`}
      {...props}
    />
  )
}

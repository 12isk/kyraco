import React, { createContext, useContext } from 'react'
import styles from './RadioGroup.module.css'

interface RadioGroupProps {
  value?: string
  onValueChange?: (value: string) => void
  className?: string
  children: React.ReactNode
}

interface RadioGroupItemProps {
  value: string
  id: string
  className?: string
}

const RadioGroupContext = createContext<{
  value?: string
  onValueChange?: (value: string) => void
}>({})

export const RadioGroup: React.FC<RadioGroupProps> = ({
  value,
  onValueChange,
  className = '',
  children
}) => {
  return (
    <RadioGroupContext.Provider value={{ value, onValueChange }}>
      <div className={`${styles.radioGroup} ${className}`} role="radiogroup">
        {children}
      </div>
    </RadioGroupContext.Provider>
  )
}

export const RadioGroupItem: React.FC<RadioGroupItemProps> = ({
  value,
  id,
  className = ''
}) => {
  const { value: groupValue, onValueChange } = useContext(RadioGroupContext)
  const isChecked = groupValue === value

  return (
    <input
      type="radio"
      id={id}
      value={value}
      checked={isChecked}
      onChange={() => onValueChange?.(value)}
      className={`${styles.radioInput} ${className}`}
      role="radio"
      aria-checked={isChecked}
    />
  )
}

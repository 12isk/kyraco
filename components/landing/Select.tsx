import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import styles from './Select.module.css'

interface SelectProps {
  onValueChange?: (value: string) => void
  defaultValue?: string
  /** Optional: set the initial visible label when defaultValue is provided */
  defaultLabel?: string
  children: React.ReactNode
}

interface SelectTriggerProps {
  className?: string
  children: React.ReactNode
}

interface SelectContentProps {
  className?: string
  children: React.ReactNode
}

interface SelectItemProps {
  value: string
  /** Optional explicit label; falls back to children text */
  label?: string
  children: React.ReactNode
}

interface SelectValueProps {
  placeholder?: string
}

type Ctx = {
  value: string
  label: string
  setSelected: (value: string, label: string) => void
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

const SelectContext = React.createContext<Ctx>({
  value: '',
  label: '',
  setSelected: () => {},
  isOpen: false,
  setIsOpen: () => {},
})

export const Select: React.FC<SelectProps> = ({
  onValueChange,
  defaultValue = '',
  defaultLabel = '',
  children,
}) => {
  const [value, setValue] = useState(defaultValue)
  const [label, setLabel] = useState(defaultLabel)
  const [isOpen, setIsOpen] = useState(false)
  const selectRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const setSelected = (newValue: string, newLabel: string) => {
    setValue(newValue)
    setLabel(newLabel)
    setIsOpen(false)
    onValueChange?.(newValue) // still returns the slug/value to your form state
  }

  return (
    <SelectContext.Provider value={{ value, label, setSelected, isOpen, setIsOpen }}>
      <div className={styles.selectContainer} ref={selectRef}>
        {children}
      </div>
    </SelectContext.Provider>
  )
}

export const SelectTrigger: React.FC<SelectTriggerProps> = ({ className = '', children }) => {
  const { isOpen, setIsOpen } = React.useContext(SelectContext)
  return (
    <button
      type="button"
      className={`${styles.selectTrigger} ${className}`}
      onClick={() => setIsOpen(!isOpen)}
      aria-expanded={isOpen}
    >
      {children}
      <ChevronDown
        size={16}
        className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}
      />
    </button>
  )
}

export const SelectValue: React.FC<SelectValueProps> = ({ placeholder }) => {
  const { label } = React.useContext(SelectContext)
  return <span className={styles.selectValue}>{label || placeholder}</span>
}

export const SelectContent: React.FC<SelectContentProps> = ({ className = '', children }) => {
  const { isOpen } = React.useContext(SelectContext)
  if (!isOpen) return null
  return <div className={`${styles.selectContent} ${className}`}>{children}</div>
}

export const SelectItem: React.FC<SelectItemProps> = ({ value, label, children }) => {
  const { setSelected, value: selectedValue } = React.useContext(SelectContext)

  // Derive label from prop or from plain-text children
  const derivedLabel =
    label ??
    (typeof children === 'string'
      ? children
      : Array.isArray(children)
      ? children.join('')
      : String(value))

  return (
    <button
      type="button"
      className={`${styles.selectItem} ${selectedValue === value ? styles.selected : ''}`}
      onClick={() => setSelected(value, derivedLabel)}
    >
      {children}
    </button>
  )
}

import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import styles from './Select.module.css'

interface SelectProps {
  onValueChange?: (value: string) => void
  defaultValue?: string
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
  children: React.ReactNode
}

interface SelectValueProps {
  placeholder?: string
}

const SelectContext = React.createContext<{
  value: string
  setValue: (value: string) => void
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  placeholder?: string
}>({
  value: '',
  setValue: () => {},
  isOpen: false,
  setIsOpen: () => {},
})

export const Select: React.FC<SelectProps> = ({ 
  onValueChange, 
  defaultValue = '', 
  children 
}) => {
  const [value, setValue] = useState(defaultValue)
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

  const handleValueChange = (newValue: string) => {
    setValue(newValue)
    setIsOpen(false)
    onValueChange?.(newValue)
  }

  return (
    <SelectContext.Provider value={{ 
      value, 
      setValue: handleValueChange, 
      isOpen, 
      setIsOpen,
    }}>
      <div className={styles.selectContainer} ref={selectRef}>
        {children}
      </div>
    </SelectContext.Provider>
  )
}

export const SelectTrigger: React.FC<SelectTriggerProps> = ({ 
  className = '', 
  children 
}) => {
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
  const { value } = React.useContext(SelectContext)
  
  return (
    <span className={styles.selectValue}>
      {value || placeholder}
    </span>
  )
}

export const SelectContent: React.FC<SelectContentProps> = ({ 
  className = '', 
  children 
}) => {
  const { isOpen } = React.useContext(SelectContext)

  if (!isOpen) return null

  return (
    <div className={`${styles.selectContent} ${className}`}>
      {children}
    </div>
  )
}

export const SelectItem: React.FC<SelectItemProps> = ({ value, children }) => {
  const { setValue, value: selectedValue } = React.useContext(SelectContext)

  return (
    <button
      type="button"
      className={`${styles.selectItem} ${selectedValue === value ? styles.selected : ''}`}
      onClick={() => setValue(value)}
    >
      {children}
    </button>
  )
}

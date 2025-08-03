import React from 'react';
import styles from './styles.module.css';

export default function ProductGrid({ 
  children, 
  columns = "auto-fill", 
  minItemWidth = "280px",
  gap = "30px",
  className = "" 
}) {
  const gridStyle = {
    '--min-item-width': minItemWidth,
    '--grid-gap': gap,
    '--grid-columns': columns === "auto-fill" 
      ? `repeat(auto-fill, minmax(var(--min-item-width), 1fr))`
      : `repeat(${columns}, 1fr)`
  };

  return (
    <div 
      className={`${styles.productGrid} ${className}`}
      style={gridStyle}
    >
      {children}
    </div>
  );
}
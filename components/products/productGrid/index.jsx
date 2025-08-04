import ProductCard from '../productCards';
import styles from './styles.module.css';
// ProductGrid.jsx
import React from 'react';

const ProductGrid = React.memo(({ 
  products, 
  hoveredProduct, 
  onProductHover 
}) => {
  return (
    <div className={styles.productGrid}>
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          isHovered={hoveredProduct === product.id}
          isBlurred={hoveredProduct && hoveredProduct !== product.id}
          onHover={onProductHover}
        />
      ))}
    </div>
  );
});

ProductGrid.displayName = 'ProductGrid';

export default ProductGrid;
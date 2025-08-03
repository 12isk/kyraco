// ProductCard.jsx
import React from 'react';
import Image from 'next/image';
import styles from './ProductCard.module.css';

export default function ProductCard({ 
  product,
  className = ""
}) {

  return (
    <div className={`${styles.productCard} ${className}`}>
      {/* Product Image */}
      <div className={styles.imageContainer}>
        <Image
          src={product.image}
          alt={product.name}
          width={400}
          height={400}
          className={styles.productImage}
          priority={false}
        />
        
        {product.onSale && (
          <div className={styles.saleBadge}>Sale</div>
        )}
      </div>
      
      <div className={styles.productInfo}>
        {product.brand && (
          <p className={styles.productBrand}>{product.brand}</p>
        )}
        <h3 className={styles.productName}>{product.name}</h3>
        
        <div className={styles.priceContainer}>
          {product.originalPrice && product.originalPrice !== product.price && (
            <span className={styles.originalPrice}>{product.originalPrice}</span>
          )}
          <span className={styles.productPrice}>{product.price}</span>
        </div>
        
        {product.selection && (
          <p className={styles.productSelection}>{product.selection}</p>
        )}
        
        {product.rating && (
          <div className={styles.rating}>
            <span className={styles.stars}>{'★'.repeat(Math.floor(product.rating))}</span>
            <span className={styles.ratingText}>({product.reviewCount || 0})</span>
          </div>
        )}
      </div>
    </div>
  );
}
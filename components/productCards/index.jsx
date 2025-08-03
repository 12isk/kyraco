// ProductCard.jsx
import React from 'react';
import Image from 'next/image';
import styles from './styles.module.css';

export default function ProductCard({
  product,
  className = ""
}) {

    // Add this helper function at the top
    const formatPrice = (price) => {
        return new Intl.NumberFormat('fr-CI', {
            style: 'currency',
            currency: 'XOF' // West African CFA franc for Côte d'Ivoire
        }).format(price);
    };
    
  return (
    <div className={`${styles.productCard} ${className}`}>
      <div className={styles.imageContainer}>
        {/* Show only the first image for the product card */}
        {product.images && product.images.length > 0 && (
          <Image
            src={product.images[0]}
            alt={product.name}
            width={400}
            height={400}
            className={styles.productImage}
            priority={false}
          />
        )}
       
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
          <span className={styles.productPrice}>{formatPrice(product.price)}</span>
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
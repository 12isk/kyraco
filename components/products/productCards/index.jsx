import styles from './styles.module.css';
import Image from 'next/image';
import Link from 'next/link';
// ProductCard.jsx
import React, { useCallback } from 'react';

const ProductCard = React.memo(({
  product,
  isHovered,
  isBlurred,
  onHover
}) => {
  // Format price helper
  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-CI', {
      style: 'currency',
      currency: 'XOF'
    }).format(price);
  };

  const handleMouseEnter = useCallback(() => {
    onHover(product.id, true);
  }, [product.id, onHover]);

  const handleMouseLeave = useCallback(() => {
    onHover(product.id, false);
  }, [product.id, onHover]);

  return (
    <Link href={`/products/${product.id}`} className={styles.cardLink}>
      <div 
        className={`${styles.productCard} ${isBlurred ? styles.blurred : ''} ${isHovered ? styles.hovered : ''}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className={styles.imageContainer}>
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
          <h3 className={styles.productName}>{product.name}</h3>
          
          <div className={styles.priceContainer}>
            {product.originalPrice && product.originalPrice !== product.price && (
              <span className={styles.originalPrice}>
                {formatPrice(product.originalPrice)}
              </span>
            )}
            <span className={styles.productPrice}>
              {formatPrice(product.price)}
            </span>
          </div>
          
          {product.category && (
            <span className={styles.category}>{product.category}</span>
          )}
        </div>
      </div>
    </Link>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;
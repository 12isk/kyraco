"use client";
import React, { useState, useRef, useEffect } from "react";
import styles from "./styles.module.css";
import GenericBtn from "@/components/buttons/genericBtn";
import CartBtn from "@/components/buttons/cartBtn";
import ReturnBtn from "@/components/buttons/returnBtn";
import { useCart } from "@/app/CartContext";

export default function ProductPage({ product }) {
  const [isMobile, setIsMobile] = useState(false);
  const { cart, addItem } = useCart();

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      variant: product.variant,
      image: product.images[0],
      quantity: 1,
    });
    alert("Produit ajouté au panier !");
  }
    

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <>
    
    <div className={styles.page}>
      

      <div className={styles.container}>
        {/* Thumbnails - Hidden on mobile */}
        {!isMobile && (
          <div className={styles.thumbnails}>
            {product.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`thumb-${idx}`}
                onClick={() => window.scrollTo({ top: idx * window.innerHeight, behavior: "smooth" })}
                className={`${styles.thumbnail}`}
              />
            ))}
          </div>
        )}

        {/* Main Image Scroll or Slider */}
        <div className={isMobile ? styles.mobileSlider : styles.mainImageContainer}>
          {product.images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`product-${idx}`}
              className={styles.mainImage}
            />
          ))}
        </div>

        {/* Product Info */}
        <div className={styles.info}>
          <h2 className={styles.name}>{product.name}</h2>
          <p className={styles.subcategory}>{product.category}</p>
          <p className={styles.price}>CFA{product.price.toLocaleString()}</p>
          <p className={styles.description}>{product.description}</p>

          <div className={styles.actions}>
            <CartBtn text="Ajouter au panier" onClick={handleAddToCart} />
          </div>
        </div>
      </div>
    </div>
    </>
    
  );
}

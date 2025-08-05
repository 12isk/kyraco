"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "./styles.module.css";
import CartBtn from "@/components/buttons/cartBtn";
import { useCart } from "@/app/CartContext";

export default function ProductPage({ product }) {
  const [isMobile, setIsMobile] = useState(false);
  const { addItem } = useCart();

  // Slider state for mobile
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const sliderRef = useRef(null);

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // On scroll, update current slide index
  const handleSliderScroll = useCallback(() => {
    if (!sliderRef.current) return;
    const scrollLeft = sliderRef.current.scrollLeft;
    const width = sliderRef.current.offsetWidth;
    const idx = Math.round(scrollLeft / width);
    setCurrentImageIndex(idx);
  }, []);

  // Jump to a slide when indicator clicked
  const goToSlide = useCallback((idx) => {
    if (!sliderRef.current) return;
    const width = sliderRef.current.offsetWidth;
    sliderRef.current.scrollTo({ left: idx * width, behavior: "smooth" });
    setCurrentImageIndex(idx);
  }, []);

  // Add to cart handler
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
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Desktop thumbnails */}
        {!isMobile && (
          <div className={styles.thumbnails}>
            {product.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`thumb-${idx}`}
                onClick={() => setCurrentImageIndex(idx)}
                className={`${styles.thumbnail} ${
                  idx === currentImageIndex ? styles.activeThumbnail : ""
                }`}
              />
            ))}
          </div>
        )}

        {/* Image display */}
        <div
          className={
            isMobile
              ? styles.mobileImageSection
              : styles.mainImageContainer
          }
        >
          {isMobile ? (
            <>
              <div
                ref={sliderRef}
                onScroll={handleSliderScroll}
                className={styles.mobileSlider}
              >
                {product.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`product-${idx}`}
                    className={styles.mobileImage}
                  />
                ))}
              </div>
              <div className={styles.sliderIndicators}>
                {product.images.map((_, idx) => (
                  <button
                    key={idx}
                    className={`${styles.lineIndicator} ${
                      idx === currentImageIndex
                        ? styles.activeLineIndicator
                        : ""
                    }`}
                    onClick={() => goToSlide(idx)}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className={styles.desktopImageContainer}>
              <img
                src={product.images[currentImageIndex]}
                alt="product"
                className={styles.mainImage}
              />
            </div>
          )}
        </div>

        {/* Product info */}
        <div className={styles.info}>
          <h2 className={styles.name}>{product.name}</h2>
          <p className={styles.subcategory}>{product.category}</p>
          <p className={styles.price}>
            CFA{product.price.toLocaleString()}
          </p>
          <p className={styles.description}>{product.description}</p>
          <div className={styles.actions}>
            <CartBtn
              text="Ajouter au panier"
              onClick={handleAddToCart}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

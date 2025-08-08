"use client";
import React, { useState, useEffect } from 'react'
import ProductGrid from '@/components/products/productGrid';
import ProductCard from '@/components/products/productCards';
import styles from './styles.module.css';
import ProductGridContainer from '@/components/products/productContainer';

export default function page() {
    return (
        <div className={styles.pageContainer}>
            <ProductGridContainer />
        </div>
    );
    
}
"use client";
import { supabase } from '@/lib/supabase';
import React, { useState, useEffect } from 'react'
import ProductGrid from '@/components/productGrid';
import ProductCard from '@/components/productCards';
import styles from './styles.module.css';

export default function page() {
    const [products, setProducts] = useState([]);
    
    const fetchProducts = async () => {
        const {data, error} = await supabase
            .from('products')
            .select('*')
            .eq('active', true);
       
        if (error) {
            console.error('Error fetching products:', error);
            throw error;
        }
        setProducts(data);
        console.log('Fetched products:', data);
    }

    useEffect(() => {
        fetchProducts().catch(console.error);
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.gridWrapper}>
                <ProductGrid columns={4}>
                    {products.map(product => (
                        <ProductCard
                            key={product.id}
                            product={product}
                        />
                    ))}
                </ProductGrid>
            </div>
        </div>
    )
}
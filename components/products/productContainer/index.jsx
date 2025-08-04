// ProductGridContainer.jsx
"use client";
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import ProductGrid from '../productGrid';
import ProductCard from '../productCards';
import FilterControls from '../filterControls';
import styles from './styles.module.css';

// Custom hook for hover state management
const useProductHover = () => {
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const timeoutRef = useRef();

  const handleProductHover = useCallback((productId, isHovered) => {
    clearTimeout(timeoutRef.current);
    
    if (isHovered) {
      setHoveredProduct(productId);
    } else {
      timeoutRef.current = setTimeout(() => {
        setHoveredProduct(null);
      }, 50);
    }
  }, []);

  return [hoveredProduct, handleProductHover];
};

// Main container component
export default function ProductGridContainer() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: 'all',
    sort: 'name'
  });
  
  const [hoveredProduct, handleProductHover] = useProductHover();

  // Fetch products from Supabase
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('active', true);

      if (error) throw error;
      setProducts(data);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Filter by category
    if (filters.category !== 'all') {
      filtered = filtered.filter(product => 
        product.category === filters.category
      );
    }

    // Sort products
    switch (filters.sort) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
      default:
        filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    return filtered;
  }, [products, filters]);

  // Get unique categories
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(products.map(p => p.category).filter(Boolean))];
    return ['all', ...uniqueCategories];
  }, [products]);

  if (loading) {
    return (
      <div className={styles.container} >
        <div className={styles.loading}>Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container} >
        <div className={styles.error}>{error}</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <FilterControls
        filters={filters}
        onFiltersChange={setFilters}
        categories={categories}
        productCount={filteredProducts.length}
      />
      
      <ProductGrid
        products={filteredProducts}
        hoveredProduct={hoveredProduct}
        onProductHover={handleProductHover}
      />
    </div>
  );
}
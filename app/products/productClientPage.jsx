"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import ProductPage from '@/components/products/productPage';

export default function ProductClientPage({ slug }) {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) {
        console.error('Error fetching product:', error);
        setProduct(null);
        return;
      }

      setProduct(data);
    };

    if (slug) fetchProduct();
  }, [slug]);

  if (!product) return <div>Product not found</div>;

  return <ProductPage product={product} />;
}

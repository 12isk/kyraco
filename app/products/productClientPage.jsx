"use client";

import { useEffect, useState } from 'react';
import { supabaseBrowser as supabase } from '@/lib/supabaseBrowser';
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

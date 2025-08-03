"use client";

import { supabase } from '@/lib/supabase';
import React, { useState, useEffect } from 'react'

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
    }
    // Fetch products from Supabase or any other source
    useEffect(() => {
        fetchProducts().catch(console.error);
    });

  return (
    <div>
      we showing products here
    </div>
  )
}

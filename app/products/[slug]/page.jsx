// import ProductClientPage from '../productClientPage';

// export default function Page({ params }) {
//   // ✅ still works for now — future versions may require use()
//   return <ProductClientPage slug={params.slug} />;
// }


import ProductPage from '@/components/products/productPage';
import { supabase } from '@/lib/supabase';

export default async function Page({ params }) {
  const { slug } = params;

  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!product || error) {
    return <div>Product not found</div>;
  }

  return (
    <div style={{ background: 'white',}}>
        <ProductPage product={product} />
    </div>
    
);
}

// app/page.js
import Campaign from '@/components/campaign'
import Hero from '@/components/hero'
import HoriScroll from '@/components/horiScroll'
import Menu from '@/components/menu'
import { supabase } from '@/lib/supabase'

export default async function Home() {

  return (
    <>
      <Hero />
      <Campaign />
      {/* <HoriScroll /> */}
    </>
    
  )

  // Fetch products
  // const { data: products, error } = await supabase
  //   .from('products')
  //   .select('*')
  //   .eq('active', true)

  // if (error) {
  //   console.error('Error:', error)
  //   return <div>Error loading products</div>
  // }

  // return (
  //   <div className="p-8">
  //     <h1 className="text-2xl font-bold mb-6">Products</h1>
  //     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  //       {products?.map(product => (
  //         <div key={product.id} className="border p-4 rounded">
  //           <h2 className="font-bold">{product.name}</h2>
  //           <p>{product.description}</p>
  //           <p className="text-xl">{product.price} FCFA</p>
  //         </div>
  //       ))}
  //     </div>
  //   </div>
  // )


}
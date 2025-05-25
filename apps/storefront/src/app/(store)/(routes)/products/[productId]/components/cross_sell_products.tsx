import { Product } from '@prisma/client'
import Link from 'next/link'

interface CrossSellProductsProps {
   products: Product[]
}

export function CrossSellProducts({ products }: CrossSellProductsProps) {
   return (
      <div className="mt-12">
         <h2 className="text-2xl font-semibold mb-4">You might also like</h2>
         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.map((product) => (
               <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="block border rounded-lg overflow-hidden hover:shadow-lg transition"
               >
                  <img
                     src={product.images[0]}
                     alt={product.title}
                     className="w-full h-40 object-cover"
                  />

                  <div className="p-2">
                     <h3 className="text-lg font-semibold">{product.title}</h3>
                     <p className="text-sm text-gray-600">
                        {product.description}
                     </p>
                     <span className="text-green-600 font-bold">
                        ${product.price}
                     </span>
                  </div>
               </Link>
            ))}
         </div>
      </div>
   )
}

// app/shop/[id]/page.tsx (Server Component)
import ProductPageClient from "./product-page-client"
import { products } from "@/data/products"

interface PageProps {
  params: {
    id: string
  }
}

export default async function ProductPage({ params }: PageProps) {
  const product = products.find((p) => p.id === params.id)

  if (!product) return null

  const fixedProduct = { ...product, price: Number(product.price) }

  return <ProductPageClient product={await Promise.resolve(fixedProduct)} />
}

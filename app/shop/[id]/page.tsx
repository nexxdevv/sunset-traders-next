import ProductPageClient from "./product-page-client"
import { products } from "@/data/products"

export default async function ProductPage({
  params
}: {
  params: { id: string }
}) {
  const product = products.find((p) => p.id === params.id)

  if (!product) {
    // This still works in server components
    return null
  }

  // Convert price to number if product exists
  const fixedProduct = product
    ? { ...product, price: Number(product.price) }
    : undefined

  return fixedProduct ? <ProductPageClient product={fixedProduct} /> : null
}

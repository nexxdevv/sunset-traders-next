export type Product = {
  id: string
  name: string
  subtitle?: string
  price: number
  ogPrice?: number
  isOnSale?: boolean
  description: string
  imageUrl: string
  category: string
  dateAdded: string
  carouselImages?: string[]
  tags?: string[]
}

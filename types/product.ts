export type Product = {
  id: string
  name: string
  price: number
  description: string
  imageUrl: string
  category: string
  dateAdded: string
  carouselImages?: string[]
  tags?: string[]
}

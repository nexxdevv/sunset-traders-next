import { Product } from "../types/product"

export const products: Product[] = [
  {
    id: "1",
    name: "Giorgio Armani AR8186",
    price: "40",
    description:
      "Stylish Italian sunglasses with polarized lenses. Light weight and comfortable fit for men and women.",
    imageUrl: "/sunnies.png",
    category: "sunglasses",
    dateAdded: "2025-06-01"
  },

  {
    id: "3",
    name: "AirPods",
    price: "20",
    description:
      "Wireless earbuds with noise cancellation. Perfect for music lovers.",
    imageUrl: "/airpods.png",
    category: "electronics",
    dateAdded: "2025-06-03",
    carouselImages: [
      "https://i.pcmag.com/imagery/reviews/04OxokBPa0Tout5RYZ5W8NI-1.fit_lim.size_1050x591.v1726161238.jpg",
      "https://platform.theverge.com/wp-content/uploads/sites/2/chorus/uploads/chorus_asset/file/25623448/DSCF0028.jpg?quality=90&strip=all&crop=22.5%2C5.1470588235294%2C60.196078431373%2C90.294117647059&w=2400"
    ]
  },
  {
    id: "4",
    name: "Hunting Knife",
    price: "10",
    description:
      "High-quality black blade hunting knife. Slightly used but in great condition.",
    imageUrl: "/knife.png",
    category: "knives",
    dateAdded: "2025-06-04"
  },

  {
    id: "6",
    name: "Vintage Leather Handbag",
    price: "80",
    description:
      "Beautiful vintage leather handbag in excellent condition with classic design.",
    imageUrl:
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=600&fit=crop&crop=center",
    category: "bags",
    dateAdded: "2025-06-06"
  },
  {
    id: "7",
    name: "Ray-Ban Aviators",
    price: "45",
    description: "Classic Ray-Ban aviator sunglasses. Minor scratches on lens.",
    imageUrl:
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=600&fit=crop&crop=center",
    category: "sunglasses",
    dateAdded: "2025-06-07"
  },
  {
    id: "8",
    name: "Gold Chain Necklace",
    price: "75",
    description: "18k gold plated chain necklace. Perfect for layering.",
    imageUrl:
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=600&fit=crop&crop=center",
    category: "jewelry",
    dateAdded: "2025-06-08"
  },

  {
    id: "10",
    name: "Adidas Originals",
    price: "70",
    description:
      "Retro Adidas sneakers in mint condition. Classic three stripes design.",
    imageUrl:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=600&fit=crop&crop=center",
    category: "sneakers",
    dateAdded: "2025-06-09"
  },
  {
    id: "11",
    name: "Vintage Band T-Shirt",
    price: "35",
    description:
      "Authentic vintage band t-shirt with original graphics. Soft cotton blend.",
    imageUrl:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=600&fit=crop&crop=center",
    category: "shirts",
    dateAdded: "2025-06-10"
  },
  {
    id: "12",
    name: "High-Waisted Jeans",
    price: "45",
    description:
      "Vintage high-waisted jeans in perfect condition. Classic fit.",
    imageUrl:
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=600&fit=crop&crop=center",
    category: "pants",
    dateAdded: "2025-06-11"
  },
  {
    id: "13",
    name: "Leather Boots",
    price: "95",
    description:
      "Genuine leather boots with minimal wear. Perfect for any occasion.",
    imageUrl:
      "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=400&h=600&fit=crop&crop=center",
    category: "boots",
    dateAdded: "2025-05-12"
  },
  {
    id: "14",
    name: "Silk Scarf",
    price: "30",
    description:
      "Luxurious silk scarf with beautiful pattern. Perfect accessory piece.",
    imageUrl:
      "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=400&h=600&fit=crop&crop=center",
    category: "accessories",
    dateAdded: "2025-05-12"
  },
  {
    id: "15",
    name: "Vintage Bomber Jacket",
    price: "110",
    description:
      "Classic bomber jacket in olive green. Military-inspired design.",
    imageUrl:
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=600&fit=crop&crop=center",
    category: "jackets",
    dateAdded: "2025-05-13"
  },
  {
    id: "16",
    name: "Converse Chuck Taylor",
    price: "40",
    description:
      "Classic Converse All Star sneakers in black. Timeless design.",
    imageUrl:
      "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=400&h=600&fit=crop&crop=center",
    category: "sneakers",
    dateAdded: "2025-05-13"
  }
]

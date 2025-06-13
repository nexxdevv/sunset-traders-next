import { Product } from "../types/product"

export const products: Product[] = [
  {
    id: "1",
    name: "Giorgio Armani",
    subtitle: "AR8186",
    price: 40,
    ogPrice: 350,
    description:
      "Stylish Italian sunglasses with polarized lenses. Light weight and comfortable fit for men and women.",
    imageUrl:
      "https://res.cloudinary.com/cloud-x/image/upload/v1749705421/sunnies_zggp6b.png",
    category: "sunglasses",
    dateAdded: "2025-06-01"
  },

  {
    id: "3",
    name: "Apple AirPods",
    subtitle: "5th Gen",
    price: 30,
    description:
      "Wireless earbuds with noise cancellation. Perfect for music lovers.",
    imageUrl:
      "https://res.cloudinary.com/cloud-x/image/upload/v1749705428/airpods_rfeyim.png",
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
    price: 20,
    description:
      "High-quality black blade hunting knife. Slightly used but in great condition.",
    imageUrl:
      "https://res.cloudinary.com/cloud-x/image/upload/v1749705431/knife_thfqgx.png",
    category: "knives",
    dateAdded: "2025-06-04"
  },

  {
    id: "6",
    name: "Vintage Leather Handbag",
    price: 80,
    description:
      "Beautiful vintage leather handbag in excellent condition with classic design.",
    imageUrl:
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=600&fit=crop&crop=center",
    category: "bags",
    dateAdded: "2025-06-06"
  },
  {
    id: "7",
    name: "Ray-Ban Wayfarers",
    price: 60,
    description:
      "Classic Ray-Ban Wayfarer sunglasses. Minor scratches on lens.",
    imageUrl:
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=600&fit=crop&crop=center",
    category: "sunglasses",
    dateAdded: "2025-06-07"
  },
  {
    id: "8",
    name: "Mother's Pearl's",
    price: 90,
    description:
      "Elegant pearl necklace in pristine condition. Perfect for special occasions.",
    imageUrl:
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=600&fit=crop&crop=center",
    category: "jewelry",
    dateAdded: "2025-06-08"
  },

  {
    id: "12",
    name: "High-Waisted Jeans",
    price: 60,
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
    price: 100,
    description:
      "Genuine leather boots with minimal wear. Perfect for any occasion.",
    imageUrl:
      "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=400&h=600&fit=crop&crop=center",
    category: "boots",
    dateAdded: "2025-05-12"
  },
  {
    id: "15",
    name: "Vintage Bomber Jacket",
    price: 30,
    description: "Classic bomber jacket. Military-inspired design.",
    imageUrl:
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=600&fit=crop&crop=center",
    category: "jackets",
    dateAdded: "2025-05-13"
  },
  {
    id: "16",
    name: "Converse Chuck Taylor",
    price: 60,
    description: "Classic Converse All Star sneakers. Timeless design.",
    imageUrl:
      "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=400&h=600&fit=crop&crop=center",
    category: "sneakers",
    dateAdded: "2025-05-13"
  }
]

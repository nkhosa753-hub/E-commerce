import ProductGrid from '../ProductGrid';
import img1 from '@assets/generated_images/Blue_t-shirt_product_photo_7ebc8f90.png';
import img2 from '@assets/generated_images/Wireless_headphones_product_72251e96.png';
import img3 from '@assets/generated_images/Luxury_wristwatch_product_10335c57.png';
import img4 from '@assets/generated_images/Laptop_backpack_product_ed9a2376.png';

export default function ProductGridExample() {
  const products = [
    { id: "1", slug: "blue-tshirt", title: "Blue Cotton T-Shirt", price: 2499, image: img1, category: "Fashion" },
    { id: "2", slug: "wireless-headphones", title: "Wireless Headphones", price: 8999, image: img2, category: "Electronics" },
    { id: "3", slug: "luxury-watch", title: "Luxury Wristwatch", price: 15999, image: img3, category: "Fashion" },
    { id: "4", slug: "laptop-bag", title: "Laptop Backpack", price: 4999, image: img4, category: "Accessories" },
  ];

  return <ProductGrid products={products} title="Best Sellers" />;
}

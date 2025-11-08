import { useRoute } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ProductGrid from "@/components/ProductGrid";

import img1 from '@assets/generated_images/Blue_t-shirt_product_photo_7ebc8f90.png';
import img2 from '@assets/generated_images/Wireless_headphones_product_72251e96.png';
import img3 from '@assets/generated_images/Luxury_wristwatch_product_10335c57.png';
import img4 from '@assets/generated_images/Laptop_backpack_product_ed9a2376.png';
import img5 from '@assets/generated_images/Athletic_sneakers_product_5210ece4.png';
import img6 from '@assets/generated_images/Smartphone_product_photo_587e570e.png';

export default function CategoryPage() {
  const [, params] = useRoute("/category/:slug");
  const categorySlug = params?.slug || "electronics";

  const categoryData: Record<string, { name: string; products: any[] }> = {
    electronics: {
      name: "Electronics",
      products: [
        { id: "2", slug: "wireless-headphones", title: "Wireless Bluetooth Headphones", price: 8999, image: img2, category: "Electronics" },
        { id: "6", slug: "smartphone", title: "Modern Smartphone with Case", price: 42999, image: img6, category: "Electronics" },
      ]
    },
    fashion: {
      name: "Fashion & Apparel",
      products: [
        { id: "1", slug: "blue-tshirt", title: "Premium Blue Cotton T-Shirt", price: 2499, image: img1, category: "Fashion" },
        { id: "3", slug: "luxury-watch", title: "Luxury Leather Wristwatch", price: 15999, image: img3, category: "Fashion" },
        { id: "5", slug: "sneakers", title: "Athletic Running Sneakers", price: 6499, image: img5, category: "Fashion" },
      ]
    },
    home: {
      name: "Home & Living",
      products: [
        { id: "4", slug: "laptop-bag", title: "Professional Laptop Backpack", price: 4999, image: img4, category: "Accessories" },
      ]
    }
  };

  const category = categoryData[categorySlug] || categoryData.electronics;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2" data-testid="text-category-title">
              {category.name}
            </h1>
            <p className="text-muted-foreground" data-testid="text-category-count">
              {category.products.length} products found
            </p>
          </div>

          <ProductGrid products={category.products} />
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}

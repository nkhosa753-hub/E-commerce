import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import CollectionCard from "@/components/CollectionCard";
import ProductGrid from "@/components/ProductGrid";
import TrustSignals from "@/components/TrustSignals";
import WhatsAppButton from "@/components/WhatsAppButton";

import electronicsImg from '@assets/generated_images/Electronics_collection_banner_9ebbb942.png';
import fashionImg from '@assets/generated_images/Fashion_collection_banner_1e17f209.png';
import homeImg from '@assets/generated_images/Home_goods_collection_banner_6193ea19.png';
import img1 from '@assets/generated_images/Blue_t-shirt_product_photo_7ebc8f90.png';
import img2 from '@assets/generated_images/Wireless_headphones_product_72251e96.png';
import img3 from '@assets/generated_images/Luxury_wristwatch_product_10335c57.png';
import img4 from '@assets/generated_images/Laptop_backpack_product_ed9a2376.png';
import img5 from '@assets/generated_images/Athletic_sneakers_product_5210ece4.png';
import img6 from '@assets/generated_images/Smartphone_product_photo_587e570e.png';

export default function Home() {
  const collections = [
    { id: "1", slug: "electronics", name: "Electronics", image: electronicsImg, productCount: 42 },
    { id: "2", slug: "fashion", name: "Fashion & Apparel", image: fashionImg, productCount: 58 },
    { id: "3", slug: "home", name: "Home & Living", image: homeImg, productCount: 34 },
  ];

  const bestSellers = [
    { id: "1", slug: "blue-tshirt", title: "Premium Blue Cotton T-Shirt", price: 2499, image: img1, category: "Fashion" },
    { id: "2", slug: "wireless-headphones", title: "Wireless Bluetooth Headphones", price: 8999, image: img2, category: "Electronics" },
    { id: "3", slug: "luxury-watch", title: "Luxury Leather Wristwatch", price: 15999, image: img3, category: "Fashion" },
    { id: "4", slug: "laptop-bag", title: "Professional Laptop Backpack", price: 4999, image: img4, category: "Accessories" },
    { id: "5", slug: "sneakers", title: "Athletic Running Sneakers", price: 6499, image: img5, category: "Fashion" },
    { id: "6", slug: "smartphone", title: "Modern Smartphone with Case", price: 42999, image: img6, category: "Electronics" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Hero />
          
          <section className="py-16">
            <h2 className="text-3xl font-bold mb-8" data-testid="text-collections-title">
              Shop by Collection
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {collections.map((collection) => (
                <CollectionCard key={collection.id} {...collection} />
              ))}
            </div>
          </section>

          <ProductGrid products={bestSellers} title="Best Sellers" />
          
          <TrustSignals />
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}

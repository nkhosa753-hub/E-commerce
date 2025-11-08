import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import CollectionCard from "@/components/CollectionCard";
import ProductGrid from "@/components/ProductGrid";
import TrustSignals from "@/components/TrustSignals";
import WhatsAppButton from "@/components/WhatsAppButton";
import { api, type Product } from "@/lib/api";

import electronicsImg from '@assets/generated_images/Electronics_collection_banner_9ebbb942.png';
import fashionImg from '@assets/generated_images/Fashion_collection_banner_1e17f209.png';
import homeImg from '@assets/generated_images/Home_goods_collection_banner_6193ea19.png';

export default function Home() {
  const { data: productsResponse, isLoading } = useQuery({
    queryKey: ["/api/v1/products"],
    queryFn: () => api.getProducts(),
  });

  const products = productsResponse?.data || [];

  const collections = [
    { id: "1", slug: "electronics", name: "Electronics", image: electronicsImg, productCount: products.filter(p => p.category?.slug === "electronics").length },
    { id: "2", slug: "fashion", name: "Fashion & Apparel", image: fashionImg, productCount: products.filter(p => p.category?.slug === "fashion").length },
    { id: "3", slug: "accessories", name: "Accessories", image: homeImg, productCount: products.filter(p => p.category?.slug === "accessories").length },
  ];

  const bestSellers = products.slice(0, 6).map(p => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    price: p.pricePkr,
    image: p.images[0]?.url || "",
    category: p.category?.name || "Uncategorized",
  }));

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

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading products...</p>
            </div>
          ) : (
            <ProductGrid products={bestSellers} title="Best Sellers" />
          )}
          
          <TrustSignals />
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}

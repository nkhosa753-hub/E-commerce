import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ProductGrid from "@/components/ProductGrid";
import { api } from "@/lib/api";

export default function CategoryPage() {
  const [, params] = useRoute("/category/:slug");
  const categorySlug = params?.slug || "electronics";

  const { data: productsResponse, isLoading } = useQuery({
    queryKey: ["/api/v1/products"],
    queryFn: () => api.getProducts(),
  });

  const products = (productsResponse?.data || [])
    .filter(p => p.category?.slug === categorySlug)
    .map(p => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      price: p.pricePkr,
      image: p.images[0]?.url || "",
      category: p.category?.name || "Uncategorized",
    }));

  const categoryName = products[0]?.category || categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2" data-testid="text-category-title">
              {categoryName}
            </h1>
            <p className="text-muted-foreground" data-testid="text-category-count">
              {products.length} products found
            </p>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading products...</p>
            </div>
          ) : products.length > 0 ? (
            <ProductGrid products={products} />
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No products found in this category.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}

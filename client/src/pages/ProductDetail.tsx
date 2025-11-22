import { useState } from "react";
import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle } from "lucide-react";
import ProductGrid from "@/components/ProductGrid";
import { api } from "@/lib/api";

export default function ProductDetail() {
  const [, params] = useRoute("/product/:slug");
  const [selectedImage, setSelectedImage] = useState(0);

  const { data: productResponse, isLoading } = useQuery({
    queryKey: ["/api/v1/products", params?.slug],
    queryFn: () => api.getProductBySlug(params?.slug || ""),
    enabled: !!params?.slug,
  });

  const { data: allProductsResponse } = useQuery({
    queryKey: ["/api/v1/products"],
    queryFn: () => api.getProducts(),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Loading product...</p>
        </main>
        <Footer />
      </div>
    );
  }

  const product = productResponse?.data;

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Product Not Found</h1>
            <p className="text-muted-foreground">The product you're looking for doesn't exist.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const formattedPrice = new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    minimumFractionDigits: 0,
  }).format(product.pricePkr);

  const whatsappMessage = `Hi, I want to buy ${product.title} from your store!`;
  const whatsappUrl = `https://wa.me/923294816244?text=${encodeURIComponent(whatsappMessage)}`;

  const relatedProducts = (allProductsResponse?.data || [])
    .filter(p => p.id !== product.id && p.categoryId === product.categoryId)
    .slice(0, 3)
    .map(p => ({
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <div>
              <div className="aspect-square bg-muted rounded-lg overflow-hidden mb-4">
                <img
                  src={product.images[selectedImage]?.url || ""}
                  alt={product.title}
                  className="w-full h-full object-cover"
                  data-testid="img-product-main"
                />
              </div>
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square bg-muted rounded-md overflow-hidden hover-elevate active-elevate-2 ${
                      selectedImage === index ? 'ring-2 ring-primary' : ''
                    }`}
                    data-testid={`button-thumbnail-${index}`}
                  >
                    <img
                      src={image.url}
                      alt={`${product.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              {product.category && (
                <Badge variant="secondary" className="mb-4" data-testid="badge-category">
                  {product.category.name}
                </Badge>
              )}
              <h1 className="text-4xl font-bold mb-4" data-testid="text-product-title">
                {product.title}
              </h1>
              <p className="text-3xl font-bold text-primary mb-6" data-testid="text-product-price">
                {formattedPrice}
              </p>
              {product.description && (
                <p className="text-muted-foreground mb-8" data-testid="text-product-description">
                  {product.description}
                </p>
              )}

              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <Button 
                  size="lg" 
                  className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white mb-4"
                  data-testid="button-buy-whatsapp"
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Buy on WhatsApp
                </Button>
              </a>

              <div className="border-t border-border pt-8 mt-8">
                <h3 className="font-semibold mb-4">Product Features</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• 100% Premium Quality</li>
                  <li>• Cash on Delivery Available</li>
                  <li>• Free Shipping</li>
                  <li>• Easy Returns & Exchange</li>
                </ul>
              </div>
            </div>
          </div>

          {relatedProducts.length > 0 && (
            <div className="border-t border-border pt-16">
              <ProductGrid products={relatedProducts} title="Related Products" />
            </div>
          )}
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}

import { useState } from "react";
import { useRoute } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle } from "lucide-react";
import ProductGrid from "@/components/ProductGrid";

import img1 from '@assets/generated_images/Blue_t-shirt_product_photo_7ebc8f90.png';
import img2 from '@assets/generated_images/Wireless_headphones_product_72251e96.png';
import img3 from '@assets/generated_images/Luxury_wristwatch_product_10335c57.png';
import img4 from '@assets/generated_images/Laptop_backpack_product_ed9a2376.png';

export default function ProductDetail() {
  const [, params] = useRoute("/product/:slug");
  const [selectedImage, setSelectedImage] = useState(0);

  const product = {
    id: "1",
    slug: params?.slug || "blue-tshirt",
    title: "Premium Blue Cotton T-Shirt",
    price: 2499,
    category: "Fashion",
    description: "Experience comfort and style with our premium blue cotton t-shirt. Made from 100% pure cotton, this t-shirt offers breathability and softness for all-day wear. Perfect for casual outings or everyday comfort. Available in multiple sizes.",
    images: [img1, img1, img1, img1],
  };

  const relatedProducts = [
    { id: "2", slug: "wireless-headphones", title: "Wireless Headphones", price: 8999, image: img2, category: "Electronics" },
    { id: "3", slug: "luxury-watch", title: "Luxury Wristwatch", price: 15999, image: img3, category: "Fashion" },
    { id: "4", slug: "laptop-bag", title: "Laptop Backpack", price: 4999, image: img4, category: "Accessories" },
  ];

  const formattedPrice = new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    minimumFractionDigits: 0,
  }).format(product.price);

  const whatsappMessage = `Hi, I want to buy ${product.title} from your store!`;
  const whatsappUrl = `https://wa.me/923001234567?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <div>
              <div className="aspect-square bg-muted rounded-lg overflow-hidden mb-4">
                <img
                  src={product.images[selectedImage]}
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
                      src={image}
                      alt={`${product.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Badge variant="secondary" className="mb-4" data-testid="badge-category">
                {product.category}
              </Badge>
              <h1 className="text-4xl font-bold mb-4" data-testid="text-product-title">
                {product.title}
              </h1>
              <p className="text-3xl font-bold text-primary mb-6" data-testid="text-product-price">
                {formattedPrice}
              </p>
              <p className="text-muted-foreground mb-8" data-testid="text-product-description">
                {product.description}
              </p>

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
                  <li>• Free Shipping on Orders Over Rs. 2,000</li>
                  <li>• Easy Returns & Exchange</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-16">
            <ProductGrid products={relatedProducts} title="Related Products" />
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}

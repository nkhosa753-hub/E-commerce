import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import heroImg from '@assets/generated_images/Hero_banner_lifestyle_image_1ebb8dba.png';

export default function Hero() {
  return (
    <section className="relative h-[80vh] min-h-[500px] overflow-hidden rounded-lg">
      <div className="absolute inset-0">
        <img
          src={heroImg}
          alt="Featured Collection"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40" />
      </div>
      
      <div className="relative h-full max-w-7xl mx-auto px-4 flex items-center">
        <div className="max-w-2xl text-white">
          <h1 className="text-4xl lg:text-6xl font-bold mb-4" data-testid="text-hero-title">
            Premium Products
            <br />
            Delivered to Your Door
          </h1>
          <p className="text-lg lg:text-xl mb-8 text-white/90" data-testid="text-hero-subtitle">
            Discover the best deals on electronics, fashion, and lifestyle products across Pakistan.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/category/electronics">
              <Button size="lg" className="bg-primary hover:bg-primary/90" data-testid="button-shop-now">
                Shop Now
              </Button>
            </Link>
            <a
              href="https://wa.me/923001234567"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20"
                data-testid="button-contact-whatsapp"
              >
                Contact on WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

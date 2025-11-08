import { Link } from "wouter";
import { MessageCircle, Facebook, Instagram, Twitter } from "lucide-react";
import { SiVisa, SiMastercard } from "react-icons/si";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-card-border mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold text-lg mb-4" data-testid="text-footer-about">About PakShop</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Your trusted online marketplace for quality products across Pakistan. Shop with confidence.
            </p>
            <div className="flex gap-3">
              <a href="#" className="text-muted-foreground hover-elevate active-elevate-2 p-2 rounded-md" data-testid="link-facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover-elevate active-elevate-2 p-2 rounded-md" data-testid="link-instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover-elevate active-elevate-2 p-2 rounded-md" data-testid="link-twitter">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4" data-testid="text-footer-categories">Categories</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/category/electronics" className="text-muted-foreground hover:text-foreground" data-testid="link-category-electronics">Electronics</Link></li>
              <li><Link href="/category/fashion" className="text-muted-foreground hover:text-foreground" data-testid="link-category-fashion">Fashion</Link></li>
              <li><Link href="/category/home" className="text-muted-foreground hover:text-foreground" data-testid="link-category-home">Home & Living</Link></li>
              <li><Link href="/category/sports" className="text-muted-foreground hover:text-foreground" data-testid="link-category-sports">Sports</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4" data-testid="text-footer-service">Customer Service</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-foreground" data-testid="link-shipping">Shipping Info</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground" data-testid="link-returns">Returns</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground" data-testid="link-faq">FAQ</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground" data-testid="link-support">Contact Support</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4" data-testid="text-footer-contact">Contact</h3>
            <div className="space-y-3 text-sm">
              <a
                href="https://wa.me/923001234567"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                data-testid="link-whatsapp-footer"
              >
                <MessageCircle className="h-4 w-4" />
                <span>+92 300 1234567</span>
              </a>
              <p className="text-muted-foreground">support@pakshop.com</p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-card-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground" data-testid="text-copyright">
            © 2025 PakShop. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">We accept:</span>
            <div className="flex gap-2">
              <SiVisa className="h-6 w-8 text-muted-foreground" />
              <SiMastercard className="h-6 w-8 text-muted-foreground" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

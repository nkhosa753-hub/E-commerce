import { Link } from "wouter";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  id: string;
  slug: string;
  title: string;
  price: number;
  image: string;
  category: string;
}

export default function ProductCard({ id, slug, title, price, image, category }: ProductCardProps) {
  const formattedPrice = new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    minimumFractionDigits: 0,
  }).format(price);

  return (
    <Link href={`/product/${slug}`}>
      <Card 
        className="overflow-hidden hover-elevate active-elevate-2 transition-transform hover:scale-[1.02] cursor-pointer"
        data-testid={`card-product-${id}`}
      >
        <div className="aspect-square bg-muted overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
            data-testid={`img-product-${id}`}
          />
        </div>
        <CardContent className="p-4">
          <Badge variant="secondary" className="mb-2" data-testid={`badge-category-${id}`}>
            {category}
          </Badge>
          <h3 
            className="font-semibold text-base line-clamp-2 mb-2" 
            data-testid={`text-product-title-${id}`}
          >
            {title}
          </h3>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <p className="text-2xl font-bold text-primary" data-testid={`text-product-price-${id}`}>
            {formattedPrice}
          </p>
        </CardFooter>
      </Card>
    </Link>
  );
}

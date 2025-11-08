import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";

interface CollectionCardProps {
  id: string;
  slug: string;
  name: string;
  image: string;
  productCount: number;
}

export default function CollectionCard({ id, slug, name, image, productCount }: CollectionCardProps) {
  return (
    <Link href={`/category/${slug}`}>
      <Card 
        className="overflow-hidden hover-elevate active-elevate-2 transition-transform hover:scale-[1.02] cursor-pointer"
        data-testid={`card-collection-${id}`}
      >
        <div className="aspect-[16/9] bg-muted overflow-hidden">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover"
            data-testid={`img-collection-${id}`}
          />
        </div>
        <CardContent className="p-6">
          <h3 className="text-xl font-bold mb-2" data-testid={`text-collection-name-${id}`}>
            {name}
          </h3>
          <p className="text-sm text-muted-foreground" data-testid={`text-collection-count-${id}`}>
            {productCount} Products
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}

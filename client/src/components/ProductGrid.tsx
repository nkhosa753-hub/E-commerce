import ProductCard from "./ProductCard";

interface Product {
  id: string;
  slug: string;
  title: string;
  price: number;
  image: string;
  category: string;
}

interface ProductGridProps {
  products: Product[];
  title?: string;
}

export default function ProductGrid({ products, title }: ProductGridProps) {
  return (
    <section className="py-12">
      {title && (
        <h2 className="text-3xl font-bold mb-8" data-testid="text-grid-title">
          {title}
        </h2>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </section>
  );
}

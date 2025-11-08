import ProductCard from '../ProductCard';
import heroImage from '@assets/generated_images/Blue_t-shirt_product_photo_7ebc8f90.png';

export default function ProductCardExample() {
  return (
    <div className="max-w-sm">
      <ProductCard
        id="1"
        slug="blue-cotton-tshirt"
        title="Premium Blue Cotton T-Shirt"
        price={2499}
        image={heroImage}
        category="Fashion"
      />
    </div>
  );
}

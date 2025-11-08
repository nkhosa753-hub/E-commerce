import CollectionCard from '../CollectionCard';
import electronicsImg from '@assets/generated_images/Electronics_collection_banner_9ebbb942.png';

export default function CollectionCardExample() {
  return (
    <div className="max-w-md">
      <CollectionCard
        id="1"
        slug="electronics"
        name="Electronics"
        image={electronicsImg}
        productCount={42}
      />
    </div>
  );
}

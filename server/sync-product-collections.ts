import 'dotenv/config';
import { db } from './db';
import { products, categories, collections, productCollections } from '@shared/schema';
import { eq } from 'drizzle-orm';

async function sync() {
  console.log('🔁 Syncing products -> collections by category slug...');

  const prods = await db.select().from(products);
  for (const p of prods) {
    if (!p.categoryId) continue;
    const [cat] = await db.select().from(categories).where(eq(categories.id, p.categoryId));
    if (!cat) continue;
    const [col] = await db.select().from(collections).where(eq(collections.slug, cat.slug));
    if (!col) continue;
    const existing = await db.select().from(productCollections).where(eq(productCollections.productId, p.id)).where(eq(productCollections.collectionId, col.id));
    if (existing.length === 0) {
      await db.insert(productCollections).values({ productId: p.id, collectionId: col.id });
      console.log(`Linked product ${p.id} -> collection ${col.slug}`);
    }
  }

  console.log('\n✅ Sync complete');
}

sync().then(() => process.exit(0)).catch((err) => { console.error(err); process.exit(1); });

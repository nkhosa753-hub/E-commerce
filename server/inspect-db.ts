import 'dotenv/config';
import { db } from './db';
import { categories, collections, products, productCollections } from '@shared/schema';
import { eq } from 'drizzle-orm';

async function inspect() {
  console.log('🔍 Inspecting categories, collections and mappings...');

  const cats = await db.select().from(categories);
  console.log('\nCategories:');
  for (const c of cats) {
    const prodCount = (await db.select().from(products).where(eq(products.categoryId, c.id))).length;
    console.log(`- ${c.id}  slug='${c.slug}' name='${c.name}'  products=${prodCount}`);
  }

  const cols = await db.select().from(collections);
  console.log('\nCollections:');
  for (const col of cols) {
    const pcCount = (await db.select().from(productCollections).where(eq(productCollections.collectionId, col.id))).length;
    console.log(`- ${col.id}  slug='${col.slug}' name='${col.name}'  product_collections=${pcCount}`);
  }

  console.log('\nProducts (first 50):');
  const prods = await db.select().from(products).limit(50);
  for (const p of prods) {
    console.log(`- ${p.id} title='${p.title}' slug='${p.slug}' categoryId='${p.categoryId}'`);
  }

  console.log('\n✅ Inspect complete');
}

inspect().then(() => process.exit(0)).catch((err) => {
  console.error('Error inspecting DB:', err);
  process.exit(1);
});

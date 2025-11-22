import 'dotenv/config';
import { db } from './db';
import { categories, collections, products, productCollections } from '@shared/schema';
import type { Category, Collection } from '@shared/schema';
import { eq } from 'drizzle-orm';

async function dedupe() {
  console.log('🔎 Checking for duplicate categories and collections...');

  // Dedupe categories by slug
  const allCategories: Category[] = await db.select().from(categories) as any;
  const catsBySlug: Record<string, Category[]> = {} as any;
  for (const c of allCategories) {
    catsBySlug[c.slug] = catsBySlug[c.slug] || [];
    catsBySlug[c.slug].push(c);
  }

  for (const slug of Object.keys(catsBySlug)) {
    const list = catsBySlug[slug];
    if (list.length <= 1) continue;
    console.log(`\n⚠️ Found ${list.length} categories for slug='${slug}'`);

    // Decide keeper: choose the category with the largest number of products
    const counts = await Promise.all(
      list.map(async (cat: Category) => {
        const res = await db.select().from(products).where(eq(products.categoryId, cat.id));
        return { cat, count: res.length };
      })
    );

    counts.sort((a, b) => b.count - a.count);
    const keeper = counts[0].cat;
    console.log(`Keeping category id=${keeper.id} (name='${keeper.name}')`);

    const toRemove = counts.slice(1).map(x => x.cat);
    for (const dup of toRemove) {
      console.log(`Reassigning products from ${dup.id} -> ${keeper.id}`);
      await db.update(products).set({ categoryId: keeper.id }).where(eq(products.categoryId, dup.id));
      console.log(`Deleting duplicate category id=${dup.id} name='${dup.name}'`);
      await db.delete(categories).where(eq(categories.id, dup.id));
    }
  }

  // Dedupe collections by slug
  const allCollections: Collection[] = await db.select().from(collections) as any;
  const colsBySlug: Record<string, Collection[]> = {} as any;
  for (const c of allCollections) {
    colsBySlug[c.slug] = colsBySlug[c.slug] || [];
    colsBySlug[c.slug].push(c);
  }

  for (const slug of Object.keys(colsBySlug)) {
    const list = colsBySlug[slug];
    if (list.length <= 1) continue;
    console.log(`\n⚠️ Found ${list.length} collections for slug='${slug}'`);

    // Decide keeper: choose the collection with the largest number of product_collections refs
    const counts = await Promise.all(
      list.map(async (col: Collection) => {
        const res = await db.select().from(productCollections).where(eq(productCollections.collectionId, col.id));
        return { col, count: res.length };
      })
    );

    counts.sort((a, b) => b.count - a.count);
    const keeper = counts[0].col;
    console.log(`Keeping collection id=${keeper.id} (name='${keeper.name}')`);

    const toRemove = counts.slice(1).map(x => x.col);
    for (const dup of toRemove) {
      console.log(`Reassigning product_collections from ${dup.id} -> ${keeper.id}`);
      await db.update(productCollections).set({ collectionId: keeper.id }).where(eq(productCollections.collectionId, dup.id));
      console.log(`Deleting duplicate collection id=${dup.id} name='${dup.name}'`);
      await db.delete(collections).where(eq(collections.id, dup.id));
    }
  }

  console.log('\n✅ Dedupe complete');
}

dedupe().then(() => process.exit(0)).catch((err) => {
  console.error('❌ Error during dedupe:', err);
  process.exit(1);
});

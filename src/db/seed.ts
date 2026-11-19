import "dotenv/config";
import { db } from "./index";
import { services, inventoryItems } from "./schema";
import { OH_MEDIA_PACKAGES } from "./oh-media-data";
import { eq } from "drizzle-orm";

export async function seedOhMedia() {
  console.log("🌱 Seeding OH MEDIA Studio packages and inventory...");

  // 1. Seed Packages into `services` table
  for (const pkg of OH_MEDIA_PACKAGES) {
    const existing = await db
      .select()
      .from(services)
      .where(eq(services.name, pkg.name))
      .limit(1);

    if (existing.length === 0) {
      await db.insert(services).values({
        name: pkg.name,
        description: pkg.description,
        durationMinutes: pkg.durationMinutes,
        priceCents: pkg.priceCents,
        basePax: pkg.basePax,
        maxPax: pkg.maxPax,
        includedPrints: pkg.includedPrints,
        includedSoftCopies: pkg.includedSoftCopies,
        isActive: true,
      });
      console.log(`  ✓ Inserted service package: ${pkg.name}`);
    } else {
      console.log(`  - Package already exists: ${pkg.name}`);
    }
  }

  // 2. Seed Default Inventory items (USBs, Photo Papers)
  const defaultInventory = [
    {
      name: "USB Flash Drive 16GB",
      sku: "USB-16GB-OH",
      category: "addons",
      unit: "pcs",
      currentQuantity: 25,
      reorderLevel: 5,
    },
    {
      name: "Photo Paper 4R - Full Layout",
      sku: "PAPER-4R-FULL",
      category: "supplies",
      unit: "sheets",
      currentQuantity: 300,
      reorderLevel: 50,
    },
    {
      name: "Photo Paper 4R - Grid Layout",
      sku: "PAPER-4R-GRID",
      category: "supplies",
      unit: "sheets",
      currentQuantity: 300,
      reorderLevel: 50,
    },
  ];

  for (const item of defaultInventory) {
    const existing = await db
      .select()
      .from(inventoryItems)
      .where(eq(inventoryItems.sku, item.sku))
      .limit(1);

    if (existing.length === 0) {
      await db.insert(inventoryItems).values(item);
      console.log(`  ✓ Inserted inventory item: ${item.name}`);
    } else {
      console.log(`  - Inventory item already exists: ${item.name}`);
    }
  }

  console.log("✅ OH MEDIA Studio seeding completed!");
}

// Allow running directly via tsx / node
if (process.argv[1]?.includes("seed")) {
  seedOhMedia()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("❌ Seeding failed:", err);
      process.exit(1);
    });
}

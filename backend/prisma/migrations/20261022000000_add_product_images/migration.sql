-- Create a separate image table so each product can have between two and four images.
CREATE TABLE "ProductImage" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "publicId" TEXT,
    "position" INTEGER NOT NULL DEFAULT 0,
    "productId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ProductImage_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ProductImage_productId_position_idx" ON "ProductImage"("productId", "position");

ALTER TABLE "ProductImage"
ADD CONSTRAINT "ProductImage_productId_fkey"
FOREIGN KEY ("productId") REFERENCES "Product"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

-- Preserve existing main product images in the new gallery.
INSERT INTO "ProductImage" ("url", "position", "productId")
SELECT "imageUrl", 0, "id"
FROM "Product"
WHERE "imageUrl" IS NOT NULL AND LENGTH(TRIM("imageUrl")) > 0;

/*
  Warnings:

  - You are about to drop the column `catalog_id` on the `product` table. All the data in the column will be lost.
  - You are about to drop the `catalog` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `category_id` to the `product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "product" DROP CONSTRAINT "product_catalog_id_fkey";

-- AlterTable
ALTER TABLE "product" DROP COLUMN "catalog_id",
ADD COLUMN     "category_id" INTEGER NOT NULL;

-- DropTable
DROP TABLE "catalog";

-- CreateTable
CREATE TABLE "category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "category_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

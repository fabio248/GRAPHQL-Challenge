/*
  Warnings:

  - Added the required column `product_id` to the `product_in_car` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "product_in_car" ADD COLUMN     "product_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "product_in_car" ADD CONSTRAINT "product_in_car_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

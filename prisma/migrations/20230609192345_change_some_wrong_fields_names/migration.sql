/*
  Warnings:

  - You are about to drop the column `productId` on the `image` table. All the data in the column will be lost.
  - You are about to drop the column `orderId` on the `order_detail` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `order_detail` table. All the data in the column will be lost.
  - You are about to drop the column `catalogId` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `isEnable` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `carId` on the `product_in_car` table. All the data in the column will be lost.
  - You are about to drop the `Order` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `product_id` to the `image` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order_id` to the `order_detail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_id` to the `order_detail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `catalog_id` to the `product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `car_id` to the `product_in_car` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_userId_fkey";

-- DropForeignKey
ALTER TABLE "image" DROP CONSTRAINT "image_productId_fkey";

-- DropForeignKey
ALTER TABLE "order_detail" DROP CONSTRAINT "order_detail_orderId_fkey";

-- DropForeignKey
ALTER TABLE "order_detail" DROP CONSTRAINT "order_detail_productId_fkey";

-- DropForeignKey
ALTER TABLE "product" DROP CONSTRAINT "product_catalogId_fkey";

-- DropForeignKey
ALTER TABLE "product_in_car" DROP CONSTRAINT "product_in_car_carId_fkey";

-- AlterTable
ALTER TABLE "image" DROP COLUMN "productId",
ADD COLUMN     "product_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "order_detail" DROP COLUMN "orderId",
DROP COLUMN "productId",
ADD COLUMN     "order_id" INTEGER NOT NULL,
ADD COLUMN     "product_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "product" DROP COLUMN "catalogId",
DROP COLUMN "isEnable",
ADD COLUMN     "catalog_id" INTEGER NOT NULL,
ADD COLUMN     "is_enable" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "product_in_car" DROP COLUMN "carId",
ADD COLUMN     "car_id" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Order";

-- CreateTable
CREATE TABLE "order" (
    "id" SERIAL NOT NULL,
    "total" DECIMAL(65,30) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "order_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_catalog_id_fkey" FOREIGN KEY ("catalog_id") REFERENCES "catalog"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "image" ADD CONSTRAINT "image_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_in_car" ADD CONSTRAINT "product_in_car_car_id_fkey" FOREIGN KEY ("car_id") REFERENCES "car"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_detail" ADD CONSTRAINT "order_detail_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_detail" ADD CONSTRAINT "order_detail_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

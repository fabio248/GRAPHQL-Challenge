/*
  Warnings:

  - The primary key for the `product_in_car` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `product_in_car` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "product_in_car" DROP CONSTRAINT "product_in_car_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "product_in_car_pkey" PRIMARY KEY ("car_id", "product_id");

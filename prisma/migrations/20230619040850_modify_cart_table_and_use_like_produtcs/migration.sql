/*
  Warnings:

  - The primary key for the `user_like_post` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `user_like_post` table. All the data in the column will be lost.
  - Made the column `product_id` on table `user_like_post` required. This step will fail if there are existing NULL values in that column.
  - Made the column `user_id` on table `user_like_post` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "product_in_car" DROP CONSTRAINT "product_in_car_car_id_fkey";

-- AlterTable
ALTER TABLE "user_like_post" DROP CONSTRAINT "user_like_post_pkey",
DROP COLUMN "id",
ALTER COLUMN "product_id" SET NOT NULL,
ALTER COLUMN "user_id" SET NOT NULL,
ADD CONSTRAINT "user_like_post_pkey" PRIMARY KEY ("user_id", "product_id");

-- AddForeignKey
ALTER TABLE "product_in_car" ADD CONSTRAINT "product_in_car_car_id_fkey" FOREIGN KEY ("car_id") REFERENCES "cart"("id") ON DELETE CASCADE ON UPDATE CASCADE;

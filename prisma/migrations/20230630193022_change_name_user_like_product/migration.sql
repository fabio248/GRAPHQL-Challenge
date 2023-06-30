/*
  Warnings:

  - You are about to drop the `user_like_post` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "user_like_post" DROP CONSTRAINT "user_like_post_product_id_fkey";

-- DropForeignKey
ALTER TABLE "user_like_post" DROP CONSTRAINT "user_like_post_user_id_fkey";

-- DropTable
DROP TABLE "user_like_post";

-- CreateTable
CREATE TABLE "user_like_product" (
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "product_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "user_like_product_pkey" PRIMARY KEY ("user_id","product_id")
);

-- AddForeignKey
ALTER TABLE "user_like_product" ADD CONSTRAINT "user_like_product_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_like_product" ADD CONSTRAINT "user_like_product_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

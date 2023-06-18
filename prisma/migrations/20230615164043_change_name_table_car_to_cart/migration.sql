/*
  Warnings:

  - You are about to drop the `car` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "car" DROP CONSTRAINT "car_user_id_fkey";

-- DropForeignKey
ALTER TABLE "product_in_car" DROP CONSTRAINT "product_in_car_car_id_fkey";

-- DropTable
DROP TABLE "car";

-- CreateTable
CREATE TABLE "cart" (
    "id" SERIAL NOT NULL,
    "total" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "cart_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cart_user_id_key" ON "cart"("user_id");

-- AddForeignKey
ALTER TABLE "cart" ADD CONSTRAINT "cart_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_in_car" ADD CONSTRAINT "product_in_car_car_id_fkey" FOREIGN KEY ("car_id") REFERENCES "cart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

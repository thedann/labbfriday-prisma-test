/*
  Warnings:

  - You are about to drop the column `productId` on the `Block` table. All the data in the column will be lost.
  - The `layout` column on the `Block` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Layout" AS ENUM ('FMG', 'LIST');

-- AlterTable
ALTER TABLE "Block" DROP COLUMN "productId",
DROP COLUMN "layout",
ADD COLUMN     "layout" "Layout" NOT NULL DEFAULT 'FMG';

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_BlockToProduct" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_BlockToProduct_AB_unique" ON "_BlockToProduct"("A", "B");

-- CreateIndex
CREATE INDEX "_BlockToProduct_B_index" ON "_BlockToProduct"("B");

-- AddForeignKey
ALTER TABLE "_BlockToProduct" ADD CONSTRAINT "_BlockToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "Block"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BlockToProduct" ADD CONSTRAINT "_BlockToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

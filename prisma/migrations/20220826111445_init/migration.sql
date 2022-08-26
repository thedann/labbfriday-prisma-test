/*
  Warnings:

  - Added the required column `layout` to the `Block` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Block" ADD COLUMN     "layout" TEXT NOT NULL;

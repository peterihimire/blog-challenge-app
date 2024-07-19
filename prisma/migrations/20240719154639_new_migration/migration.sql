/*
  Warnings:

  - You are about to drop the `_BlogCategories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `categories` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_BlogCategories" DROP CONSTRAINT "_BlogCategories_A_fkey";

-- DropForeignKey
ALTER TABLE "_BlogCategories" DROP CONSTRAINT "_BlogCategories_B_fkey";

-- AlterTable
ALTER TABLE "blogs" ADD COLUMN     "categories" TEXT[];

-- DropTable
DROP TABLE "_BlogCategories";

-- DropTable
DROP TABLE "categories";

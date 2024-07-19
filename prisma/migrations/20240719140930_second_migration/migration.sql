/*
  Warnings:

  - The `categories` column on the `blogs` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "blogs" DROP COLUMN "categories",
ADD COLUMN     "categories" TEXT[];

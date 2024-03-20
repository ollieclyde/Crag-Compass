/*
  Warnings:

  - You are about to drop the column `climbing_type_id` on the `Crag` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Crag_climbing_type_id_key";

-- AlterTable
ALTER TABLE "Crag" DROP COLUMN "climbing_type_id";

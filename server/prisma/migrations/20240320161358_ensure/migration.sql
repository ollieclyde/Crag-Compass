/*
  Warnings:

  - A unique constraint covering the columns `[climbing_type_id]` on the table `Crag` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `climbing_type_id` on the `Crag` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Crag" DROP COLUMN "climbing_type_id",
ADD COLUMN     "climbing_type_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Crag_climbing_type_id_key" ON "Crag"("climbing_type_id");

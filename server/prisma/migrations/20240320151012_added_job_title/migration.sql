/*
  Warnings:

  - The primary key for the `CragInfo` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `CragInfo` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CragInfo" DROP CONSTRAINT "CragInfo_pkey",
DROP COLUMN "id",
ADD COLUMN     "crag_info_id" SERIAL NOT NULL,
ADD CONSTRAINT "CragInfo_pkey" PRIMARY KEY ("crag_info_id");

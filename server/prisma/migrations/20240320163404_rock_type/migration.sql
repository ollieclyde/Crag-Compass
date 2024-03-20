/*
  Warnings:

  - You are about to drop the column `altitude` on the `Crag` table. All the data in the column will be lost.
  - You are about to drop the column `climbs` on the `Crag` table. All the data in the column will be lost.
  - You are about to drop the column `google_maps_url` on the `Crag` table. All the data in the column will be lost.
  - Added the required column `rock_type` to the `Crag` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Crag" DROP COLUMN "altitude",
DROP COLUMN "climbs",
DROP COLUMN "google_maps_url",
ADD COLUMN     "rock_type" TEXT NOT NULL;

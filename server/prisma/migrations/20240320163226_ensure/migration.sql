/*
  Warnings:

  - You are about to drop the column `googleMapsURL` on the `Crag` table. All the data in the column will be lost.
  - You are about to drop the column `ukcURL` on the `Crag` table. All the data in the column will be lost.
  - Added the required column `google_maps_url` to the `Crag` table without a default value. This is not possible if the table is not empty.
  - Added the required column `route_count` to the `Crag` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ukc_url` to the `Crag` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Crag" DROP COLUMN "googleMapsURL",
DROP COLUMN "ukcURL",
ADD COLUMN     "google_maps_url" TEXT NOT NULL,
ADD COLUMN     "route_count" INTEGER NOT NULL,
ADD COLUMN     "ukc_url" TEXT NOT NULL;

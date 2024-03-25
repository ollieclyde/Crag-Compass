/*
  Warnings:

  - The primary key for the `ClimbingType` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `climbing_type_id` on the `ClimbingType` table. All the data in the column will be lost.
  - The primary key for the `Crag` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `crag_id` on the `Crag` table. All the data in the column will be lost.
  - You are about to drop the column `rock_type` on the `Crag` table. All the data in the column will be lost.
  - You are about to drop the column `route_count` on the `Crag` table. All the data in the column will be lost.
  - You are about to drop the column `ukc_url` on the `Crag` table. All the data in the column will be lost.
  - The primary key for the `CragInfo` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `access_note` on the `CragInfo` table. All the data in the column will be lost.
  - You are about to drop the column `access_type` on the `CragInfo` table. All the data in the column will be lost.
  - You are about to drop the column `crag_id` on the `CragInfo` table. All the data in the column will be lost.
  - You are about to drop the column `crag_info_id` on the `CragInfo` table. All the data in the column will be lost.
  - The primary key for the `Route` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `climbing_type_id` on the `Route` table. All the data in the column will be lost.
  - You are about to drop the column `crag_id` on the `Route` table. All the data in the column will be lost.
  - You are about to drop the column `route_id` on the `Route` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[climbingTypeID]` on the table `ClimbingType` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[cragID]` on the table `Crag` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[cragID]` on the table `CragInfo` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[routeID]` on the table `Route` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `rockType` to the `Crag` table without a default value. This is not possible if the table is not empty.
  - Added the required column `routeCount` to the `Crag` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ukcURL` to the `Crag` table without a default value. This is not possible if the table is not empty.
  - Added the required column `accessNote` to the `CragInfo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `accessType` to the `CragInfo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cragID` to the `CragInfo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `climbingTypeID` to the `Route` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cragID` to the `Route` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CragInfo" DROP CONSTRAINT "CragInfo_crag_id_fkey";

-- DropForeignKey
ALTER TABLE "Route" DROP CONSTRAINT "Route_climbing_type_id_fkey";

-- DropForeignKey
ALTER TABLE "Route" DROP CONSTRAINT "Route_crag_id_fkey";

-- DropForeignKey
ALTER TABLE "_ClimbingTypeToCrag" DROP CONSTRAINT "_ClimbingTypeToCrag_A_fkey";

-- DropForeignKey
ALTER TABLE "_ClimbingTypeToCrag" DROP CONSTRAINT "_ClimbingTypeToCrag_B_fkey";

-- DropIndex
DROP INDEX "ClimbingType_climbing_type_id_key";

-- DropIndex
DROP INDEX "Crag_crag_id_key";

-- DropIndex
DROP INDEX "CragInfo_crag_id_key";

-- DropIndex
DROP INDEX "Route_route_id_key";

-- AlterTable
ALTER TABLE "ClimbingType" DROP CONSTRAINT "ClimbingType_pkey",
DROP COLUMN "climbing_type_id",
ADD COLUMN     "climbingTypeID" SERIAL NOT NULL,
ADD CONSTRAINT "ClimbingType_pkey" PRIMARY KEY ("climbingTypeID");

-- AlterTable
ALTER TABLE "Crag" DROP CONSTRAINT "Crag_pkey",
DROP COLUMN "crag_id",
DROP COLUMN "rock_type",
DROP COLUMN "route_count",
DROP COLUMN "ukc_url",
ADD COLUMN     "cragID" SERIAL NOT NULL,
ADD COLUMN     "rockType" TEXT NOT NULL,
ADD COLUMN     "routeCount" INTEGER NOT NULL,
ADD COLUMN     "ukcURL" TEXT NOT NULL,
ADD CONSTRAINT "Crag_pkey" PRIMARY KEY ("cragID");

-- AlterTable
ALTER TABLE "CragInfo" DROP CONSTRAINT "CragInfo_pkey",
DROP COLUMN "access_note",
DROP COLUMN "access_type",
DROP COLUMN "crag_id",
DROP COLUMN "crag_info_id",
ADD COLUMN     "accessNote" TEXT NOT NULL,
ADD COLUMN     "accessType" INTEGER NOT NULL,
ADD COLUMN     "cragID" INTEGER NOT NULL,
ADD COLUMN     "cragInfoID" SERIAL NOT NULL,
ADD CONSTRAINT "CragInfo_pkey" PRIMARY KEY ("cragInfoID");

-- AlterTable
ALTER TABLE "Route" DROP CONSTRAINT "Route_pkey",
DROP COLUMN "climbing_type_id",
DROP COLUMN "crag_id",
DROP COLUMN "route_id",
ADD COLUMN     "climbingTypeID" INTEGER NOT NULL,
ADD COLUMN     "cragID" INTEGER NOT NULL,
ADD COLUMN     "routeID" SERIAL NOT NULL,
ADD CONSTRAINT "Route_pkey" PRIMARY KEY ("routeID");

-- CreateIndex
CREATE UNIQUE INDEX "ClimbingType_climbingTypeID_key" ON "ClimbingType"("climbingTypeID");

-- CreateIndex
CREATE UNIQUE INDEX "Crag_cragID_key" ON "Crag"("cragID");

-- CreateIndex
CREATE UNIQUE INDEX "CragInfo_cragID_key" ON "CragInfo"("cragID");

-- CreateIndex
CREATE UNIQUE INDEX "Route_routeID_key" ON "Route"("routeID");

-- AddForeignKey
ALTER TABLE "CragInfo" ADD CONSTRAINT "CragInfo_cragID_fkey" FOREIGN KEY ("cragID") REFERENCES "Crag"("cragID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Route" ADD CONSTRAINT "Route_cragID_fkey" FOREIGN KEY ("cragID") REFERENCES "Crag"("cragID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Route" ADD CONSTRAINT "Route_climbingTypeID_fkey" FOREIGN KEY ("climbingTypeID") REFERENCES "ClimbingType"("climbingTypeID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClimbingTypeToCrag" ADD CONSTRAINT "_ClimbingTypeToCrag_A_fkey" FOREIGN KEY ("A") REFERENCES "ClimbingType"("climbingTypeID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClimbingTypeToCrag" ADD CONSTRAINT "_ClimbingTypeToCrag_B_fkey" FOREIGN KEY ("B") REFERENCES "Crag"("cragID") ON DELETE CASCADE ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the column `advancedRoutes` on the `CragStats` table. All the data in the column will be lost.
  - You are about to drop the column `beginnerRoutes` on the `CragStats` table. All the data in the column will be lost.
  - You are about to drop the column `eliteRoutes` on the `CragStats` table. All the data in the column will be lost.
  - You are about to drop the column `experiencedRoutes` on the `CragStats` table. All the data in the column will be lost.
  - You are about to drop the column `expertRoutes` on the `CragStats` table. All the data in the column will be lost.
  - Added the required column `advanced` to the `CragStats` table without a default value. This is not possible if the table is not empty.
  - Added the required column `beginner` to the `CragStats` table without a default value. This is not possible if the table is not empty.
  - Added the required column `elite` to the `CragStats` table without a default value. This is not possible if the table is not empty.
  - Added the required column `experienced` to the `CragStats` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expert` to the `CragStats` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CragStats" DROP COLUMN "advancedRoutes",
DROP COLUMN "beginnerRoutes",
DROP COLUMN "eliteRoutes",
DROP COLUMN "experiencedRoutes",
DROP COLUMN "expertRoutes",
ADD COLUMN     "advanced" INTEGER NOT NULL,
ADD COLUMN     "beginner" INTEGER NOT NULL,
ADD COLUMN     "elite" INTEGER NOT NULL,
ADD COLUMN     "experienced" INTEGER NOT NULL,
ADD COLUMN     "expert" INTEGER NOT NULL;

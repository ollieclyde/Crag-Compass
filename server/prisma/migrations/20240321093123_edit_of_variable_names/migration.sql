/*
  Warnings:

  - You are about to drop the column `accessType` on the `CragInfo` table. All the data in the column will be lost.
  - Added the required column `access_type` to the `CragInfo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CragInfo" DROP COLUMN "accessType",
ADD COLUMN     "access_type" INTEGER NOT NULL;

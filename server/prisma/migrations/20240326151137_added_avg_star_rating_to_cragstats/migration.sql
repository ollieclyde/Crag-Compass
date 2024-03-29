/*
  Warnings:

  - Added the required column `avgStars` to the `CragStats` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CragStats" ADD COLUMN     "avgStars" DOUBLE PRECISION NOT NULL;

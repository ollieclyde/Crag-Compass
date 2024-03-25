/*
  Warnings:

  - You are about to drop the column `accessNotes` on the `CragInfo` table. All the data in the column will be lost.
  - Added the required column `access_note` to the `CragInfo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CragInfo" DROP COLUMN "accessNotes",
ADD COLUMN     "access_note" TEXT NOT NULL;

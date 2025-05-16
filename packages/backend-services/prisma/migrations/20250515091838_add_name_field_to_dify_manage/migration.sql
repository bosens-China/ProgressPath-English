/*
  Warnings:

  - Added the required column `name` to the `dify_manages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "dify_manages" ADD COLUMN     "name" TEXT NOT NULL,
ALTER COLUMN "body" DROP NOT NULL,
ALTER COLUMN "inputs" DROP NOT NULL;

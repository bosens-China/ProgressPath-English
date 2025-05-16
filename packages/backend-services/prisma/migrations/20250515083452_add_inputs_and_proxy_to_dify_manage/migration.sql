/*
  Warnings:

  - Added the required column `inputs` to the `dify_manages` table without a default value. This is not possible if the table is not empty.
  - Made the column `body` on table `dify_manages` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "dify_manages" ADD COLUMN     "inputs" JSONB NOT NULL,
ALTER COLUMN "body" SET NOT NULL;

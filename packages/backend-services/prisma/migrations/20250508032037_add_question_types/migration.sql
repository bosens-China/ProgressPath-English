/*
  Warnings:

  - You are about to drop the column `questionType` on the `section_questions` table. All the data in the column will be lost.
  - Added the required column `question_type_id` to the `section_questions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "section_questions" DROP COLUMN "questionType",
ADD COLUMN     "question_type_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "question_types" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "question_types_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "question_types_name_key" ON "question_types"("name");

-- AddForeignKey
ALTER TABLE "section_questions" ADD CONSTRAINT "section_questions_question_type_id_fkey" FOREIGN KEY ("question_type_id") REFERENCES "question_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

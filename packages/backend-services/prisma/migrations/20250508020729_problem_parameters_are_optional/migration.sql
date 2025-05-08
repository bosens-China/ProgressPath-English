-- AlterTable
ALTER TABLE "section_questions" ALTER COLUMN "correctAnswer" DROP NOT NULL,
ALTER COLUMN "questionType" DROP DEFAULT,
ALTER COLUMN "order" DROP NOT NULL;

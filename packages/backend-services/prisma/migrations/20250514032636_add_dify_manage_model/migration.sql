-- CreateTable
CREATE TABLE "dify_manages" (
    "id" SERIAL NOT NULL,
    "apiUrl" TEXT NOT NULL,
    "description" TEXT,
    "token" TEXT NOT NULL,
    "body" JSONB,
    "headers" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dify_manages_pkey" PRIMARY KEY ("id")
);

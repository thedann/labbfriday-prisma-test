-- CreateTable
CREATE TABLE "Block" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "productId" TEXT,

    CONSTRAINT "Block_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Block_name_key" ON "Block"("name");

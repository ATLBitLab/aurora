-- CreateTable
CREATE TABLE "Prism" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Prism_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Split" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "description" TEXT,
    "percentage" DECIMAL(5,4) NOT NULL,
    "prismId" TEXT NOT NULL,
    "destinationId" TEXT NOT NULL,

    CONSTRAINT "Split_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Prism_slug_key" ON "Prism"("slug");

-- CreateIndex
CREATE INDEX "Prism_active_idx" ON "Prism"("active");

-- CreateIndex
CREATE INDEX "Split_prismId_idx" ON "Split"("prismId");

-- CreateIndex
CREATE UNIQUE INDEX "Split_prismId_destinationId_key" ON "Split"("prismId", "destinationId");

-- AddForeignKey
ALTER TABLE "Split" ADD CONSTRAINT "Split_prismId_fkey" FOREIGN KEY ("prismId") REFERENCES "Prism"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Split" ADD CONSTRAINT "Split_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "PaymentDestination"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

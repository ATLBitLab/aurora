-- CreateTable
CREATE TABLE "PaymentDestination" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "value" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,

    CONSTRAINT "PaymentDestination_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PaymentDestination_type_idx" ON "PaymentDestination"("type");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentDestination_contactId_value_key" ON "PaymentDestination"("contactId", "value");

-- AddForeignKey
ALTER TABLE "PaymentDestination" ADD CONSTRAINT "PaymentDestination_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

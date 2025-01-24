-- CreateTable
CREATE TABLE "Contact" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "screenName" TEXT,
    "nostrPubkey" TEXT,
    "email" TEXT,
    "metadata" JSONB,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Contact_nostrPubkey_key" ON "Contact"("nostrPubkey");

-- CreateIndex
CREATE UNIQUE INDEX "Contact_email_key" ON "Contact"("email");

-- CreateIndex
CREATE INDEX "Contact_firstName_idx" ON "Contact"("firstName");

-- CreateIndex
CREATE INDEX "Contact_lastName_idx" ON "Contact"("lastName");

-- CreateIndex
CREATE INDEX "Contact_screenName_idx" ON "Contact"("screenName");

-- CreateIndex
CREATE INDEX "Contact_firstName_lastName_idx" ON "Contact"("firstName", "lastName");

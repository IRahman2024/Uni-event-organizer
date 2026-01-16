/*
  Warnings:

  - A unique constraint covering the columns `[registrationId]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `registrationId` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "registrationId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Registration" ADD COLUMN     "status" TEXT DEFAULT 'pending';

-- CreateIndex
CREATE UNIQUE INDEX "Payment_registrationId_key" ON "Payment"("registrationId");

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_registrationId_fkey" FOREIGN KEY ("registrationId") REFERENCES "Registration"("id") ON DELETE CASCADE ON UPDATE CASCADE;

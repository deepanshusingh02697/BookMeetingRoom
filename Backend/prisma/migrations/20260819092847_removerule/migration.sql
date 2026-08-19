/*
  Warnings:

  - You are about to drop the column `isRecurring` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `recurrenceRule` on the `Booking` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "isRecurring",
DROP COLUMN "recurrenceRule";

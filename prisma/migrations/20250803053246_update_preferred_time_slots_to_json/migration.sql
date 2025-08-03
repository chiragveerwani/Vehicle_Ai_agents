/*
  Warnings:

  - You are about to alter the column `preferredTimeSlots` on the `Preference` table. The data in that column could be lost. The data in that column will be cast from `String` to `Json`.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN "name" TEXT;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Preference" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "drivingStyle" TEXT,
    "environment" TEXT,
    "preferredTimeSlots" JSONB,
    CONSTRAINT "Preference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Preference" ("drivingStyle", "environment", "id", "preferredTimeSlots", "userId") SELECT "drivingStyle", "environment", "id", "preferredTimeSlots", "userId" FROM "Preference";
DROP TABLE "Preference";
ALTER TABLE "new_Preference" RENAME TO "Preference";
CREATE UNIQUE INDEX "Preference_userId_key" ON "Preference"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

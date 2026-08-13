/*
  Warnings:

  - You are about to drop the `_EquipmentToRoom` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_EquipmentToRoom" DROP CONSTRAINT "_EquipmentToRoom_A_fkey";

-- DropForeignKey
ALTER TABLE "_EquipmentToRoom" DROP CONSTRAINT "_EquipmentToRoom_B_fkey";

-- DropTable
DROP TABLE "_EquipmentToRoom";

-- CreateTable
CREATE TABLE "RoomEquipment" (
    "id" SERIAL NOT NULL,
    "roomId" INTEGER NOT NULL,
    "equipmentId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RoomEquipment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RoomEquipment_roomId_equipmentId_key" ON "RoomEquipment"("roomId", "equipmentId");

-- AddForeignKey
ALTER TABLE "RoomEquipment" ADD CONSTRAINT "RoomEquipment_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomEquipment" ADD CONSTRAINT "RoomEquipment_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "Equipment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

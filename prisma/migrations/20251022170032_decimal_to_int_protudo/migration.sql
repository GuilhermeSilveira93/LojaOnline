/*
  Warnings:

  - You are about to alter the column `precoBase` on the `Produto` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Produto" ALTER COLUMN "precoBase" SET DATA TYPE INTEGER;

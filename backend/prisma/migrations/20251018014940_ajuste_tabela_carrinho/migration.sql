/*
  Warnings:

  - The primary key for the `Carrinho` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `ID_CARRINHO` on the `Carrinho` table. All the data in the column will be lost.
  - You are about to drop the column `id_usuario` on the `Carrinho` table. All the data in the column will be lost.
  - The primary key for the `CarrinhoItem` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `ID_CARRINHO_ITEM` on the `CarrinhoItem` table. All the data in the column will be lost.
  - You are about to drop the column `N_PRECO_UNITARIO_SNAPSHOT` on the `CarrinhoItem` table. All the data in the column will be lost.
  - You are about to drop the column `N_QUANTIDADE` on the `CarrinhoItem` table. All the data in the column will be lost.
  - You are about to drop the column `N_SUBTOTAL` on the `CarrinhoItem` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id]` on the table `Carrinho` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `id` to the `Carrinho` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `CarrinhoItem` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `preco_unitario_snapshot` to the `CarrinhoItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subtotal` to the `CarrinhoItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Carrinho" DROP CONSTRAINT "Carrinho_id_usuario_fkey";

-- DropForeignKey
ALTER TABLE "public"."CarrinhoItem" DROP CONSTRAINT "CarrinhoItem_ID_CARRINHO_fkey";

-- DropIndex
DROP INDEX "public"."Carrinho_id_usuario_key";

-- AlterTable
ALTER TABLE "Carrinho" DROP CONSTRAINT "Carrinho_pkey",
DROP COLUMN "ID_CARRINHO",
DROP COLUMN "id_usuario",
ADD COLUMN     "id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "CarrinhoItem" DROP CONSTRAINT "CarrinhoItem_pkey",
DROP COLUMN "ID_CARRINHO_ITEM",
DROP COLUMN "N_PRECO_UNITARIO_SNAPSHOT",
DROP COLUMN "N_QUANTIDADE",
DROP COLUMN "N_SUBTOTAL",
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "preco_unitario_snapshot" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "quantidade" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "subtotal" DECIMAL(10,2) NOT NULL,
ADD CONSTRAINT "CarrinhoItem_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "Carrinho_id_key" ON "Carrinho"("id");

-- AddForeignKey
ALTER TABLE "Carrinho" ADD CONSTRAINT "Carrinho_id_fkey" FOREIGN KEY ("id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarrinhoItem" ADD CONSTRAINT "CarrinhoItem_ID_CARRINHO_fkey" FOREIGN KEY ("ID_CARRINHO") REFERENCES "Carrinho"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

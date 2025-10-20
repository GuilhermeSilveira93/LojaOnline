/*
  Warnings:

  - You are about to drop the `produto_vendedor` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."produto_vendedor" DROP CONSTRAINT "produto_vendedor_produtoId_fkey";

-- DropForeignKey
ALTER TABLE "public"."produto_vendedor" DROP CONSTRAINT "produto_vendedor_vendedorId_fkey";

-- DropTable
DROP TABLE "public"."produto_vendedor";

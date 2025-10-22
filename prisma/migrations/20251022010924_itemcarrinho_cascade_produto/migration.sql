-- DropForeignKey
ALTER TABLE "public"."CarrinhoItem" DROP CONSTRAINT "CarrinhoItem_ID_PRODUTO_fkey";

-- AddForeignKey
ALTER TABLE "CarrinhoItem" ADD CONSTRAINT "CarrinhoItem_ID_PRODUTO_fkey" FOREIGN KEY ("ID_PRODUTO") REFERENCES "Produto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

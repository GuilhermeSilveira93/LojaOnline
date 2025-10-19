-- CreateTable
CREATE TABLE "produto_vendedor" (
    "id" TEXT NOT NULL,
    "vendedorId" TEXT NOT NULL,
    "produtoId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "produto_vendedor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "produto_vendedor_produtoId_key" ON "produto_vendedor"("produtoId");

-- AddForeignKey
ALTER TABLE "produto_vendedor" ADD CONSTRAINT "produto_vendedor_vendedorId_fkey" FOREIGN KEY ("vendedorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "produto_vendedor" ADD CONSTRAINT "produto_vendedor_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "Produto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

Desafio Técnico – LojaOnline
Neste desafio, você desenvolverá uma API para controle de inventário e vendas de uma loja
fictícia, a LojaOnline.
Regras da aplicação
• - A aplicação deve ter dois tipos de usuário: vendedor e admin - feito
• - Deve ser possível realizar login com e-mail e senha - feito
• - Deve ser possível realizar o CRUD dos produtos - feito
• - Deve ser possível realizar o CRUD dos clientes - feito
• - Deve ser possível realizar o CRUD dos pedidos
• - Deve ser possível adicionar produtos ao carrinho de compras
• - Deve ser possível finalizar a compra e gerar um pedido
• - Deve ser possível marcar um pedido como em processamento, enviado ou entregue
• - Deve ser possível listar pedidos por status
• - Deve ser possível aplicar descontos em produtos
• - Deve ser possível alterar a senha de um usuário
• - Deve ser possível listar os pedidos e seu status para o cliente
• - Deve ser possível notificar o cliente por e-mail a cada alteração no status do pedido
Regras de negócio
• - Somente o admin pode realizar operações de CRUD nos produtos
• - Somente o admin pode aplicar descontos em produtos
• - Somente o admin pode realizar operações de CRUD nos clientes
• - Somente o vendedor pode realizar o CRUD dos pedidos
• - Somente o vendedor que gerou o pedido pode atualizá-lo para 'enviado' ou 'entregue'
• - Somente o admin pode alterar a senha de um usuário
• - Não deve ser possível para um vendedor listar pedidos de outros vendedores
Conceitos que pode praticar
• - DDD, Domain Events, Clean Architecture
• - Autenticação e Autorização (RBAC)
• - Testes unitários e e2e
• - Integração com gateways de pagamento (opcional)
Tecnologia a utilizar
• - NestJs
Diferenciais
• - Criação do portal de compras utilizando Nextjs
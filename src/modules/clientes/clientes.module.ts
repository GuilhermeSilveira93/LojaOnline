import { Module } from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { ClientesDeleteController } from './controller/clientes-delete.controller';
import { ClientesCreateController } from './controller/clientes-create.controller';
import { ClientesFindByVendorIdController } from './controller/clientes-find-by-client-id.controller';
import { ClientesUpdateController } from './controller/clientes-update.controller';
import { ClientesFindManyController } from './controller/clientes-find-many.controller';

@Module({
  providers: [ClientesService],
  controllers: [
    ClientesDeleteController,
    ClientesCreateController,
    ClientesFindByVendorIdController,
    ClientesUpdateController,
    ClientesFindManyController,
  ],
  exports: [ClientesService],
})
export class ClientesModule {}

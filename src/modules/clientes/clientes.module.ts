import { Module } from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { ClientesDeleteController } from './controller/clientes-delete.controller';
import { ClientesCreateController } from './controller/clientes-create.controller';
import { ClientesFindByVendorIdController } from './controller/clientes-find-by-vendor-id.controller';
import { ClientesUpdateController } from './controller/clientes-update.controller';

@Module({
  providers: [ClientesService],
  controllers: [
    ClientesDeleteController,
    ClientesCreateController,
    ClientesFindByVendorIdController,
    ClientesUpdateController,
    ClientesFindByVendorIdController,
  ],
  exports: [ClientesService],
})
export class ClientesModule {}

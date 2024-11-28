import { Module } from '@nestjs/common';
import { BonoService } from './bono.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BonoEntity } from './bono.entity';
import { BonoController } from './bono.controller';
import { UsuarioModule } from 'src/usuario/usuario.module'; 
import { ClaseEntity } from 'src/clase/clase.entity';
import { UsuarioEntity } from 'src/usuario/usuario.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([BonoEntity, ClaseEntity, UsuarioEntity]), 
    UsuarioModule, 
  ],
  providers: [BonoService],
  controllers: [BonoController],
})
export class BonoModule {}

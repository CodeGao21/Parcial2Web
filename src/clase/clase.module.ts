import { Module } from '@nestjs/common';
import { ClaseService } from './clase.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClaseEntity } from './clase.entity';
import { ClaseController } from './clase.controller';
import { BonoEntity } from 'src/bono/bono.entity'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([ClaseEntity, BonoEntity])  
  ],
  providers: [ClaseService],
  controllers: [ClaseController]
})
export class ClaseModule {}

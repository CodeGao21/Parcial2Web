import { Module } from '@nestjs/common';
import { BonoService } from './bono.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BonoEntity } from './bono.entity';
import { BonoController } from './bono.controller';

@Module({
  imports: [TypeOrmModule.forFeature([BonoEntity])],
  providers: [BonoService],
  controllers: [BonoController]
})
export class BonoModule {}

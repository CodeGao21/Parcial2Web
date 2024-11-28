import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClaseEntity } from './clase.entity';
import { Repository } from 'typeorm';
import { BonoEntity } from '../bono/bono.entity';
import { HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class ClaseService {

  constructor(
    @InjectRepository(ClaseEntity)
    private readonly claseRepository: Repository<ClaseEntity>,

    @InjectRepository(BonoEntity)
    private readonly bonoRepository: Repository<BonoEntity>
  ) {}

  // Método para crear una clase
  async CrearClase(clase: ClaseEntity): Promise<ClaseEntity> {
    // Validar que el código tenga exactamente 10 caracteres
    if (!clase.codigo || clase.codigo.length !== 10) {
      throw new HttpException('El código de la clase debe tener exactamente 10 caracteres', HttpStatus.BAD_REQUEST);
    }

    // Guardar la clase en la base de datos
    return await this.claseRepository.save(clase);
  }

  // Método para encontrar una clase por ID
  async findClaseById(id: number): Promise<ClaseEntity> {
    const clase = await this.claseRepository.findOne({ where: { id }, relations: ['bonos'] });
    if (!clase) {
      throw new HttpException('Clase no encontrada', HttpStatus.NOT_FOUND);
    }
    return clase;
  }

  // Método para asociar un bono a una clase
  async asociarBonoAClase(claseId: number, bonoId: number): Promise<ClaseEntity> {
    const clase = await this.claseRepository.findOne({ where: { id: claseId }, relations: ['bonos'] });
    if (!clase) {
      throw new HttpException('Clase no encontrada', HttpStatus.NOT_FOUND);
    }

    const bono = await this.bonoRepository.findOne({ where: { id: bonoId } });
    if (!bono) {
      throw new HttpException('Bono no encontrado', HttpStatus.NOT_FOUND);
    }

    // Asociar el bono a la clase
    clase.bonos.push(bono);

    // Guardar la clase actualizada
    return await this.claseRepository.save(clase);
  }
}

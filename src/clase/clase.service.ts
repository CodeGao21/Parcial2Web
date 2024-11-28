import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClaseEntity } from './clase.entity';
import { Repository } from 'typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class ClaseService {

    constructor(
        @InjectRepository(ClaseEntity)
        private readonly claseRepository: Repository<ClaseEntity>
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
        const clase = await this.claseRepository.findOne({ where: { id } });
        if (!clase) {
            throw new HttpException('Clase no encontrada', HttpStatus.NOT_FOUND);
        }
        return clase;
    }
}

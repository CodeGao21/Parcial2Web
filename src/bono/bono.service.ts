import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BonoEntity } from './bono.entity';
import { Repository } from 'typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';
import { UsuarioEntity } from '../usuario/usuario.entity';
import { ClaseEntity } from '../clase/clase.entity';

@Injectable()
export class BonoService {

    constructor(
        @InjectRepository(BonoEntity)
        private readonly bonoRepository: Repository<BonoEntity>,

        @InjectRepository(UsuarioEntity)
        private readonly usuarioRepository: Repository<UsuarioEntity>,

        @InjectRepository(ClaseEntity)
        private readonly claseRepository: Repository<ClaseEntity>,
    ) {}

    // Método para crear un bono
    async crearBono(bono: BonoEntity, usuarioId: number): Promise<BonoEntity> {
        // Validar que el monto no sea vacío y sea positivo
        if (!bono.monto || bono.monto <= 0) {
            throw new HttpException('El monto del bono debe ser positivo y no vacío', HttpStatus.BAD_REQUEST);
        }

        // Validar que el usuario sea "Profesor"
        const usuario = await this.usuarioRepository.findOneBy({ id: usuarioId });
        if (!usuario) {
            throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
        }

        if (usuario.rol !== 'Profesor') {
            throw new HttpException('El usuario debe tener rol de Profesor para crear un bono', HttpStatus.FORBIDDEN);
        }

        // Guardar el bono
        return await this.bonoRepository.save(bono);
    }

    async findBonoByCodigo(cod: string): Promise<BonoEntity> {
        // Buscar la clase con el código
        const clase = await this.claseRepository.findOne({ where: { codigo: cod } });
        if (!clase) {
            throw new HttpException('Clase con ese código no encontrada', HttpStatus.NOT_FOUND);
        }

        // Buscar los bonos asociados a esa clase
        const bono = await this.bonoRepository.findOne({ where: { clase: clase } });
        if (!bono) {
            throw new HttpException('Bono asociado a la clase no encontrado', HttpStatus.NOT_FOUND);
        }

        return bono;
    }

    // Método para encontrar todos los bonos de un usuario
    async findAllBonosByUsuario(userID: number): Promise<BonoEntity[]> {
        const bonos = await this.bonoRepository.find({ where: { id: userID } });
        return bonos;
    }

    // Método para eliminar un bono
    async deleteBono(id: number): Promise<void> {
        const bono = await this.bonoRepository.findOne({ where: { id } });
        if (!bono) {
            throw new HttpException('Bono no encontrado', HttpStatus.NOT_FOUND);
        }

        // Validar que la calificación del bono no sea mayor a 4
        if (bono.calificacion && bono.calificacion > 4) {
            throw new HttpException('No se puede eliminar un bono con calificación mayor a 4', HttpStatus.FORBIDDEN);
        }

        // Eliminar el bono
        await this.bonoRepository.remove(bono);
    }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsuarioEntity } from './usuario.entity';
import { Repository } from 'typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class UsuarioService {

    constructor(
        @InjectRepository(UsuarioEntity)
        private readonly usuarioRepository: Repository<UsuarioEntity>
    ) {}

    async crearUsuario(usuario: UsuarioEntity): Promise<UsuarioEntity> {
        // Validación si el rol es 'Profesor' y si el grupo de investigación es uno de los permitidos
        if (usuario.rol === 'Profesor') {
            const gruposPermitidos = ['TICSW', 'IMAGINE', 'COMIT'];
            if (!gruposPermitidos.includes(usuario.grupo)) {
                throw new HttpException('El grupo de investigación no es válido para un Profesor', HttpStatus.BAD_REQUEST);
            }
        }

        // Validación si el rol es 'Decana' y si el número de extensión tiene 8 dígitos
        if (usuario.rol === 'Decana') {
            if (!usuario.extension || usuario.extension.toString().length !== 8) {
                throw new HttpException('El número de extensión debe tener 8 dígitos para una Decana', HttpStatus.BAD_REQUEST);
            }
        }
        return await this.usuarioRepository.save(usuario);
    }

    // Método para encontrar un usuario por ID
    async findUsuarioById(id: number): Promise<UsuarioEntity> {
        const usuario = await this.usuarioRepository.findOne({ where: { id } });
        if (!usuario) {
            throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
        }
        return usuario;
    }

    // Método para eliminar un usuario
    async eliminarUsuario(id: number): Promise<void> {
        const usuario = await this.usuarioRepository.findOne({ where: { id } });
        if (!usuario) {
            throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
        }

        // No se puede eliminar a usuarios con rol 'Decana' o si tienen un bono asociado
        if (usuario.rol === 'Decana') {
            throw new HttpException('No se puede eliminar a un usuario con rol Decana', HttpStatus.FORBIDDEN);
        }

        // Validar si el usuario tiene un bono asociado
        if (usuario.bonos.length > 0) {
            throw new HttpException('El usuario tiene un bono asociado y no puede ser eliminado', HttpStatus.FORBIDDEN);
        }

        // Eliminar el usuario
        await this.usuarioRepository.remove(usuario);
    }
}

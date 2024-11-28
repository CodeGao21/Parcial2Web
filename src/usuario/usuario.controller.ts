import { Controller, Post, Body, Param, Get, Delete } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UsuarioEntity } from './usuario.entity';
import { HttpException, HttpStatus } from '@nestjs/common';
import { UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';

@Controller('usuario')
@UseInterceptors(BusinessErrorsInterceptor)
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  // Endpoint para crear un usuario
  @Post()
  async crearUsuario(@Body() usuario: UsuarioEntity): Promise<UsuarioEntity> {
    try {
      return await this.usuarioService.crearUsuario(usuario);
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

   // Endpoint para asociar un bono a un usuario
   @Post(':usuarioId/bono/:bonoId')
    async asociarBonoAUsuario(
      @Param('usuarioId') usuarioId: number,
      @Param('bonoId') bonoId: number
    ) {
      try {
        // Llamar al servicio para asociar el bono al usuario
        const usuarioActualizado = await this.usuarioService.asociarBonoAUsuario(usuarioId, bonoId);
        return usuarioActualizado;
      } catch (error) {
        // Manejo de excepciones
        throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
      }
  
      }

  // Endpoint para obtener un usuario por ID
  @Get(':id')
  async findUsuarioById(@Param('id') id: number): Promise<UsuarioEntity> {
    try {
      return await this.usuarioService.findUsuarioById(id);
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Endpoint para eliminar un usuario
  @Delete(':id')
  async eliminarUsuario(@Param('id') id: number): Promise<void> {
    try {
      await this.usuarioService.eliminarUsuario(id);
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}

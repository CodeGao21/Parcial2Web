import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { ClaseService } from './clase.service';
import { ClaseEntity } from './clase.entity';
import { HttpException, HttpStatus } from '@nestjs/common';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors/business-errors.interceptor';
import { UseInterceptors } from '@nestjs/common';

@Controller('clase')
@UseInterceptors(BusinessErrorsInterceptor)
export class ClaseController {
  constructor(private readonly claseService: ClaseService) {}

  // Endpoint para crear una clase
  @Post()
  async crearClase(@Body() clase: ClaseEntity): Promise<ClaseEntity> {
    try {
      return await this.claseService.CrearClase(clase);
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Endpoint para obtener una clase por ID
  @Get(':id')
  async findClaseById(@Param('id') id: number): Promise<ClaseEntity> {
    try {
      return await this.claseService.findClaseById(id);
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

    // Endpoint para asociar un bono a una clase
  @Post(':claseId/bono/:bonoId')
  async asociarBonoAClase(
    @Param('claseId') claseId: number,
    @Param('bonoId') bonoId: number
  ) {
    try {
      // Llamamos al servicio para asociar el bono a la clase
      const claseActualizada = await this.claseService.asociarBonoAClase(claseId, bonoId);
      return claseActualizada;
    } catch (error) {
      // En caso de error, lanzamos una excepción con el mensaje adecuado
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}

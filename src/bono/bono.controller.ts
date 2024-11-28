import { Controller, Post, Get, Param, Body, Delete } from '@nestjs/common';
import { BonoService } from './bono.service';
import { BonoEntity } from './bono.entity';
import { HttpStatus } from '@nestjs/common';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors/business-errors.interceptor';
import { UseInterceptors } from '@nestjs/common';

@Controller('bono')
@UseInterceptors(BusinessErrorsInterceptor)
export class BonoController {
    constructor(private readonly bonoService: BonoService) {}

    // Método POST para crear un bono
    @Post()
    async crearBono(@Body() bono: BonoEntity, @Body('usuarioId') usuarioId: number): Promise<BonoEntity> {
        return await this.bonoService.crearBono(bono, usuarioId);
    }

    // Método GET para obtener un bono por código de clase
    @Get('codigo/:cod')
    async findBonoByCodigo(@Param('cod') cod: string): Promise<BonoEntity> {
        return await this.bonoService.findBonoByCodigo(cod);
    }

    // Método GET para obtener todos los bonos de un usuario
    @Get('usuario/:userID')
    async findAllBonosByUsuario(@Param('userID') userID: number): Promise<BonoEntity[]> {
        return await this.bonoService.findAllBonosByUsuario(userID);
    }

    // Método DELETE para eliminar un bono por ID
    @Delete(':id')
    async deleteBono(@Param('id') id: number): Promise<void> {
        await this.bonoService.deleteBono(id);
    }
}

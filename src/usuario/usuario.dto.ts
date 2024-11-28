import {IsNotEmpty, IsNumber, IsString } from 'class-validator';
export class UsuarioDto {
 @IsNumber()
 @IsNotEmpty()
 cedula: number;

 @IsString()
 @IsNotEmpty()
 nombre: string;

 @IsString()
 @IsNotEmpty()
 grupo: string;

 @IsNumber()
 @IsNotEmpty()
 extension: number;

 @IsString()
 @IsNotEmpty()
 rol: string;
}
import {IsNotEmpty, IsNumber, IsString } from 'class-validator';
export class ClaseDto {

 @IsString()
 @IsNotEmpty()
 nombre: string;

 @IsString()
 @IsNotEmpty()
 codigo: string;

 @IsNumber()
 @IsNotEmpty()
 creditos: number;
}
import {IsNotEmpty, IsNumber, IsString, IsUrl} from 'class-validator';
export class BonoDto {

 @IsNumber()
 @IsNotEmpty()
 monto: number;

 @IsString()
 @IsNotEmpty()
 calificacion: number;

 @IsString()
 @IsNotEmpty()
 palabraclave: string;
}
import { ClaseEntity } from 'src/clase/clase.entity';
import { UsuarioEntity } from 'src/usuario/usuario.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class BonoEntity {
 @PrimaryGeneratedColumn('increment')  
 id: number; 

 @Column()
 monto: number;

 @Column()
 calificacion: number;

 @Column()
 palabraclave: string;

 @ManyToOne(() => ClaseEntity, clase => clase.bonos)
 clase: ClaseEntity;

 @ManyToOne(() => UsuarioEntity, usuario => usuario.bonos)
 usuario: UsuarioEntity;




 
}
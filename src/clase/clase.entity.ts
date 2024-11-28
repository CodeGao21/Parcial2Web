import { BonoEntity } from 'src/bono/bono.entity';
import { UsuarioEntity } from 'src/usuario/usuario.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ClaseEntity {
 @PrimaryGeneratedColumn('increment')  
 id: number; 

 @Column()
 nombre: string;

 @Column()
 codigo: string;

 @Column()
 creditos: number;

 @ManyToOne(() => UsuarioEntity, usuario => usuario.clases)
 usuario: UsuarioEntity;

 @OneToMany(() => BonoEntity, bono => bono.clase)
 bonos: BonoEntity[];
 
}

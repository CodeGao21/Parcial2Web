import { BonoEntity } from '../bono/bono.entity';
import { ClaseEntity } from '../clase/clase.entity';
import { Column, Entity, OneToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UsuarioEntity {
  @PrimaryGeneratedColumn('increment')  
  id: number; 

  @Column()
  cedula: number;

  @Column()
  nombre: string;

  @Column()
  grupo: string;

  @Column()
  extension: number;

  @Column()
  rol: string;

  // Relación ManyToOne a UsuarioEntity para el Jefe
  @ManyToOne(() => UsuarioEntity, usuario => usuario.subordinados, { nullable: true })
  jefe: UsuarioEntity;

  // Relación OneToMany recursiva, para obtener los subordinados
  @OneToMany(() => UsuarioEntity, usuario => usuario.jefe)
  subordinados: UsuarioEntity[];

  @OneToMany(() => ClaseEntity, clase => clase.usuario)
  clases: ClaseEntity[];

  @OneToMany(() => BonoEntity, bono => bono.usuario)
  bonos: BonoEntity[];
}

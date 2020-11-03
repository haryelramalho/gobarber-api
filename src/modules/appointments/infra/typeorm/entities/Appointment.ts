/* eslint-disable camelcase */
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import User from '@modules/users/infra/typeorm/entities/User';

/**
 * Passando a classe como parâmetro para função Entity()
 * E fazendo referência a tabela no banco de dados que essa classe vai representar
 */
@Entity('appointments')
class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column() // Colum do tipo User como foi declarada acima
  provider_id: string;

  /**
   * Um para Um (OneToOne)
   * Um para Muitos (OneToMany)
   * Muitos para Muitos (ManyToMany)
   */
  @ManyToOne(() => User)
  @JoinColumn({ name: 'provider_id' })
  provider: User;

  @Column() // Colum do tipo User como foi declarada acima
  user_id: string;

  // Apenas uma forma de definir o relacionamento, não é uma coluna
  // Mas também posso passar o objeto usuário que ele irá criar da mesma forma
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column('timestamp with time zone')
  date: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Appointment;

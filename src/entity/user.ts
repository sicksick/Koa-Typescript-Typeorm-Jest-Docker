import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable
} from 'typeorm';
import { Group } from './group';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: true})
  name?: string;

  @Column({unique: true})
  email: string;

  @Column()
  password: string;

  @Column({nullable: true})
  image?: string;

  @Column({nullable: true})
  facebook_id?: string;

  @Column({nullable: true})
  google_id?: string;

  @ManyToMany(type => Group)
  @JoinTable({
    name: 'users_group',
    joinColumn: {
      name: 'user_id',
    },
    inverseJoinColumn: {
      name: 'group_id',
    }
  })
  groups: Group[];

  @CreateDateColumn()
  public created_at: Date;

  @UpdateDateColumn()
  public updated_at: Date;
}

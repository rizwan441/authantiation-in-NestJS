import { Exclude } from 'class-transformer';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { userRole } from './UserDtos';


@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  username: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  @Exclude()
  email: string;

  @Column({ type: 'enum', enum: userRole, default: userRole.User })
  role: userRole;
}

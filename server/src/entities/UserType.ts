import { PrimaryGeneratedColumn, Column, Entity, OneToMany } from 'typeorm';
import { User } from './User';

@Entity()
export class UserType {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    isActive: boolean;

    @Column()
    code: string;

    @OneToMany(type => User, user => user.userType)
    users: User[];
}

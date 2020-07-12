import { PrimaryGeneratedColumn, Column, Entity, OneToMany, JoinColumn, ManyToOne } from 'typeorm';
import { UserType } from '@entities/UserType';
import { App } from './App';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    creationDate: Date;

    @Column({
      nullable: true
    })
    activationDate?: Date;

    @Column()
    avatar: string;

    @Column()
    password: string;

    @Column()
    isActive: boolean;

    @Column({
      nullable: true
    })
    activationToken?: string;

    @ManyToOne(type => UserType, userType => userType.users)
    userType: UserType;

    @OneToMany(type => App, app => app.user)
    apps: App[];
}

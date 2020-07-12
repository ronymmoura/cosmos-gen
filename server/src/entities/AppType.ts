import { PrimaryGeneratedColumn, Column, Entity, OneToMany } from 'typeorm';
import { App } from './App';

@Entity()
export class AppType {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    isActive: boolean;

    @Column()
    icon: string;

    @OneToMany(type => App, app => app.appType)
    apps: App[];
}

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { App } from './App';
import { AppVersion } from './AppVersion';

@Entity()
export class AppApi {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  url: string;

  @Column()
  isActive: boolean;

  @ManyToOne(type => App, app => app.appUrls)
  app: App;

  @OneToMany(type => AppVersion, version => version.api)
  versions: AppVersion[];
}

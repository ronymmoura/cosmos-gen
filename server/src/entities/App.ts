import { PrimaryGeneratedColumn, Column, Entity, OneToMany, JoinColumn, ManyToOne } from 'typeorm';
import { AppType } from '@entities/AppType';
import { User } from './User';
import { AppVersion } from './AppVersion';
import { AppApi } from './AppApi';

@Entity()
export class App {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  image: string;

  @ManyToOne(type => User, user => user.apps)
  user: User;

  @ManyToOne(type => AppType, appType => appType.apps)
  appType: AppType;

  @OneToMany(type => AppApi, appApi => appApi.app)
  appUrls: AppApi[];
}

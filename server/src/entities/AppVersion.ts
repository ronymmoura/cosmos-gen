import { PrimaryGeneratedColumn, Column, Entity, ManyToOne } from 'typeorm';
import { App } from '@entities/App';
import { AppApi } from './AppApi';

@Entity()
export class AppVersion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  version: string;

  @Column()
  creationDate: Date;

  @Column()
  file: string;

  @Column()
  isActive: boolean;

  @ManyToOne(type => AppApi, appApi => appApi.versions)
  api: AppApi;
}

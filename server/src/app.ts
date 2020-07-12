import express from 'express';
import path from 'path';
import cors from 'cors';
import { errors } from 'celebrate';

import packageJson from '../package.json';
import { UsersController } from '@controllers/Users';
import { UserTypesController } from '@controllers/UserTypes';
import { AppTypesController } from '@controllers/AppTypes';
import { AppsController } from '@controllers/Apps';
import { AppApisController } from '@controllers/AppApi';
import { AppVersionsController } from '@controllers/AppVersion';

const app = express();
app.use(cors());
app.use(express.json());

app.use(UsersController.routes());
app.use(UserTypesController.routes());
app.use(AppTypesController.routes());
app.use(AppsController.routes());
app.use(AppApisController.routes());
app.use(AppVersionsController.routes());

app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));

app.get('/', (req, res) => {
  res.json(packageJson.version);
});

app.use(errors());

export default app;

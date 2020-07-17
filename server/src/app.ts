import express from 'express';
import path from 'path';
import cors from 'cors';
import { errors } from 'celebrate';
import jwt from 'express-jwt';
import packageJson from '../package.json';
import jwtConfig from '@config/jwt';

import { UsersController } from '@controllers/Users';
import { UserTypesController } from '@controllers/UserTypes';
import { AppTypesController } from '@controllers/AppTypes';
import { AppsController } from '@controllers/Apps';
import { AppApisController } from '@controllers/AppApi';
import { AppVersionsController } from '@controllers/AppVersion';
import { SessionController } from '@controllers/Session';

const app = express();

app.use(cors());
app.use(express.json());

app.use(jwt(jwtConfig).unless({
  path: [
    // public routes that don't require authentication
    '/',
    '/session/login'
  ]
}));

app.use(SessionController.routes());
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

// app.use(errorHandler);
app.use(errors());

export default app;

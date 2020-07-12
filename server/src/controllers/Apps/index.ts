import { Request, Response, Router } from 'express';
import { AppRepository } from '@repositories/AppRepository';
import { AppTypeRepository } from '@repositories/AppTypeRepository';
import { App } from '@entities/App';

import multer from 'multer';
import multerConfig from '@config/multer';
import { celebrate } from 'celebrate';
import Joi from '@hapi/joi';
import { UsersRepository } from '@repositories/UsersRepository';

const upload = multer(multerConfig);

export class AppsController {
  static routes () : Router {
    const router = Router();

    router.get('/apps', AppsController.list);
    router.get('/apps/:id', AppsController.get);

    router.post(
      '/apps',
      upload.single('image'),
      AppsController.createValidations(),
      AppsController.create);

    router.put(
      '/apps',
      upload.single('image'),
      AppsController.updateValidations(),
      AppsController.update);

    router.delete('/apps/:id', AppsController.delete);

    return router;
  }

  static async list (req: Request, res: Response) {
    const apps = await new AppRepository().list();

    return res.json(apps);
  }

  static async get (req: Request, res: Response) {
    const id = Number(req.params.id);
    const app = await new AppRepository().get(id);

    return res.json(app);
  }

  static async create (req: Request, res: Response) {
    const { body } = req;

    const appType = await new AppTypeRepository().get(body.appTypeId);
    const user = await new UsersRepository().get(body.userId);

    const app: App = {
      ...body,
      appType,
      user,
      image: req.file.filename
    };

    const result = await new AppRepository().insert(app);
    const insertedId = result.id;
    return res.json(insertedId);
  }

  static async update (req: Request, res: Response) {
    const { body } = req;

    const appType = await new AppTypeRepository().get(body.appTypeId);
    const user = await new UsersRepository().get(body.userId);

    const app: App = {
      ...body,
      appType,
      user,
      image: req.file.filename
    };

    await new AppRepository().update(app);
    return res.sendStatus(200);
  }

  static async delete (req: Request, res: Response) {
    const id = Number(req.params.id);
    const result = await new AppRepository().delete(id);
    // TODO: delete picture's file
    return res.sendStatus(200);
  }

  static createValidations () {
    return celebrate(
      {
        body: Joi.object().keys({
          name: Joi.string()
            .required()
            .messages({
              'string.required': 'Name is required'
            }),
          userId: Joi.number()
            .required(),
          appTypeId: Joi.number()
            .required()
        })
      },
      {
        abortEarly: false
      }
    );
  }

  static updateValidations () {
    return celebrate(
      {
        body: Joi.object().keys({
          id: Joi.number()
            .required()
            .messages({
              'string.required': 'ID is required'
            }),
          name: Joi.string()
            .required()
            .messages({
              'string.required': 'Name is required'
            }),
          appTypeId: Joi.number()
            .required()
        })
      },
      {
        abortEarly: false
      }
    );
  }
}

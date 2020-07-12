import { Router, Request, Response } from 'express';
import { celebrate, Joi } from 'celebrate';

import { AppApi } from '@entities/AppApi';

import { AppRepository } from '@repositories/AppRepository';
import { AppApiRepository } from '@repositories/AppApiRepository';

export class AppApisController {
  static routes () : Router {
    const router = Router();

    router.get('/appApis', AppApisController.list);
    router.get('/appApis/:id', AppApisController.get);

    router.post(
      '/appApis',
      AppApisController.createValidations(),
      AppApisController.create
    );

    router.put(
      '/appApis',
      AppApisController.updateValidations(),
      AppApisController.update
    );

    router.delete('/appApis/:id', AppApisController.delete);

    return router;
  }

  static async list (req: Request, res: Response) {
    const apis = await new AppApiRepository().list();

    return res.json(apis);
  }

  static async get (req: Request, res: Response) {
    const id = Number(req.params.id);
    const api = await new AppApiRepository().get(id);

    return res.json(api);
  }

  static async create (req: Request, res: Response) {
    const { body } = req;

    const app = await new AppRepository().get(body.appId);

    const appApi: AppApi = {
      ...body,
      app
    };

    const result = await new AppApiRepository().save(appApi);
    const insertedId = result.id;
    return res.json(insertedId);
  }

  static async update (req: Request, res: Response) {
    const { body } = req;

    const app = await new AppRepository().get(body.appId);

    const appApi: AppApi = {
      ...body,
      app
    };

    const result = await new AppApiRepository().save(appApi);
    return res.sendStatus(200);
  }

  static async delete (req: Request, res: Response) {
    const id = Number(req.params.id);
    const result = await new AppApiRepository().delete(id);
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
          url: Joi.string()
            .required()
            .messages({
              'string.required': 'URL is required'
            }),
          isActive: Joi.boolean()
            .default(false),
          appId: Joi.number()
            .required()
            .messages({
              'string.required': 'APP ID is required'
            })
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
          isActive: Joi.boolean()
            .default(false),
          url: Joi.string()
            .required()
            .messages({
              'string.required': 'URL is required'
            })
        })
      },
      {
        abortEarly: false
      }
    );
  }
}

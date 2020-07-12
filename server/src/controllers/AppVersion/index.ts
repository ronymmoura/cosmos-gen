import { Router, Request, Response } from 'express';
import { AppVersionRepository } from '@repositories/AppVersionRepository';
import { AppRepository } from '@repositories/AppRepository';
import { AppVersion } from '@entities/AppVersion';
import { AppApiRepository } from '@repositories/AppApiRepository';

import multer from 'multer';
import multerConfig from '@config/multer';
import { celebrate } from 'celebrate';
import Joi from '@hapi/joi';

const upload = multer(multerConfig);

export class AppVersionsController {
  static routes () : Router {
    const router = Router();

    router.get('/appVersions', AppVersionsController.list);
    router.get('/appVersions/:id', AppVersionsController.get);

    router.post(
      '/appVersions',
      upload.single('file'),
      AppVersionsController.createValidations(),
      AppVersionsController.create
    );

    router.put(
      '/appVersions',
      upload.single('file'),
      AppVersionsController.updateValidations(),
      AppVersionsController.update
    );

    router.delete('/appVersions/:id', AppVersionsController.delete);

    return router;
  }

  static async list (req: Request, res: Response) {
    const apis = await new AppVersionRepository().list();

    return res.json(apis);
  }

  static async get (req: Request, res: Response) {
    const id = Number(req.params.id);
    const api = await new AppVersionRepository().get(id);

    return res.json(api);
  }

  static async create (req: Request, res: Response) {
    const { body } = req;

    const api = await new AppApiRepository().get(body.apiId);

    const version: AppVersion = {
      ...body,
      api,
      file: req.file.filename
    };

    const result = await new AppVersionRepository().save(version);
    const insertedId = result.id;
    return res.json(insertedId);
  }

  static async update (req: Request, res: Response) {
    const { body } = req;

    const api = await new AppApiRepository().get(body.apiId);

    const version: AppVersion = {
      ...body,
      api,
      file: req.file.filename
    };

    const result = await new AppVersionRepository().save(version);
    return res.sendStatus(200);
  }

  static async delete (req: Request, res: Response) {
    const id = Number(req.params.id);
    const result = await new AppVersionRepository().delete(id);
    return res.sendStatus(200);
  }

  static createValidations () {
    return celebrate(
      {
        body: Joi.object().keys({
          version: Joi.string()
            .required()
            .messages({
              'string.required': 'URL is required'
            }),
          creationDate: Joi.date()
            .default(Date.now()),
          isActive: Joi.bool()
            .default(false),
          apiId: Joi.number()
            .required()
            .messages({
              'string.required': 'API ID is required'
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
          version: Joi.string()
            .required()
            .messages({
              'string.required': 'URL is required'
            }),
          creationDate: Joi.date()
            .default(Date.now()),
          isActive: Joi.bool()
            .default(false),
          apiId: Joi.number()
            .required()
            .messages({
              'string.required': 'API ID is required'
            })
        })
      },
      {
        abortEarly: false
      }
    );
  }
}

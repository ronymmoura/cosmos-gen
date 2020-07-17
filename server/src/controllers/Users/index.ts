import { Request, Response, Router } from 'express';
import { UsersRepository } from '@repositories/UsersRepository';
import { UserTypeRepository } from '@repositories/UserTypeRepository';
import { User } from '@entities/User';
import crypto from 'crypto';

import multer from 'multer';
import multerConfig from '@config/multer';
import { celebrate } from 'celebrate';
import Joi from '@hapi/joi';
import jwtConfig from '@config/jwt';

const upload = multer(multerConfig);

export class UsersController {
  static routes () : Router {
    const router = Router();

    router.get('/users', UsersController.list);
    router.get('/users/:id', UsersController.get);

    router.post(
      '/users',
      upload.single('avatar'),
      UsersController.createValidations(),
      UsersController.create);

    router.put(
      '/users',
      upload.single('avatar'),
      UsersController.updateValidations(),
      UsersController.update);

    router.put(
      '/users/updatePassword',
      UsersController.updatePasswordValidations(),
      UsersController.updatePassword);

    router.delete('/users/:id', UsersController.delete);

    return router;
  }

  static async list (req: Request, res: Response) {
    const users = await new UsersRepository().list();

    const serializedUsers = users.map(user => {
      delete user.password;
      return user;
    });

    return res.json(serializedUsers);
  }

  static async get (req: Request, res: Response) {
    const id = Number(req.params.id);
    const user = await new UsersRepository().get(id);

    delete user.password;

    return res.json(user);
  }

  static async create (req: Request, res: Response) {
    const { body } = req;

    const userType = await new UserTypeRepository().get(body.userTypeId);

    const user: User = {
      ...body,
      userType,
      avatar: req.file.filename
    };

    const result = await new UsersRepository().insert(user);
    const insertedId = result.id;
    return res.json(insertedId);
  }

  static async update (req: Request, res: Response) {
    const { body } = req;
    delete body.password;

    const userType = await new UserTypeRepository().get(body.userTypeId);

    const user: User = {
      ...body,
      userType,
      avatar: req.file.filename
    };

    await new UsersRepository().update(user);
    return res.sendStatus(200);
  }

  static async updatePassword (req: Request, res: Response) {
    try {
      var { newPassword, oldPassword, id } = req.body;
      const userRepository = new UsersRepository();

      oldPassword = crypto.createHmac('sha256', jwtConfig.secret).update(oldPassword).digest('hex');

      const user = await userRepository.get(id);

      if (user.password !== oldPassword)
        throw new Error('Old Password do not match');

      newPassword = crypto.createHmac('sha256', jwtConfig.secret).update(newPassword).digest('hex');
      user.password = newPassword;

      await userRepository.update(user);
      return res.sendStatus(200);
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  static async delete (req: Request, res: Response) {
    const id = Number(req.params.id);
    const result = await new UsersRepository().delete(id);
    // TODO: delete avatar's file
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
          email: Joi.string()
            .required()
            .email()
            .messages({
              'string.required': 'E-mail is required',
              'string.email': 'E-mail is invalid'
            }),
          creationDate: Joi.date()
            .default(Date.now()),
          activationDate: Joi.date(),
          password: Joi.string()
            .required()
            .messages({
              'string.required': 'Password is required'
            }),
          isActive: Joi.bool()
            .default(false),
          userTypeId: Joi.number()
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
          email: Joi.string()
            .required()
            .email()
            .messages({
              'string.required': 'E-mail is required',
              'string.email': 'E-mail is invalid'
            }),
          creationDate: Joi.date()
            .default(Date.now()),
          activationDate: Joi.date(),
          isActive: Joi.bool()
            .default(false),
          userTypeId: Joi.number()
            .required()
        })
      },
      {
        abortEarly: false
      }
    );
  }

  static updatePasswordValidations () {
    return celebrate(
      {
        body: Joi.object().keys({
          id: Joi.number()
            .required()
            .messages({
              'decimal.required': 'ID is required'
            }),
          newPassword: Joi.string()
            .required()
            .messages({
              'string.required': 'Password is required'
            }),
          oldPassword: Joi.string()
            .required()
            .messages({
              'string.required': 'Old Password is required'
            })
        })
      },
      {
        abortEarly: false
      }
    )
  }
}

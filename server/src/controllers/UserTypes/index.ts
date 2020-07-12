import { Request, Response, Router } from 'express';
import { UserTypeRepository } from '@repositories/UserTypeRepository';

export class UserTypesController {
  static routes () : Router {
    const router = Router();

    router.get('/userTypes', UserTypesController.list);
    router.get('/userTypes/:id', UserTypesController.get);

    return router;
  }

  static async list (req: Request, res: Response) {
    const users = await new UserTypeRepository().list();

    return res.json(users);
  }

  static async get (req: Request, res: Response) {
    const id = Number(req.params.id);
    const user = await new UserTypeRepository().get(id);

    return res.json(user);
  }
}

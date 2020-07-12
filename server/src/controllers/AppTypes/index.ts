import { Request, Response, Router } from 'express';
import { AppTypeRepository } from '@repositories/AppTypeRepository';

export class AppTypesController {
  static routes () : Router {
    const router = Router();

    router.get('/appTypes', AppTypesController.list);
    router.get('/appTypes/:id', AppTypesController.get);

    return router;
  }

  static async list (req: Request, res: Response) {
    const apps = await new AppTypeRepository().list();

    return res.json(apps);
  }

  static async get (req: Request, res: Response) {
    const id = Number(req.params.id);
    const app = await new AppTypeRepository().get(id);

    return res.json(app);
  }
}

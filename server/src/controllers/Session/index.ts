import { Request, Response, Router } from 'express';
import { UsersRepository } from '@repositories/UsersRepository';
import jwt from 'express-jwt';
import jwtConfig from '@config/jwt';

export class SessionController {
  static routes () : Router {
    const router = Router();

    router.get('/session', SessionController.get);
    router.post('/session/login', SessionController.login);

    return router;
  }

  static async login (req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const result = await new UsersRepository().login(email, password);
      return res.json(result);
    } catch (err) {
      return res.status(401).json(err.message);
    }
  }

  static async get (req: any, res: Response) {
    const { id } = req.user;
    const user = await new UsersRepository().get(id);
    delete user.password;

    return res.json(user);
  }
}

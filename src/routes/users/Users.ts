import { Router } from 'express';

import { UsersController } from '@controllers/users/Users';
import { AuthenticationController } from '@controllers/auth/Auth';

const router = Router();

const users = new UsersController();
const auth = new AuthenticationController();

router.route('/')
  .get([auth.authJWT, auth.checkRole(['admin'])], users.getUsers)
  .post([auth.authJWT, auth.checkRole(['admin'])], users.createUser)
  .put([auth.authJWT, auth.checkRole(['admin'])], users.updateUser)
  .delete([auth.authJWT, auth.checkRole(['admin'])], users.deleteUser);

router.get('/admin', [auth.authJWT, auth.checkRole(['admin'])], users.getUsersPaginated);

export default router;

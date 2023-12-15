import { Router } from 'express';

import { RolesController } from '@controllers/users/Roles';
import { AuthenticationController } from '@controllers/auth/Auth';

const router = Router();

const roles = new RolesController();
const auth = new AuthenticationController();

router.route('/')
  .get([auth.authJWT, auth.checkRole(['admin'])], roles.getRoles)
  .post([auth.authJWT, auth.checkRole(['admin'])], roles.createRole)
  .put([auth.authJWT, auth.checkRole(['admin'])], roles.updateRole)
  .delete([auth.authJWT, auth.checkRole(['admin'])], roles.deleteRole);

router.get('/admin', [auth.authJWT, auth.checkRole(['admin'])], roles.getRolesPaginated);

export default router;

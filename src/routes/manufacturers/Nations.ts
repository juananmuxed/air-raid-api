import { Router } from 'express';

import { NationsController } from '@controllers/manufacturers/Nations';
import { AuthenticationController } from '@controllers/auth/Auth';
import { uploader } from '@middlewares/Upload';

const router = Router();

const nations = new NationsController();
const auth = new AuthenticationController();

router.route('/')
  .get(nations.getNations)
  .post([auth.authJWT, auth.checkRole(['editor', 'admin'])], nations.createNation)
  .put([auth.authJWT, auth.checkRole(['editor', 'admin'])], nations.updateNation)
  .delete([auth.authJWT, auth.checkRole(['editor', 'admin'])], nations.deleteNation);

router.get('/admin', [auth.authJWT, auth.checkRole(['editor', 'admin'])], nations.getNationsPaginated);

router.post('/bulk', [auth.authJWT, auth.checkRole(['editor', 'admin']), uploader.single('file')], nations.bulkCreateNations);

export default router;

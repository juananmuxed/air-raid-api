import { Router } from 'express';

import { StatsController } from '@controllers/aircraft/Stats';
import { AuthenticationController } from '@controllers/auth/Auth';
import { uploader } from '@middlewares/Upload';

const router = Router();

const stats = new StatsController();
const auth = new AuthenticationController();

router.route('/')
  .get([auth.authJWT, auth.checkRole(['editor', 'admin'])], stats.getStats)
  .post([auth.authJWT, auth.checkRole(['editor', 'admin'])], stats.createStat)
  .put([auth.authJWT, auth.checkRole(['editor', 'admin'])], stats.updateStat)
  .delete([auth.authJWT, auth.checkRole(['editor', 'admin'])], stats.deleteStat);

router.get('/admin', [auth.authJWT, auth.checkRole(['editor', 'admin'])], stats.getStatsPaginated);

router.post('/bulk', [auth.authJWT, auth.checkRole(['editor', 'admin']), uploader.single('file')], stats.bulkCreateStats);

export default router;

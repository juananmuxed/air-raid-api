import { Router } from 'express';

import { CostsController } from '@controllers/aircraft/Costs';
import { AuthenticationController } from '@controllers/auth/Auth';
import { uploader } from '@middlewares/Upload';

const router = Router();

const costs = new CostsController();
const auth = new AuthenticationController();

router.route('/')
  .get([auth.authJWT, auth.checkRole(['editor', 'admin'])], costs.getCosts)
  .post([auth.authJWT, auth.checkRole(['editor', 'admin'])], costs.createCost)
  .put([auth.authJWT, auth.checkRole(['editor', 'admin'])], costs.updateCost)
  .delete([auth.authJWT, auth.checkRole(['editor', 'admin'])], costs.deleteCost);

router.get('/admin', [auth.authJWT, auth.checkRole(['editor', 'admin'])], costs.getCostsPaginated);

router.post('/bulk', [auth.authJWT, auth.checkRole(['editor', 'admin']), uploader.single('file')], costs.bulkCreateCosts);

export default router;

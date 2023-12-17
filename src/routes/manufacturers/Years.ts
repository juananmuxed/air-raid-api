import { Router } from 'express';

import { YearsController } from '@controllers/manufacturers/Years';
import { AuthenticationController } from '@controllers/auth/Auth';
import { uploader } from '@middlewares/Upload';

const router = Router();

const years = new YearsController();
const auth = new AuthenticationController();

router.route('/')
  .get(years.getYears)
  .post([auth.authJWT, auth.checkRole(['editor', 'admin'])], years.createYear)
  .put([auth.authJWT, auth.checkRole(['editor', 'admin'])], years.updateYear)
  .delete([auth.authJWT, auth.checkRole(['editor', 'admin'])], years.deleteYear);

router.get('/admin', [auth.authJWT, auth.checkRole(['editor', 'admin'])], years.getYearsPaginated);

router.post('/bulk', [auth.authJWT, auth.checkRole(['editor', 'admin']), uploader.single('file')], years.bulkCreateYears);

export default router;

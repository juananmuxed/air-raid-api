import { Router } from 'express';

import { NationYearsController } from '@controllers/manufacturers/NationYears';
import { AuthenticationController } from '@controllers/auth/Auth';
import { uploader } from '@middlewares/Upload';

const router = Router();

const nationYears = new NationYearsController();
const auth = new AuthenticationController();

router.route('/')
  .get([auth.authJWT, auth.checkRole(['editor', 'admin'])], nationYears.getNationYears)
  .post([auth.authJWT, auth.checkRole(['editor', 'admin'])], nationYears.createNationYear)
  .put([auth.authJWT, auth.checkRole(['editor', 'admin'])], nationYears.updateNationYear)
  .delete([auth.authJWT, auth.checkRole(['editor', 'admin'])], nationYears.deleteNationYear);

router.get('/admin', [auth.authJWT, auth.checkRole(['editor', 'admin'])], nationYears.getNationYearsPaginated);

router.post('/bulk', [auth.authJWT, auth.checkRole(['editor', 'admin']), uploader.single('file')], nationYears.bulkCreateNationYears);

// TODO: doc swagger
router.get('/nation/:nationId', nationYears.getNationYearsByNation);

export default router;

import { Router } from 'express';

import { PlanesController } from '@controllers/aircraft/Planes';
import { AuthenticationController } from '@controllers/auth/Auth';
import { uploader } from '@middlewares/Upload';

const router = Router();

const planes = new PlanesController();
const auth = new AuthenticationController();

router.route('/')
  .get(planes.getPlanes)
  .post([auth.authJWT, auth.checkRole(['editor', 'admin'])], planes.createPlane)
  .put([auth.authJWT, auth.checkRole(['editor', 'admin'])], planes.updatePlane)
  .delete([auth.authJWT, auth.checkRole(['editor', 'admin'])], planes.deletePlane);

router.get('/admin', [auth.authJWT, auth.checkRole(['editor', 'admin'])], planes.getPlanesPaginated);

router.post('/bulk', [auth.authJWT, auth.checkRole(['editor', 'admin']), uploader.single('file')], planes.bulkCreatePlanes);

export default router;

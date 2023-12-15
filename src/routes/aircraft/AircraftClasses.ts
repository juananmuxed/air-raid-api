import { Router } from 'express';

import { AircraftClassesController } from '@controllers/aircraft/AircraftClasses';
import { AuthenticationController } from '@controllers/auth/Auth';
import { uploader } from '@middlewares/Upload';

const router = Router();

const aircraftClasses = new AircraftClassesController();
const auth = new AuthenticationController();

router.route('/')
  .get([auth.authJWT, auth.checkRole(['editor', 'admin'])], aircraftClasses.getAircraftClasses)
  .post([auth.authJWT, auth.checkRole(['editor', 'admin'])], aircraftClasses.createAircraftClass)
  .put([auth.authJWT, auth.checkRole(['editor', 'admin'])], aircraftClasses.updateAircraftClass)
  .delete([auth.authJWT, auth.checkRole(['editor', 'admin'])], aircraftClasses.deleteAircraftClass);

router.get('/admin', [auth.authJWT, auth.checkRole(['editor', 'admin'])], aircraftClasses.getAircraftClassesPaginated);

router.post('/bulk', [auth.authJWT, auth.checkRole(['editor', 'admin']), uploader.single('file')], aircraftClasses.bulkCreateAircraftClasses);

export default router;

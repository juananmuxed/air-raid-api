import { Router } from 'express';

import { SpecialAbilitiesController } from '@controllers/specialAbilities/SpecialAbilities';
import { AuthenticationController } from '@controllers/auth/Auth';
import { uploader } from '@middlewares/Upload';

const router = Router();

const specialAbilities = new SpecialAbilitiesController();
const auth = new AuthenticationController();

router.route('/')
  .get([auth.authJWT, auth.checkRole(['editor', 'admin'])], specialAbilities.getSpecialAbilities)
  .post([auth.authJWT, auth.checkRole(['editor', 'admin'])], specialAbilities.createSpecialAbility)
  .put([auth.authJWT, auth.checkRole(['editor', 'admin'])], specialAbilities.updateSpecialAbility)
  .delete([auth.authJWT, auth.checkRole(['editor', 'admin'])], specialAbilities.deleteSpecialAbility);

router.get('/admin', [auth.authJWT, auth.checkRole(['editor', 'admin'])], specialAbilities.getSpecialAbilitiesPaginated);

router.post('/bulk', [auth.authJWT, auth.checkRole(['editor', 'admin']), uploader.single('file')], specialAbilities.bulkCreateSpecialAbilities);

export default router;

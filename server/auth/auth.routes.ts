import { Router } from 'express';
import { celebrate } from 'celebrate';

import validator from './auth.validators';
import controller from './auth.controllers';

const router = Router();

router.route('/').post(celebrate(validator), controller);

export default router;

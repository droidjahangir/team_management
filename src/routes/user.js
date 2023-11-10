import { Router } from 'express';

import { authCheckMiddleware, protect } from '../middleware/auth.middleware.js';
import * as userController from '../controllers/userController.js';

const router = Router();

router.route('/register').post(userController.registerUser);
router.route('/login').post(userController.login);
router
  .route('/update')
  .post(
    protect,
    authCheckMiddleware(['ADMIN', 'FRONTEND', 'BACKEND', 'FULL_STACK']),
    userController.updateUser
  );
router
  .route('/all')
  .get(
    protect,
    authCheckMiddleware(['ADMIN', 'FRONTEND', 'BACKEND', 'FULL_STACK']),
    userController.allUser
  );
router
  .route('/delete')
  .delete(
    protect,
    authCheckMiddleware(['ADMIN', 'FRONTEND', 'BACKEND', 'FULL_STACK']),
    userController.deleteUser
  );
router
  .route('/view')
  .get(
    protect,
    authCheckMiddleware(['ADMIN', 'FRONTEND', 'BACKEND', 'FULL_STACK']),
    userController.viewUser
  );

export default router;

import { Router } from 'express';

import { authCheckMiddleware, protect } from '../middleware/auth.middleware.js';
import * as teamController from '../controllers/team.controller.js';

const router = Router();

router
  .route('/create')
  .post(protect, authCheckMiddleware(['ADMIN']), teamController.createTeam);

router
  .route('/inviteTeamMember')
  .post(
    protect,
    authCheckMiddleware(['ADMIN']),
    teamController.inviteTeamMember
  );

router
  .route('/pendingMemberList')
  .get(
    protect,
    authCheckMiddleware(['ADMIN']),
    teamController.getPendingMemberList
  );

router
  .route('/activeMemberList')
  .get(
    protect,
    authCheckMiddleware(['ADMIN']),
    teamController.getActiveMemberList
  );

// router.route('/login').post(userController.login);
// router
//   .route('/update')
//   .post(
//     protect,
//     authCheckMiddleware(['ADMIN', 'FRONTEND', 'BACKEND', 'FULL_STACK']),
//     userController.updateUser
//   );
// router
//   .route('/all')
//   .get(
//     protect,
//     authCheckMiddleware(['ADMIN', 'FRONTEND', 'BACKEND', 'FULL_STACK']),
//     userController.allUser
//   );
// router
//   .route('/delete')
//   .delete(
//     protect,
//     authCheckMiddleware(['ADMIN', 'FRONTEND', 'BACKEND', 'FULL_STACK']),
//     userController.deleteUser
//   );
// router
//   .route('/view')
//   .get(
//     protect,
//     authCheckMiddleware(['ADMIN', 'FRONTEND', 'BACKEND', 'FULL_STACK']),
//     userController.viewUser
//   );

export default router;

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

router
  .route('/inviteTeamMember')
  .put(
    protect,
    authCheckMiddleware(['ADMIN']),
    teamController.inviteTeamMember
  );

router
  .route('/getActiveMemberList')
  .get(
    protect,
    authCheckMiddleware(['ADMIN']),
    teamController.getActiveMemberList
  );

router
  .route('/invitedMemberList')
  .get(
    protect,
    authCheckMiddleware(['ADMIN']),
    teamController.getInvitedMemberList
  );

router
  .route('/invitedMemberList')
  .get(
    protect,
    authCheckMiddleware(['ADMIN']),
    teamController.getInvitedMemberList
  );

router
  .route('/acceptTeamMemberRequest')
  .put(
    protect,
    authCheckMiddleware(['TEAM_MEMBER']),
    teamController.acceptTeamMemberRequest
  );

router
  .route('/rejectTeamMemberRequest')
  .put(
    protect,
    authCheckMiddleware(['TEAM_MEMBER']),
    teamController.rejectTeamMemberRequest
  );

export default router;

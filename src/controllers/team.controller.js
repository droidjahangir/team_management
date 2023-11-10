import * as lodashType from 'lodash';
const { size } = lodashType;
import team from '../models/team.js';
import user from '../models/user.js';

// @desc    Create new team
// @route   POST /v1/team/createTeam
// @access  Admin
const createTeam = async (req, res) => {
  try {
    const { name, category, description, invitedUserIds = [] } = req.body;

    const isTeamExist = await team.findOne({ name });

    if (isTeamExist) {
      res.status(400);
      throw new Error('Team already exists');
    }

    const createdTeam = await team.create({
      name,
      category,
      description,
      invitedUserIds,
    });

    if (createdTeam) {
      res.status(201).json({
        _id: createdTeam._id,
        name: createdTeam.name,
        category: createdTeam.category,
        description: createdTeam.description,
        invitedUserIds: createdTeam.invitedUserIds,
      });
    } else {
      res.status(400);
      throw new Error('Invalid team data');
    }
  } catch (err) {
    console.log('ERROR:', err);
    res.status(500).json({
      data: null,
      success: false,
      message: 'Internal Server Error Occurred.',
    });
  }
};

// @desc    invite team member
// @route   POST /v1/team/inviteTeamMember
// @access  Admin
const inviteTeamMember = async (req, res) => {
  try {
    const { email, teamId } = req.query;
    const userInfo = await user.findOne({ email });

    if (!size(userInfo)) {
      res.status(400);
      throw new Error('Invited user does not exist');
    }

    const updatedTeam = await team.findOneAndUpdate(
      { _id: teamId },
      { $addToSet: { invitedUserIds: [userInfo._id] } },
      {
        new: true,
        runValidators: true,
      }
    );

    // update user model to inform about invitation
    const updatedUser = await user.findOneAndUpdate(
      { _id: userInfo._id },
      { $addToSet: { pendingTeams: [teamId] } },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!size(updatedUser)) {
      res.status(400);
      throw new Error('can not update user invitation');
    }

    if (size(updatedTeam)) {
      res.status(201).json({
        _id: updatedTeam._id,
        name: updatedTeam.name,
        category: updatedTeam.category,
        description: updatedTeam.description,
        invitedUserIds: updatedTeam.invitedUserIds,
      });
    } else {
      res.status(400);
      throw new Error('Invalid team data');
    }
  } catch (err) {
    console.log('ERROR:', err);
    res.status(500).json({
      data: null,
      success: false,
      message: 'Internal Server Error Occurred.',
    });
  }
};

// @desc    Get active member list
// @route   POST /v1/team/activeMemberList
// @access  Admin
const getActiveMemberList = async (req, res) => {
  try {
    const { teamId } = req.query;

    const activeUsers = await team.aggregate([
      {
        $match: {
          _id: teamId,
        },
      },
      {
        $unwind: {
          path: '$userIds',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userIds',
          foreignField: '_id',
          pipeline: [
            {
              $project: {
                _id: 1,
                name: 1,
                avatarKey: 1,
              },
            },
          ],
          as: 'activeUser',
        },
      },
      {
        $unwind: {
          path: '$activeUser',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: '$_id',
          name: { $first: '$name' },
          activeUsers: {
            $push: '$activeUser',
          },
        },
      },
    ]);

    if (size(activeUsers)) {
      res.status(201).json({
        _id: activeUsers._id,
        name: activeUsers.name,
        activeUsers: activeUsers.activeUsers,
      });
    } else {
      res.status(400);
      throw new Error('Invalid team data');
    }
  } catch (err) {
    console.log('ERROR:', err);
    res.status(500).json({
      data: null,
      success: false,
      message: 'Internal Server Error Occurred.',
    });
  }
};

// @desc    Get invited member list
// @route   POST /v1/team/invitedMemberList
// @access  Admin
const getInvitedMemberList = async (req, res) => {
  try {
    const { teamId } = req.query;

    const invitedUsers = await team.aggregate([
      {
        $match: {
          _id: teamId,
        },
      },
      {
        $unwind: {
          path: '$invitedUserIds',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'invitedUserIds',
          foreignField: '_id',
          pipeline: [
            {
              $project: {
                _id: 1,
                name: 1,
                avatarKey: 1,
              },
            },
          ],
          as: 'invitedUser',
        },
      },
      {
        $unwind: {
          path: '$invitedUser',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: '$_id',
          name: { $first: '$name' },
          invitedUsers: {
            $push: '$invitedUser',
          },
        },
      },
    ]);

    if (size(invitedUsers)) {
      res.status(201).json({
        _id: invitedUsers._id,
        name: invitedUsers.name,
        invitedUsers: invitedUsers.invitedUsers,
      });
    } else {
      res.status(400);
      throw new Error('Invalid team data');
    }
  } catch (err) {
    console.log('ERROR:', err);
    res.status(500).json({
      data: null,
      success: false,
      message: 'Internal Server Error Occurred.',
    });
  }
};

export {
  createTeam,
  inviteTeamMember,
  getActiveMemberList,
  getInvitedMemberList,
};

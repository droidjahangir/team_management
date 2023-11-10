import user from '../models/user.js';
import generateToken from '../utils/generateToken.js';
// import { matchPassword, createHash } from '../helper/user.helper.js';

// @desc    Register a new user
// @route   POST /v1/user
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let { role } = req.body;
    const allowedRole = ['ADMIN', 'FRONTEND', 'BACKEND', 'FULL_STACK'];
    let updatedRoles = [];

    if (role?.length > 0) {
      role.foreach((e) => {
        if (allowedRole.includes(e)) updatedRoles.push(e);
      });
    } else updatedRoles = ['ADMIN'];

    console.log({ updatedRoles });

    const isUserExist = await user.findOne({ email });

    if (isUserExist) {
      res.status(400);
      throw new Error('User already exists');
    }

    console.log('passed ===========>');

    // const hashedPassword = await createHash(password);

    const createdUser = await user.create({
      name,
      email,
      password,
      role: updatedRoles,
    });
    console.log('passed after inserting user =============>');

    if (createdUser) {
      res.status(201).json({
        _id: createdUser._id,
        name: createdUser.name,
        email: createdUser.email,
        token: generateToken(createdUser._id),
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
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

// @desc    login user & get token
// @route   POST /v1/user/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userInfo = await user.findOne({ email, password });
    // if (userInfo && (await matchPassword(userInfo.password, password))) {

    if (userInfo) {
      res.json({
        _id: userInfo._id,
        name: userInfo.name,
        email: userInfo.email,
        token: generateToken(userInfo._id),
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
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

const allUser = async (req, res) => {
  try {
    let userInfo = await user.find();
    res.status(200).json({
      data: userInfo,
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      data: null,
      success: false,
      message: 'Internal Server Error Occurred.',
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    console.log('request params ======> ', req.query);
    let deletedUser = await user.findOneAndDelete({ _id: req.query.userId });

    console.log('Deleted user +++ ', deletedUser);
    if (deletedUser) {
      res.status(202).json({
        success: true,
        message: 'user deleted successfully',
      });
    } else {
      res.status(409).json({
        success: false,
        message: "Couldn't delete user.",
      });
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

const updateUser = async (req, res) => {
  try {
    const _id = body.userId;
    delete body.userId;

    let data = await user.findOne({ _id });
    if (!data)
      res.status(409).json({
        message: 'user not found.',
        success: false,
      });
    let update = await user.updateOne({ _id }, { $set: req.body });
    if (update) {
      res.status(201).json({
        data: data,
        message: 'user updated successfully.',
        success: true,
      });
    } else {
      res.status(409).json({
        message: 'user could not be updated.',
        success: false,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      data: null,
      success: false,
      message: 'Internal Server Error Occurred.',
    });
  }
};

const viewUser = async (req, res) => {
  try {
    console.log({ queryInfo: req.query });
    let data = await user.findOne({ _id: req.query.userId });
    if (!data)
      res.status(409).json({
        message: 'user not found.',
        success: false,
      });

    res.status(200).json({
      data,
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      data: null,
      success: false,
      message: 'Internal Server Error Occurred.',
    });
  }
};

export { allUser, deleteUser, updateUser, viewUser, registerUser, login };

import user from '../models/user.js';
import generateToken from '../utils/generateToken.js';
import { matchPassword, createHash } from '../helper/user.helper.js';

// @desc    Register a new user
// @route   POST /v1/user
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let { roles } = req.body;
    const allowedRole = ['ADMIN', 'FRONTEND', 'BACKEND', 'FULL_STACK'];
    let updatedRoles = [];

    if (roles?.length > 0) {
      roles.foreach((e) => {
        if (allowedRole.includes(e)) updatedRoles.push(e);
      });
    } else updatedRoles = ['ADMIN'];

    console.log('updated role =========> ', updatedRoles);
    console.log({ name, email, password });
    console.log('roles updated =========>');
    console.log({ user });

    const isUserExist = await user.findOne({ email });

    if (isUserExist) {
      res.status(400);
      throw new Error('User already exists');
    }

    console.log('passed ===========>');

    const hashedPassword = await createHash(password);

    console.log({ name, email, hashedPassword, roles });

    const createdUser = await user.create({
      name,
      email,
      password: hashedPassword,
      roles,
    });
    console.log('passed after inserting user =============>');

    if (createdUser) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
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

    const user = await user.findOne({ email });

    if (user && (await matchPassword(password, user.password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
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
    let userInfo = await user.findOneAndDelete({ _id: req.user.id });

    if (userInfo) {
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
    console.log({ paramsInfo: req.params, req });
    let data = await user.findOne({ _id: req.params.userId });
    if (!data)
      res.status(409).json({
        message: 'user not found.',
        success: false,
      });

    res.status(200).json({
      data: data,
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

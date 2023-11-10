import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';

import User from '../models/user.js';

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.userId).select('-password');

      console.log('req ====> ', req.user);

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

const authCheckMiddleware = (roles = []) => {
  return function (req, res, next) {
    const userRole = req.user.role;
    console.log({ userRole });

    if (!roles.some((role) => userRole.includes(role))) {
      throw new HttpException(
        401,
        "You don't have permission to access this resource"
      );
    }

    console.log('valid user ====>');

    // Continue to the next middleware or route handler
    next();
  };
};

export { protect, authCheckMiddleware };

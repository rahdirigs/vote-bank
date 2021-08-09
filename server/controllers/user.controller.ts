import { compare } from 'bcryptjs';
import expressAsyncHandler from 'express-async-handler';
import { User } from '../models/users/user.model';
import generateToken from '../utilities/generate-token';

/**
 * POST /api/users/login
 * @desc: Authenticate user
 * @access: public
 */
export const authUser = expressAsyncHandler(async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (user) {
    const matched = await compare(password, user.password);
    if (matched) {
      res.json({
        _id: user._id,
        name: user.name,
        username: user.username,
        contact: user.contact,
        isAdmin: user.isAdmin,
        isDeputy: user.isDeputy,
        pincode: user.pincode,
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      throw new Error('Incorrect password');
    }
  } else {
    res.status(404);
    throw new Error('User not found...');
  }
});

/**
 * POST /api/users
 * @desc: Register a new user
 * @access: public
 */
export const registerUser = expressAsyncHandler(async (req, res) => {
  const { name, username, password, contact, pincode } = req.body;
  const userExists = await User.findOne({ username });
  if (userExists) {
    res.status(400);
    throw new Error('User under the given username already exists...');
  }
  const user = await User.create({
    name,
    username,
    password,
    contact,
    pincode,
  });
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      username: user.username,
      contact: user.contact,
      isAdmin: user.isAdmin,
      isDeputy: user.isDeputy,
      pincode: user.pincode,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data...');
  }
});

/**
 * GET /api/users/profile
 * @desc: Get logged in user details
 * @access: protected
 */
export const getUserDetails = expressAsyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      username: user.username,
      contact: user.contact,
      isAdmin: user.isAdmin,
      isDeputy: user.isDeputy,
      pincode: user.pincode,
    });
  } else {
    res.status(404);
    throw new Error('User not found...');
  }
});

/**
 * PUT /api/users/profile
 * @desc: Update user details
 * @access: protected
 */
export const updateUserDetails = expressAsyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.username = req.body.username || user.name;
    if (req.body.password) {
      user.password = req.body.password;
    }
    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      username: updatedUser.username,
      contact: updatedUser.contact,
      isAdmin: updatedUser.isAdmin,
      isDeputy: updatedUser.isDeputy,
      pincode: updatedUser.pincode,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

/**
 * GET /api/users
 * @desc: Get all users
 * @access: protected, admin or deputy
 */
export const getUsers = expressAsyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

/**
 * GET /api/users/:id
 * @desc: Get user details by id
 * @access: protected, admin or deputy
 */
export const getUserById = expressAsyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      username: user.username,
      contact: user.contact,
      pincode: user.pincode,
      isAdmin: user.isAdmin,
      isDeputy: user.isDeputy,
    });
  } else {
    res.status(404);
    throw new Error('User not found...');
  }
});

/**
 * DELETE /api/users/:id
 * @desc: Delete admin or deputy users only
 * @access: protected, admin
 */
export const deleteUser = expressAsyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    if (user.isAdmin || user.isDeputy) {
      await user.remove();
      res.json({
        message: 'User removed...',
      });
    } else {
      res.status(401);
      throw new Error('Insufficient privileges');
    }
  } else {
    res.status(404);
    throw new Error('User not found...');
  }
});

/**
 * POST /api/users/deputy
 * @desc: Register a new deputy
 * @access: protected, admin
 */
export const registerDeputy = expressAsyncHandler(async (req, res) => {
  const { name, username, password, contact, pincode, isDeputy } = req.body;
  const userExists = await User.findOne({ username });
  if (userExists) {
    res.status(400);
    throw new Error('User under the given username already exists...');
  }
  const user = await User.create({
    name,
    username,
    password,
    contact,
    pincode,
    isDeputy,
  });
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      username: user.username,
      contact: user.contact,
      isAdmin: user.isAdmin,
      isDeputy: user.isDeputy,
      pincode: user.pincode,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data...');
  }
});

/**
 * POST /api/users/admin
 * @desc: Register a new admin
 * @access: protected admin only
 */
export const registerAdmin = expressAsyncHandler(async (req, res) => {
  const { name, username, password, contact, pincode, isAdmin } = req.body;
  const userExists = await User.findOne({ username });
  if (userExists) {
    res.status(400);
    throw new Error('User under the given username already exists...');
  }
  const user = await User.create({
    name,
    username,
    password,
    contact,
    pincode,
    isAdmin,
  });
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      username: user.username,
      contact: user.contact,
      isAdmin: user.isAdmin,
      isDeputy: user.isDeputy,
      pincode: user.pincode,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data...');
  }
});

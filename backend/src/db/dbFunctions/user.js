import { User } from '../../db/schema/user';
import { Dog } from '../../db/schema/dog';
import { Centre } from '../../db/schema/centre';
import { getChat } from './chat';

// Create a new user
const createUser = async (name, email, role, centre) => {
  try {
    const newUser = new User({
      name,
      email,
      role,
      centre
    });
    const savedUser = await newUser.save();
    return savedUser;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Get all users
const getAllUsers = async () => {
  try {
    const users = await User.find();
    return users;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Get a single user by ID
const getUserByIdOrEmail = async (identifier) => {
  try {
    let user;

    if (identifier.includes('@')) {
      // If the identifier contains '@', assume it's an email
      user = await User.findOne({ email: identifier });
    } else {
      // Otherwise, treat it as an ID
      user = await User.findById(identifier);
    }

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getUserByEmail = async (email) => {
  try {
    const user = await User.findOne({ email: email.toString() });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Delete a user
const deleteUser = async (id) => {
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      throw new Error('User not found');
    }
    return { message: 'User deleted successfully' };
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateUser = async (id, userData) => {
  try {
    const user = await User.findByIdAndUpdate(id, userData, { new: true });
    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateChats = async (id, newChat) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $push: { chats: newChat } },
      { new: true }
    );
    return updatedUser;
  } catch (error) {
    throw new Error('Failed to update user chats');
  }
};

const getDogsByEmail = async (email) => {
  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      throw new Error('User not found');
    }

    const user_centre = user.centre;

    const centre = await Centre.findOne({ name: user_centre });

    if (!centre) {
      throw new Error('Centre not found');
    }

    const centerId = String(centre._id);

    const dogs = await Dog.find({ centre: centerId });

    return dogs;
  } catch (error) {
    return false;
  }
};
const getAllChats = async (id) => {
  try {
    const dbUserChats = await User.findById(id, { _id: 0, chats: 1 });
    const chats = dbUserChats.chats;
    const returnedChats = [];

    if (chats.length > 0) {
      for (var i = 0; i < chats.length; i++) {
        const chat = await getChat(chats[i]);
        returnedChats.push(chat);
      }
    }

    return returnedChats;
  } catch (error) {
    throw new Error('Failed to find user chats');
  }
};

const getSearchResults = async (searchQuery, userEmail) => {
  try {
    const regex = new RegExp(`^${searchQuery}`, 'i');
    const users = await User.find({ name: regex, email: { $ne: userEmail } });
    return users;
  } catch (error) {
    throw new Error('Failed to find user chats');
  }
};

export {
  createUser,
  getAllUsers,
  getUserByIdOrEmail,
  getDogsByEmail,
  deleteUser,
  updateUser,
  updateChats,
  getAllChats,
  getSearchResults
};

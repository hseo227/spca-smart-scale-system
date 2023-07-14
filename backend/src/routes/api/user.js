import express from 'express';
import {
  createUser,
  getAllUsers,
  getUserByIdOrEmail,
  deleteUser,
  updateUser,
  updateChats,
  getDogsByEmail,
  getAllChats,
  getSearchResults
} from '../../db/dbFunctions/user';
import auth from '../../middleware/firebaseAuth';
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { name, email, role, centre } = req.body;
    console.log(req.body);
    const newUser = await createUser(name, email, role, centre);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// router.use(auth); CHANGE BEFORE FINAL

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await getUserByIdOrEmail(req.params.id);
    res.json(user);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Delete a user
router.delete('/:id', async (req, res) => {
  try {
    const result = await deleteUser(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

router.put('/update/:id', async (req, res) => {
  try {
    const updatedUser = await updateUser(req.params.id, req.body);
    res.json(updatedUser);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Update a user's chat
router.put('/chats/:id', async (req, res) => {
  try {
    const { newChat } = req.body;
    const updatedUser = await updateChats(req.params.id, newChat);
    res.json(updatedUser);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

router.get('/dogs/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const dogs = await getDogsByEmail(email);
    res.json(dogs);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Get all the user's chats
router.get('/chats/:id', async (req, res) => {
  try {
    const chats = await getAllChats(req.params.id);
    res.json(chats);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Search for a user
router.get('/search/:searchQuery/:userEmail', async (req, res) => {
  try {
    const searchResults = await getSearchResults(req.params.searchQuery, req.params.userEmail);
    res.json(searchResults);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

export default router;

import express from 'express';
import { addANewMessage, createChat, getChat, getMessages } from '../../db/dbFunctions/chat';
import auth from '../../middleware/firebaseAuth';

const router = express.Router();
// router.use(auth); // CHANGE BEFORE FINAL

// create a chat
router.post('/:id', async (req, res) => {
  const { id } = req.params;
  const { users } = req.body;
  const dbChat = await getChat(id);

  console.log(users);

  if (!dbChat) {
    await createChat(id, users);
  }

  res.sendStatus(201);
});

// get one chat
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const chat = await getChat(id);

  res.status(200).json(chat);
});

// get all the messages in a chat
router.get('/all-messages/:id', async (req, res) => {
  const { id } = req.params;
  const messages = await getMessages(id);
  res.status(200).json(messages);
});

// add a new message in the chat
router.put('/new-message/:id', async (req, res) => {
  const { id } = req.params;
  const message = req.body;

  const success = await addANewMessage(id, message);

  res.sendStatus(success ? 204 : 404);
});

export default router;

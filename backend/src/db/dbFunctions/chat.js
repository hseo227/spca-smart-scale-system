import { Chat } from '../../db/schema/chat';

async function getChat(id) {
  return await Chat.findOne({ roomId: id.toString() });
}

async function createChat(id, users) {
  console.log('create chat');
  const dbChat = new Chat({ roomId: id, messages: [], users: users });
  dbChat.save();
}

async function getMessages(id) {
  return await Chat.findOne({ roomId: id.toString() }, { messages: 1 });
}

async function addANewMessage(id, message) {
  return await Chat.updateOne({ roomId: id.toString() }, { $push: { messages: message } });
}

export { getChat, createChat, getMessages, addANewMessage };

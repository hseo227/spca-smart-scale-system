import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const chatSchema = new Schema({
  roomId: String,
  users: [{ type: String }],
  messages: [
    {
      id: String,
      username: String,
      userId: String,
      message: String,
    },
  ],
});

const Chat = mongoose.model('Chat', chatSchema);

export { Chat };

const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, required: true },
  centre: { type: String, required: true },
  chats: [{ type: String }]
});

const User = mongoose.model('User', userSchema);

export { User };

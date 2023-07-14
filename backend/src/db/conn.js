/* eslint-disable no-undef */
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const DEFAULT_CONNECTION_STRING = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@capstone23.b136mgx.mongodb.net/Capstone?retryWrites=true&w=majority`;

/**
 * This function begins the process of connecting to the database, and returns a promise that will
 * resolve when the connection is established.
 */
export default function connectToDatabase(connectionString = DEFAULT_CONNECTION_STRING) {
  return mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
}

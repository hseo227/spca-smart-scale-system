/* eslint-disable no-undef */
const https = require('https');
const fs = require('fs');
import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { join } from 'path';
import connectToDatabase from './db/conn';
import http from 'http';
import { Server } from 'socket.io';
dotenv.config();

// Setup our routes.
import routes from './routes';

// Setup Express
const app = express();
const port = process.env.PORT || 5001;

// Setup body-parser
app.use(cors());
app.use(express.json());
app.use('/', routes);

// Make the "public" folder available statically
app.use(express.static(join(__dirname, '../public')));

// Set up emailing notification
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'hotmail',
  auth: {
    user: 'capstoneGroup23@outlook.com',
    pass: 'capstone23',
  },
});

const sendEmail = async (recipientEmail, senderName, message) => {
  const options = {
    from: 'capstoneGroup23@outlook.com',
    to: recipientEmail,
    subject: 'You have a new message from Smart Scale',
    text: `You have one new message from ${senderName} "${message}". Please login to Smart Scale to view this message`,
  };

  transporter.sendMail(options, function (err, data) {
    if (err) {
      console.log('Error ' + err);
    } else {
      console.log('Email sent successfully');
    }
  });
};

// Setup server for in-app messaging
const server = https.createServer({
        key: fs.readFileSync('key.pem'),
        cert: fs.readFileSync('cert.pem'),
      },
      app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

// Set up the socket connection
io.on('connection', (socket) => {
  console.log(`${socket.id} user just connected`);

  // add a user to a chat room
  socket.on('join_room', (data) => {
    const { room } = data;
    console.log('joined');
    socket.join(room); // let the user join the room
  });

  // receive and send message to users in the room
  socket.on('send_message', (data) => {
    const { room } = data;
    io.in(room).emit('receive_message', data);
    sendEmail(data.recipientEmail, data.username, data.message);
  });

  socket.on('leave_room', (data) => {
    const { room } = data;
    console.log('left');
    socket.leave(room);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

// Start the DB running. Then, once it's connected, start the server.
connectToDatabase().then(function () {
  // eslint-disable-next-line no-console

    server.listen(port, () => {
      console.log(`server is runing at port ${port}`);
    });
  //app.listen(port, () => console.log(`App server listening on port ${port}!`));
});

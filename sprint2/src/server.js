// // =============================================================================
// // EECE/CS 3093C Software Engineering — Lab 1
// // server.js — code skeleton provided by Phu Phung
// // complete implementation by Corey Brunner
// // =============================================================================
// const express = require("express");
// const http = require("http");
// const { Server } = require("socket.io");
// const path = require("path");
// const app = express();
// const server = http.createServer(app);
// const io = new Server(server);
// const UsersDB = require('./Database Files/UsersDB');
// const ChatHistoryDB = require('./Database Files/ChatHistoryDB');

// app.use(express.static(path.join(__dirname, "ui")));

// const PORT = process.env.PORT || 8080;
// (async () => {
//   try{
//     await UsersDB.ConnectToUserDB();
//     await UsersDB.findUser();
//     await ChatHistoryDB.ConnectToMessageHistoryDB();
//     await ChatHistoryDB.findMessage();
//     server.listen(PORT, () =>
//     console.log('Server running on port ' + PORT));
//   }catch (err){
//     console.log('Error> Server.js: failed to strart - database connection error', err);
//     process.exit(1);
//   }
// })();


// //server.listen(PORT, () => console.log("Server running on port " + PORT));

// // In-memory store: socketId → username
// const userlist = new Map();

// io.on("connection", (socket) => {
//   // Auto-assign a unique username from the socket ID
//   //const username = 'User_' + socket.id.slice(-5);
//   socket.on("joinedUser", (username) => {
//     userlist.set(socket.id, username);
//     console.log("New client connected - socket ID: " + socket.id);
//     io.emit(
//       "status",
//       username +
//         " joined the chat. Number of connected clients: " +
//         userlist.size,
//     );
//     console.log(Array.from(userlist.values()));
//     io.emit("user-list", Array.from(userlist.values()));
//   });

//   //Todo: UC-02 (AC-02.1): notify all connected clients that a new user joined
//   // ---------------------------------------------------------------------------
//   // Use-Case-01: Send message
//   //
//   // AC-01.1: a username is always assigned on connection — every sender
//   //          is identified before any message can be sent
//   // AC-01.2: empty or non-string messages are ignored — no broadcast is sent
//   // AC-01.3: the message is broadcast to ALL connected clients
//   // AC-01.4: the broadcast payload includes the sender's username and the text
//   // AC-01.5: input is cleared after sending (enforced client-side)
//   // ---------------------------------------------------------------------------
//   //Todo: code to implement the above use case and AC items
//   socket.on("message", (data) => {
//     //AC-01.2: ignore empty messages
//     if (!data || data.trim() === "") return;
//     //AC-01.3 + AC-01.4: broadcast to all clients with sender username
//     const sender = userlist.get(socket.id);
//     console.log(`DEBUG>"${sender}: sent ${data}"`);
//     io.emit("message", sender + " says: " + data.trim());
//   });

//   socket.on("private-message", (data) => {
//     const sender = userlist.get(socket.id);
//     if (!sender) return;
//     if (
//       !data ||
//       typeof data.text !== "string" ||
//       data.text.trim() === "" ||
//       !data.to
//     )
//       return;

//     const payload = {
//       from: sender,
//       to: data.to,
//       text: data.text.trim(),
//       timestamp: new Date().toISOString(),
//     };

//     const targetSocketId = [...userlist.entries()].find(
//       ([id, username]) => username === data.to,
//     )?.[0];

//     if (targetSocketId) {
//       console.log(`DEBUG> private: ${sender} -> ${data.to}: ${payload.text}`);
//       io.to(targetSocketId).emit("private-message", payload);
//       socket.emit("private-message", payload);
//     } else {
//       socket.emit("private-message-error", `${data.to} is not online.`);
//     }
//   });

//   // (F1.8) Typing Status Indicator - Public and Private Chat
//   // Public typing: show typing status to everyone except the person typing
//   socket.on("public-typing", () => {
//     const username = userlist.get(socket.id);
//     if (!username) return;

//     socket.broadcast.emit("public-typing", username);
//   });

//   socket.on("public-stop-typing", () => {
//     const username = userlist.get(socket.id);
//     if (!username) return;

//     socket.broadcast.emit("public-stop-typing", username);
//   });

//   // Private typing: show typing status to the selected recipient
//   socket.on("private-typing", (data) => {
//     const sender = userlist.get(socket.id);
//     if (!sender) {
//       return;
//     }
//     if (!data || !data.to) {
//       return;
//     }

//     const targetSocketId = [...userlist.entries()].find(
//       ([id, username]) => username === data.to)?.[0];

//     if (targetSocketId) {
//       io.to(targetSocketId).emit("private-typing", sender);
//     }

//     socket.on("private-stop-typing", (data) => {
//       const sender = userlist.get(socket.id);
//       if (!sender) {
//         return;
//       }
//       if (!data || !data.to) {
//         return;
//       }

//       const targetSocketId = [...userlist.entries()].find(
//         ([id, username]) => username === data.to)?.[0];

//       if (targetSocketId) {
//         io.to(targetSocketId).emit("private-stop-typing", sender);
//       }
//     });
//   });

//   // ---------------------------------------------------------------------------
//   // Use-Case-02: Receive message — disconnect notification
//   //
//   // AC-02.2: all connected clients are notified when a user leaves
//   // ---------------------------------------------------------------------------
//   socket.on("disconnect", () => {
//     const username = userlist.get(socket.id);
//     userlist.delete(socket.id);
//     console.log("Client disconnected - socket ID: " + socket.id);
//     //todo: code to broadcast the status
//     io.emit(
//       "status",
//       username +
//         " left the chat. Number of connected clients: " +
//         userlist.size,
//     );
//     io.emit("user-list", Array.from(userlist.values()));
//   });
// });

// =============================================================================
// EECE/CS 3093C Software Engineering — Lab 1
// server.js — code skeleton provided by Phu Phung
// complete implementation by Pawan Poudyel
// =============================================================================
const express    = require('express');
const http       = require('http');
const { Server } = require('socket.io');
const path       = require('path');
const app    = express();
const server = http.createServer(app);
const io     = new Server(server);
const messengerdb = require('./Database Files/messengerdb');

// AC-02.6 (Security): CSP header - browser-level defense-in-depth
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' https://cdnjs.cloudflare.com; " +
    "style-src 'self' 'unsafe-inline'; " +
    "connect-src 'self' https://cdnjs.cloudflare.com"
  );
  next();
});

app.use(express.static(path.join(__dirname, 'ui')));

const PORT = process.env.PORT || 8080;
// server.listen(PORT, () => console.log('Server running on port ' + PORT)); before mongodb integration

(async () => {
  try {
    await messengerdb.connect();

    server.listen(PORT, () =>
      console.log('Server running on port ' + PORT)
    );
  } catch (err) {
    console.log(
      'Error>server.js: failed to start - database connection error',
      err
    );
    process.exit(1); // Fail fast — don't run a server that can't authenticate anyone.
  }
})();

// In-memory store: socketId → username
const userlist = new Map();

// =============================================================
// Use-Case-03: Join Chat - credential store (internal to Use-Case-03, not part of Use-Case-04)
// Temporary: hard-coded JSON array - Lab 2 only
// TODO (Sprint 2): replace with MongoDB Atlas + bcrypt hashing
// =============================================================
const users = [
  { username: 'abc', password: 'Pass1234' },
  { username: 'xyz', password: 'Pass5678' },
  { username: 'test', password: 'Pass9012' }
];

// =============================================================
// Use-Case-04: Authorize User
// returns true if this connection was authenticated by Use-Case-03
// =============================================================
function authorizeUser(socket) {
  if (!socket || !socket.authenticated)
    console.log('Connection has not been authenticated');
  return socket.authenticated === true;
}

// =============================================================
// Helper: send an event only to authenticated connections
// Used by Use-Case-01 (Send Message) and Use-Case-03 (Join Chat)
// =============================================================
function sendToAuthenticatedClients(event, data) {
  userlist.forEach((_, sid) => {
    const s = io.sockets.sockets.get(sid);
    if (s && authorizeUser(s)) s.emit(event, data);
  });
}

io.on('connection', (socket) => {

  socket.authenticated = false;

  // ---------------------------------------------------------------------------
  // Use-Case-03: Join Chat
  // ---------------------------------------------------------------------------
  socket.on('join-chat', async (data) => {
    if(!data || typeof data.username !== 'string' || typeof data.password !== 'string') {
      socket.emit('join-error', 'Invalid username or password');
      return;
    }

    const username = data.username.trim();
    const password = data.password;
    const user = await messengerdb.find(username, password);

    if(!user) {
      socket.emit('join-error', 'Invalid username or password');
      return;
    }

    socket.authenticated = true;
    userlist.set(socket.id, username);
    console.log('New client connected - socket ID: ' + socket.id);
    socket.emit('join-success', username);
    sendToAuthenticatedClients('status', username + ' joined the chat. Number of connected clients: ' + userlist.size);

    var chat_history = await messengerdb.loadChatHistory();
    if (chat_history && chat_history.length > 0) {
      chat_history = chat_history.reverse();
      socket.emit("chat_history", chat_history);
    }
  });

  // ---------------------------------------------------------------------------
  // Use-Case-01: Send message
  //
  // AC-01.1: a username is assigned after Join Chat — every sender
  //          is identified before any message can be sent
  // AC-01.2: empty or non-string messages are ignored — no broadcast is sent
  // AC-01.3: the message is broadcast to ALL authenticated clients
  // AC-01.4: the broadcast payload includes the sender's username and the text
  // AC-01.5: input is cleared after sending (enforced client-side)
  // ---------------------------------------------------------------------------
  //Todo: code to implement the above use case and AC items
  socket.on('message', (data) => {
    console.log(`Debug> received a chat message: ${data}`); //new debug for Lab 2 security check
    // <<include>> UC-04: Authorize User //new for Lab 2
    if (!authorizeUser(socket)) {
       socket.emit('not-authorized');
      return;
    }
    // AC-01.2: ignore empty messages
    if (!data || data.trim() === '') return;
    // AC-01.3 + AC-01.4: revised: broadcast to all authenticated clients with sender username
    const sender = userlist.get(socket.id);
    console.log(`Debug> "${sender}" sent: ${data}`);
    //io.emit('message', sender + ' says: ' + data.trim()); //old code in Lab 1 sent to all connected clients
    const message = sender + ' says: ' + data.trim();
    messengerdb.storePublicChat(sender, message);
    sendToAuthenticatedClients('message', message); // new code for Lab 2
  });
  socket.on('typing', () => {
    const username = userlist.get(socket.id);
    console.log(username + ' is typing ...');
    socket.broadcast.emit('typing', username + ' is typing ...');
  });
  // ---------------------------------------------------------------------------
  // Use-Case-02: Receive message — disconnect notification
  //
  // AC-02.2: all connected clients are notified when a user leaves
  // ---------------------------------------------------------------------------
  socket.on('disconnect', () => {
    const username = userlist.get(socket.id);
    userlist.delete(socket.id);
    console.log('Client disconnected - socket ID: ' + socket.id);
    //todo: code to broadcast the status
    if(username) sendToAuthenticatedClients('status', username + ' left the chat. Number of connected clients: ' + userlist.size);
  });

  // Use-Case-05: Register Account
  socket.on('register', async function({ username, password }) {
    if (!username || typeof username !== 'string' ||
        !password || typeof password !== 'string' ||
        username.trim().length === 0 || password.length === 0) { // AC-05.3
      socket.emit('register-error', 'Invalid request.'); // AC-05.8
      return;
    }
    username = username.trim();

    // AC-05.3: server independently re-validates format - client can be bypassed
    const usernamePattern = /^\w{3,20}$/;
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
    if (!usernamePattern.test(username)) {
      socket.emit('register-error', 'Username must be 3-20 characters (letters, numbers, underscore).');
      return; // AC-05.8
    }
    if (!passwordPattern.test(password)) {
      socket.emit('register-error', 'Password must be at least 6 characters with letters and numbers.');
      return; // AC-05.8
    }

    // Part II code
    let result;
    try {
      result = await messengerdb.register(username, password);
    } catch (err) {
      socket.emit('register-error', 'Server error. Please try again.'); // AC-05.8
      return;
    }

    if (!result.success) {
      socket.emit('register-error', result.message); // AC-05.8
      return;
    }
    socket.emit('register-success', username); // AC-05.7: send the 'register-success' event to the client
  });
  // Use-Case: Change Password - only logged in users can change their password
  socket.on('change-password', async function({ oldPassword, newPassword }) {
    if (!authorizeUser(socket)) {
      socket.emit('change-password-error', 'Please log in first.');
      return;
    }

    const username = userlist.get(socket.id);

    if (!oldPassword || typeof oldPassword !== 'string' ||
        !newPassword || typeof newPassword !== 'string') {
      socket.emit('change-password-error', 'Invalid request.');
      return;
    }

    let result;
    try {
      result = await messengerdb.changePassword(username, oldPassword, newPassword);
    } catch (err) {
      socket.emit('change-password-error', 'Server error. Please try again.');
      return;
    }

    if (!result.success) {
      socket.emit('change-password-error', result.message);
      return;
    }

    socket.emit('change-password-success');
  });
});

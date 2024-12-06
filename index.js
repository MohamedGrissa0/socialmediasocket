const io = require("socket.io")(9000, {
  cors: {
    origin: "http://localhost:3000", // Your frontend URL
  },
});

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) && users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  // Add user when they connect
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  // Handle user disconnection
  socket.on("disconnect", () => {
    removeUser(socket.id);
    io.emit("getUsers", users);
  });










  socket.on("callUser", ({ senderId, receiverId }) => {
    const user = getUser(receiverId);
    if (user) {
      io.to(user.socketId).emit("callReceived", { senderId });
    }
  });

  // Handle declining the call
  socket.on("callDeclined", ({ senderId, receiverId }) => {
    const user = getUser(senderId);
    if (user) {
      io.to(user.socketId).emit("callDeclined");
    }
  });

  // Handle accepting the call
  socket.on("callAccepted", ({ senderId, receiverId }) => {
    const user = getUser(senderId);
    if (user) {
      io.to(user.socketId).emit("callAccepted", { receiverId });
    }
  });



});

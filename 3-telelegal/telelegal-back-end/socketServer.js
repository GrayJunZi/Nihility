// 创建 socket 服务

const io = require("./server").io;

// 客户端已连接
io.on("connection", (socket) => {
  console.log(socket.id, "has connected");
});

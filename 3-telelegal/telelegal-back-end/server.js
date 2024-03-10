// 创建 express 与 socket.io 服务

const fs = require("fs");
const https = require("https");
const express = require("express");
const socketio = require("socket.io");
const app = express();
app.use(express.static(__dirname + "/public"));

const key = fs.readFileSync("./certs/cert.key");
const cert = fs.readFileSync("./certs/cert.crt");

const expressServer = https.createServer({ key, cert }, app);

const io = socketio(expressServer, {
  cors: [
    "https://localhost:3000",
    "https://localhost:3001",
    "https://localhost:3002",
  ],
});

expressServer.listen(9000, function (err) {
  if (err) console.error("TeleLegal Backend Starting Error:", err);
  else console.log("TeleLegal Backend Started on https://localhost:9000");
});

module.exports = { io, expressServer, app };

// 创建 socket 服务

const { io, app } = require("./server");

// const professionalAppointments = app.get("professionalAppointments");

const connectedProfessionals = [];

const allKnownOffers = [
  // uniqueId
  // offer
  // professionalsFullName
  // clientName
  // apptDate
  // offererIceCandidates
  // answer
  // answerIceCandidates
];

// 客户端已连接
io.on("connection", (socket) => {
  console.log(socket.id, "has connected");

  const fullName = socket.handshake.auth.fullName;

  connectedProfessionals.push({
    socketId: socket.id,
    fullName,
  });

  socket.on("newOffer", ({ offer, apptInfo }) => {
    allKnownOffers[apptInfo.uuid] = {
      ...apptInfo,
      offer,
      offerIceCandidates: [],
      answer: null,
      answerIceCandidates: [],
    };

    const p = connectedProfessionals.find(
      (x) => x.fullName === apptInfo.professionalsFullName
    );
    if (p) {
      const socketId = p.socketId;
      socket
        .to(socketId)
        .emit("newOfferWaiting", allKnownOffers[apptInfo.uuid]);
    }
  });
});

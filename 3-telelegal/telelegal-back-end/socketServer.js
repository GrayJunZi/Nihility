// 创建 socket 服务

const { io, app, linkSecret } = require("./server");
const jwt = require("jsonwebtoken");

// const professionalAppointments = app.get("professionalAppointments");

const connectedProfessionals = [];
const connectedClients = [];

const allKnownOffers = {
  // uniqueId
  // offer
  // professionalsFullName
  // clientName
  // apptDate
  // offererIceCandidates
  // answer
  // answerIceCandidates
};

// 客户端已连接
io.on("connection", (socket) => {
  console.log(socket.id, "has connected");

  const handshakeData = socket.handshake.auth.jwt;
  let decodedData;
  try {
    decodedData = jwt.verify(handshakeData, linkSecret);
  } catch (err) {
    console.log(err);
    socket.disconnect();
    return;
  }
  const { fullName, proId } = decodedData;
  if (proId) {
    const connectedPro = connectedProfessionals.find((x) => x.proId === proId);
    if (connectedPro) {
      connectedPro.socketId = socket.id;
    } else {
      connectedProfessionals.push({
        socketId: socket.id,
        fullName,
      });
    }

    const professionalAppointments = app.get("professionalAppointments");
    socket.emit(
      "apptData",
      professionalAppointments.filter(
        (x) => x.professionalsFullName === fullName
      )
    );

    for (const key in allKnownOffers) {
      const offer = allKnownOffers[key];
      if (offer.professionalsFullName === fullName) {
        io.to(socket.id).emit("newOfferWaiting", offer);
      }
    }
  } else {
    const { professionalsFullName, uuid, clientName } = decodedData;
    const clientExist = connectedClients.find((x) => x.uuid == uuid);
    if (clientExist) {
      clientExist.socketId = socket.id;
    } else {
      connectedClients.push({
        clientName,
        uuid,
        professionalMeetingWith: professionalsFullName,
      });
    }

    const offerForThisClient = allKnownOffers[uuid];
    if (offerForThisClient) {
      io.to(socket.id).emit("answerToClient", offerForThisClient.answer);
    }
  }

  socket.on("newAnswer", ({ answer, uuid }) => {
    console.log("-------------------------------NEW ANSWER");
    console.log(answer);
    console.log(uuid);

    const socketToSendTo = connectedClients.find((x) => x.uuid == uuid);
    if (socketToSendTo) {
      socket.to(socketToSendTo.socketId).emit("answerToClient", answer);
    }
    const knownOffer = allKnownOffers[uuid];
    if (knownOffer) {
      knownOffer.answer = answer;
    }
  });

  socket.on("newOffer", ({ offer, apptInfo }) => {
    allKnownOffers[apptInfo.uuid] = {
      ...apptInfo,
      offer,
      offerIceCandidates: [],
      answer: null,
      answerIceCandidates: [],
    };

    const professionalAppointments = app.get("professionalAppointments");
    const pa = professionalAppointments.find((x) => x.uuid === apptInfo.uuid);
    if (pa) {
      pa.waiting = true;
    }

    const p = connectedProfessionals.find(
      (x) => x.fullName === apptInfo.professionalsFullName
    );
    if (p) {
      const socketId = p.socketId;
      socket
        .to(socketId)
        .emit("newOfferWaiting", allKnownOffers[apptInfo.uuid]);

      socket.to(socketId).emit(
        "apptData",
        professionalAppointments.filter(
          (x) => x.professionalsFullName === apptInfo.professionalsFullName
        )
      );
    }
  });

  socket.on("getIce", (uuid, who, ackFunc) => {
    const offer = allKnownOffers[uuid];
    let iceCandidates = [];
    if (who === "professional") {
      iceCandidates = offer.offerIceCandidates;
    } else if (who === "client") {
      iceCandidates = offer.answerIceCandidates;
    }
    ackFunc(iceCandidates);
  });

  socket.on("iceToServer", ({ iceCandidate, who, uuid }) => {
    console.log(who, uuid, iceCandidate);
    const offerToUpdate = allKnownOffers[uuid];
    if (offerToUpdate) {
      if (who === "client") {
        console.log(offerToUpdate);
        offerToUpdate.offerIceCandidates.push(iceCandidate);
        const socketToSendTo = connectedProfessionals.find(
          (x) => x.fullName === decodedData.professionalsFullName
        );
        if (socketToSendTo) {
          socket.to(socketToSendTo.socketId).emit("iceToClient", iceCandidate);
        }
      } else if (who === "professional") {
        offerToUpdate.answerIceCandidates.push(iceCandidate);
        const socketToSendTo = connectedClients.find((x) => x.uuid == uuid);
        if (socketToSendTo) {
          socket.to(socketToSendTo.socketId).emit("iceToClient", iceCandidate);
        }
      }
    }
  });
});

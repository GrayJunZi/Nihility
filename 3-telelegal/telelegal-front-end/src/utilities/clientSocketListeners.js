import updateCallStatus from "../redux/actions/updateCallStatus";

const clientSocketListeners = (socket, dispatch, addIceCandidateToPc) => {
  socket.on("answerToCLient", (answer) => {
    dispatch(updateCallStatus("answer", answer));
    dispatch(updateCallStatus("myRole", "offerer"));
  });

  socket.on("iceToClient", (iceCandidate) => {
    addIceCandidateToPc(iceCandidate);
  });
};

export default clientSocketListeners;

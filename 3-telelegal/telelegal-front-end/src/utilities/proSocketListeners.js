import updateCallStatus from "../redux/actions/updateCallStatus";
const proDashboardSocketListeners = (socket, setApptInfo, dispatch) => {
  socket.on("apptData", (apptData) => {
    setApptInfo(apptData);
  });

  socket.on("newOfferWaiting", (offerData) => {
    dispatch(updateCallStatus("offer", offerData.offer));
    dispatch(updateCallStatus("myRole", "answerer"));
  });
};

const proVideoSocketListeners = (socket, addIceCandidateToPc) => {
  socket.on("iceToClient", (iceCandidate) => {
    addIceCandidateToPc(iceCandidate);
  });
};

export default { proDashboardSocketListeners, proVideoSocketListeners };

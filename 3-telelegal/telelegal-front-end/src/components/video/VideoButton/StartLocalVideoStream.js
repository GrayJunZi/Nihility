import updateCallStatus from "../../../redux/actions/updateCallStatus";

const startLocalVideoStream = (streams, dispatch) => {
  const localStream = streams.localStream;
  for (const s in streams) {
    if (s !== "localStream") {
      const currentStream = streams[s];
      localStream.stream.getVideoTracks().forEach((x) => {
        currentStream.peerConnection.addTrack(x, streams.localStream.stream);
      });
      dispatch(updateCallStatus("video", "enabled"));
    }
  }
};

export default startLocalVideoStream;

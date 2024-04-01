const startAudioStream = (streams, dispatch) => {
  const localStream = streams.localStream;
  for (const s in streams) {
    if (s !== "localStream") {
      const currentStream = streams[s];
      localStream.stream.getAudioTracks().forEach((x) => {
        currentStream.peerConnection.addTrack(x, streams.localStream.stream);
      });
    }
  }
};

export default startAudioStream;

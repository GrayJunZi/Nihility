import peerConfiguration from "./stunServer";

const createPeerConnection = (addIce) => {
  return new Promise(async (resolve, reject) => {
    const peerConnection = await new RTCPeerConnection(peerConfiguration);
    const remoteStream = new MediaStream();
    peerConnection.addEventListener("signalingstatechange", (e) => {
      console.log("Signaling State Change");
      console.log(e);
    });

    peerConnection.addEventListener("icecandidate", (e) => {
      console.log("Found ice candidate ...");
      if (e.candidate) {
        addIce(e.candidate);
      }
    });

    resolve({
      peerConnection,
      remoteStream,
    });
  });
};

export default createPeerConnection;

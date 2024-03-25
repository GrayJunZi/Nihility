const getDevices = () => {
  return new Promise(async (resolve, reject) => {
    const devices = await navigator.mediaDevices.enumerateDevices();

    const videoDevices = devices.filter((x) => x.kind === "videoinput");
    const audioDevices = devices.filter((x) => x.kind === "audioinput");
    const audioOutputDevices = devices.filter((x) => x.kind === "audiooutput");
    resolve({
      videoDevices,
      audioDevices,
      audioOutputDevices,
    });
  });
};

export default getDevices;

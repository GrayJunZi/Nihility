const supportedConstraints = navigator.mediaDevices.getSupportedConstraints();

const changeVideoSize = () => {
  stream.getVideoTracks().forEach((track) => {
    // const vConstraints = {
    //   height: 500,
    //   width: 500,
    //   frameRate: 5,
    //   aspectRatio: 10,
    // };

    const capabilities = track.getCapabilities();
    const height = document.querySelector("#vid-height").value;
    const width = document.querySelector("#vid-width").value;
    const vConstraints = {
      height: {
        exact:
          height < capabilities.height.max ? height : capabilities.height.max,
      },
      width: {
        exact: width < capabilities.width.max ? width : capabilities.width.max,
      },
    };
    track.applyConstraints(vConstraints);
  });
  // stream.getTracks().forEach((track) => {
  //   const capabilities = track.getCapabilities();
  //   console.log(capabilities);
  // });
};

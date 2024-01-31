const $audioInput = document.querySelector("#audio-input");
const $audioOutput = document.querySelector("#audio-output");
const $videoInput = document.querySelector("#video-input");

const getDevices = async () => {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    devices.forEach((d) => {
      const option = document.createElement("option");
      option.value = d.deviceId;
      option.text = d.label;
      if (d.kind === "audioinput") {
        $audioInput.appendChild(option);
      } else if (d.kind === "audiooutput") {
        $audioOutput.appendChild(option);
      } else if (d.kind === "videoinput") {
        $videoInput.appendChild(option);
      }
    });
  } catch (err) {
    console.log(err);
  }
};

const changeAudioInput = async (e) => {
  const deviceId = e.target.value;
  const constraints = {
    audio: { deviceId: { exact: deviceId } },
    video: true,
  };
  try {
    stream = await navigator.mediaDevices.getUserMedia(constraints);
    console.log(stream);

    const tracks = stream.getTracks();
    console.log(tracks);
  } catch (err) {
    console.log(err);
  }
};

const changeAudioOutput = async (e) => {
  await $video.setSinkId(e.target.value);
  console.log("Changed audio decice!");
};

const changeVideo = async (e) => {
  const deviceId = e.target.value;
  const constraints = {
    audio: true,
    video: { deviceId: { exact: deviceId } },
  };
  try {
    stream = await navigator.mediaDevices.getUserMedia(constraints);
    console.log(stream);

    const tracks = stream.getTracks();
    console.log(tracks);
  } catch (err) {
    console.log(err);
  }
};

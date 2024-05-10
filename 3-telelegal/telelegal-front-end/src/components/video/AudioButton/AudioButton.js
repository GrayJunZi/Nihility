import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ActionButtonCaretDropdown from "../ActionButtonCaretDropdown";
import getDevices from "../../../utilities/getDevices";
import updateCallStatus from "../../../redux/actions/updateCallStatus";
import addStream from "../../../redux/actions/addStream";
import startAudioStream from "./StartAudioStream";

const AudioButton = ({ smallFeedElement }) => {
  const dispatch = useDispatch();
  const callStatus = useSelector((state) => state.callStatus);
  const streams = useSelector((state) => state.streams);
  const [caretOpen, setCaretOpen] = useState(false);
  const [audioDeviceList, setAudioDeviceList] = useState([]);

  let micText;
  if (callStatus.audio === "off") {
    micText = "Join Audio";
  } else if (callStatus.audio === "enabled") {
    micText = "Mute";
  } else {
    micText = "Unmute";
  }

  const changeAudioDevice = async (e) => {
    // 获取设备ID
    const deviceId = e.target.value.slice(5);
    const audioType = e.target.value.slice(0, 5);
    // 获取用户媒体
    if (audioType === "output") {
      smallFeedElement.current.setSinkId(deviceId);
    } else if (audioType === "input") {
      const newConstraints = {
        audio: { deviceId: { exact: deviceId } },
        video:
          callStatus.videoDevice === "default"
            ? true
            : { deviceId: { exact: callStatus.videoDevice } },
      };
      const stream = await navigator.mediaDevices.getUserMedia(newConstraints);
      // 更新 Redux 中的 audioDevice
      dispatch(updateCallStatus("audioDevice", deviceId));
      dispatch(updateCallStatus("audio", "enabled"));
      // 更新 streams 中的 localStream
      dispatch(addStream("localStream", stream));
      // 添加轨道
      const [audioTrack] = stream.getVideoTracks();

      for (const s in streams) {
        if (s !== "localStream") {
          const senders = streams[s].peerConnection.getSenders();
          const sender = senders.find(
            (x) => x.track && x.track.kind === audioTrack.kind
          );
          sender.replaceTrack(audioTrack);
        }
      }
    }
  };

  useEffect(() => {
    const getDevicesAsync = async () => {
      if (caretOpen) {
        const { audioDevices, audioOutputDevices } = await getDevices();
        setAudioDeviceList(audioDevices.concat(audioOutputDevices));
      }
    };
    getDevicesAsync();
  }, [caretOpen]);

  const startStopAudio = () => {
    if (callStatus.audio === "enabled") {
      dispatch(updateCallStatus("audio", "disabled"));
      streams.localStream.stream
        .getAudioTracks()
        .forEach((x) => (x.enabled = false));
    } else if (callStatus.audio === "disabled") {
      dispatch(updateCallStatus("audio", "enalbed"));
      streams.localStream.stream
        .getAudioTracks()
        .forEach((x) => (x.enabled = true));
    } else {
      changeAudioDevice({
        target: {
          value: "inputdefault",
        },
      });

      startAudioStream(streams);
    }
  };

  return (
    <div className="button-wrapper d-inline-block">
      <i
        className="fa fa-caret-up choose-audio"
        onClick={() => setCaretOpen(!caretOpen)}
      ></i>
      <div className="button mic" onClick={startStopAudio}>
        <i className="fa fa-microphone"></i>
        <div className="btn-text">{micText}</div>
      </div>{" "}
      {caretOpen ? (
        <ActionButtonCaretDropdown
          defaultValue={callStatus.audioDevice}
          onChange={changeAudioDevice}
          deviceList={audioDeviceList}
          type={"audio"}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default AudioButton;

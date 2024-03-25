import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import startLocalVideoStream from "./StartLocalVideoStream";
import updateCallStatus from "../../../redux/actions/updateCallStatus";
import getDevices from "../../../utilities/getDevices";
import addStream from "../../../redux/actions/addStream";
import ActionButtonCaretDropdown from "../ActionButtonCaretDropdown";

const VideoButton = ({ smallFeedElement }) => {
  const callStatus = useSelector((state) => state.callStatus);
  const streams = useSelector((state) => state.streams);
  const [pendingUpdate, setPendingUpdate] = useState(false);
  const dispatch = useDispatch();
  const [caretOpen, setCaretOpen] = useState(false);
  const [videoDeviceList, setVideoDeviceList] = useState([]);

  const changeVideoDevice = async (e) => {
    // 获取设备ID
    const deviceId = e.target.value;
    // 获取用户媒体
    const newConstraints = {
      audio:
        callStatus.audioDevice === "default"
          ? true
          : { deviceId: { exact: callStatus.audioDevice } },
      video: { deviceId: { exact: deviceId } },
    };
    const stream = await navigator.mediaDevices.getUserMedia(newConstraints);
    // 更新 Redux 中的 videoDevice
    dispatch(updateCallStatus("videoDevice", deviceId));
    dispatch(updateCallStatus("video", "enabled"));
    // 更新视频元素
    smallFeedElement.current.srcObject = stream;
    // 更新 streams 中的 localStream
    dispatch(addStream("localStream", stream));
    // 添加轨道
    const tracks = stream.getVideoTracks();
  };

  useEffect(() => {
    const getDevicesAsync = async () => {
      if (caretOpen) {
        const { videoDevices } = await getDevices();
        setVideoDeviceList(videoDevices);
      }
    };
    getDevicesAsync();
  }, [caretOpen]);

  const startStopVideo = () => {
    if (callStatus.video === "enabled") {
      dispatch(updateCallStatus("video", "disabled"));
      streams.localStream.stream
        .getVideoTracks()
        .forEach((x) => (x.enabled = false));
    } else if (callStatus.video === "disabled") {
      dispatch(updateCallStatus("video", "enabled"));
      streams.localStream.stream
        .getVideoTracks()
        .forEach((x) => (x.enabled = true));
    } else if (callStatus.haveMedia) {
      smallFeedElement.current.srcObject = streams["localStream"].stream;
      startLocalVideoStream(streams, dispatch);
    } else {
      setPendingUpdate(true);
    }
  };

  useEffect(() => {
    if (pendingUpdate && callStatus.haveMedia) {
      console.log("Pending update successed!");
      setPendingUpdate(false);
      smallFeedElement.current.srcObject = streams["localStream"].stream;
      startLocalVideoStream(streams, dispatch);
    }
  }, [
    pendingUpdate,
    callStatus.haveMedia,
    smallFeedElement,
    streams,
    dispatch,
  ]);

  return (
    <div className="button-wrapper video-button d-inline-block">
      <i
        className="fa fa-caret-up choose-video"
        onClick={() => setCaretOpen(!caretOpen)}
      ></i>
      <div className="button camera" onClick={startStopVideo}>
        <i className="fa fa-video"></i>
        <div className="btn-text">
          {callStatus.video === "enabled" ? "Stop" : "Start"} Video
        </div>
      </div>
      {caretOpen ? (
        <ActionButtonCaretDropdown
          defaultValue={callStatus.videoDevice}
          onChange={changeVideoDevice}
          deviceList={videoDeviceList}
          type={"video"}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default VideoButton;

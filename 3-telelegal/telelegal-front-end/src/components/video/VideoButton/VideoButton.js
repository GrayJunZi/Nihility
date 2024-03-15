import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import startLocalVideoStream from "./StartLocalVideoStream";
import updateCallStatus from "../../../redux/actions/updateCallStatus";

const VideoButton = ({ smallFeedElement }) => {
  const callStatus = useSelector((state) => state.callStatus);
  const streams = useSelector((state) => state.streams);
  const [pendingUpdate, setPendingUpdate] = useState(false);
  const dispatch = useDispatch();

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
    }
  }, [pendingUpdate, callStatus.haveMedia, smallFeedElement, streams]);

  return (
    <div className="button-wrapper video-button d-inline-block">
      <i className="fa fa-caret-up choose-video"></i>
      <div className="button camera" onClick={startStopVideo}>
        <i className="fa fa-video"></i>
        <div className="btn-text">
          {callStatus.video === "enabled" ? "Stop" : "Start"} Video
        </div>
      </div>
    </div>
  );
};

export default VideoButton;

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

import "./video.css";

import CallInfo from "./CallInfo";
import ChatWindow from "./ChatWindow";
import ActionButtons from "./ActionButtons";
import addStream from "../../redux/actions/addStream";
import { useDispatch, useSelector } from "react-redux";
import createPeerConnection from "../../utilities/creeatePeerConnection";
import updateCallStatus from "../../redux/actions/updateCallStatus";
import socket from "../../utilities/socketConnection";

const MainVideoPage = () => {
  const dispatch = useDispatch();
  const callStatus = useSelector((state) => state.callStatus);
  const streams = useSelector((state) => state.streams);
  const [searchParams, setSearchParams] = useSearchParams();
  const [apptInfo, setApptInfo] = useState({});
  const smallFeedElement = useRef(null);
  const largeFeedElement = useRef(null);

  useEffect(() => {
    // 获取用户媒体
    const fetchMedia = async () => {
      const constraints = {
        video: true,
        audio: true,
      };
      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        dispatch(updateCallStatus("haveMedia", true));

        dispatch(addStream("localStream", stream));

        // 建立对等连接
        const { peerConnection, remoteStream } = await createPeerConnection();
        dispatch(addStream("remote1", remoteStream, peerConnection));
      } catch (err) {
        console.log(err);
      }
    };
    fetchMedia();
  }, [dispatch]);

  useEffect(() => {
    const createOfferAsync = async () => {
      for (const s in streams) {
        if (s !== "localStream") {
          try {
            const pc = streams[s].peerConnection;
            const offer = await pc.createOffer();
            socket.emit("newOffer", { offer, apptInfo });
          } catch (err) {
            console.log(err);
          }
        }
      }
      dispatch(updateCallStatus("haveCreatedOffer", true));
    };
    if (
      callStatus.audio === "enabled" &&
      callStatus.video === "enabled" &&
      !callStatus.haveCreatedOffer
    ) {
      createOfferAsync();
    }
  }, [callStatus.audio, callStatus.video, callStatus.haveCreatedOffer]);

  useEffect(() => {
    // 从URL的 Query String 中获取Token内容
    const token = searchParams.get("token");
    const fetchDecodedToken = async () => {
      const resp = await axios.post("https://localhost:9000/validate-link", {
        token,
      });
      const data = resp.data;
      console.log(data);
      setApptInfo(data);
    };

    fetchDecodedToken();
  }, [searchParams]);

  return (
    <div className="main-video-page">
      <div className="video-chat-wrapper">
        <video
          id="large-feed"
          ref={largeFeedElement}
          autoPlay
          controls
          playsInline
        ></video>
        <video
          id="own-feed"
          ref={smallFeedElement}
          autoPlay
          controls
          playsInline
        ></video>
        {apptInfo.professionalsFullName ? (
          <CallInfo apptInfo={apptInfo} />
        ) : (
          <></>
        )}
        <ChatWindow />
      </div>
      <ActionButtons smallFeedElement={smallFeedElement} />
    </div>
  );
};

export default MainVideoPage;

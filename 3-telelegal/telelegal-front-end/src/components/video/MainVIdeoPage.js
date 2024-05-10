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
import socketConnection from "../../utilities/socketConnection";
import clientSocketListeners from "../../utilities/clientSocketListeners";

const MainVideoPage = () => {
  const dispatch = useDispatch();
  const callStatus = useSelector((state) => state.callStatus);
  const streams = useSelector((state) => state.streams);
  const [searchParams, setSearchParams] = useSearchParams();
  const [apptInfo, setApptInfo] = useState({});
  const smallFeedElement = useRef(null);
  const largeFeedElement = useRef(null);
  const uuidRef = useRef(null);
  const streamsRef = useRef(null);
  const [showCallInfo, setShowCallInfo] = useState(true);

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
        const { peerConnection, remoteStream } = await createPeerConnection(
          addIce
        );
        dispatch(addStream("remote1", remoteStream, peerConnection));

        largeFeedElement.current.srcObject = remoteStream;
      } catch (err) {
        console.log(err);
      }
    };
    fetchMedia();
  }, [dispatch]);

  useEffect(() => {
    if (streams.remote1) {
      streamsRef.current = streams;
    }
  }, [streams]);

  useEffect(() => {
    const createOfferAsync = async () => {
      for (const s in streams) {
        if (s !== "localStream") {
          try {
            const pc = streams[s].peerConnection;
            const offer = await pc.createOffer();
            pc.setLocalDescription(offer);
            const token = searchParams.get("token");
            const socket = socketConnection(token);
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
  }, [
    callStatus.audio,
    callStatus.video,
    callStatus.haveCreatedOffer,
    apptInfo,
    dispatch,
    streams,
    searchParams,
  ]);

  useEffect(() => {
    const addAnswerAsync = async () => {
      for (const s in streams) {
        if (s !== "localStream") {
          const pc = streams[s].peerConnection;
          await pc.setRemoteDescription(callStatus.answer);
        }
      }
    };
    if (callStatus.answer) {
      addAnswerAsync();
    }
  }, [streams, callStatus]);

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
      uuidRef.current = resp.data.uuid;
    };

    fetchDecodedToken();
  }, [searchParams]);

  useEffect(() => {
    const token = searchParams.get("token");
    const socket = socketConnection(token);
    clientSocketListeners(socket, dispatch, addIceCandidateToPc);
  }, [searchParams]);

  const addIceCandidateToPc = (iceCandidate) => {
    for (const s in streamsRef.current) {
      if (s !== "localStream") {
        const pc = streams[s].peerConnection;
        pc.addIceCandidate(iceCandidate);
        console.log("Added an iceCandidate to existing page presence");

        setShowCallInfo(false);
      }
    }
  };

  const addIce = (iceCandidate) => {
    const socket = socketConnection(searchParams.get("token"));
    socket.emit("iceToServer", {
      iceCandidate,
      who: "client",
      uuid: uuidRef.current,
    });
  };

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
        {showCallInfo ? <CallInfo apptInfo={apptInfo} /> : <></>}
        <ChatWindow />
      </div>
      <ActionButtons
        smallFeedElement={smallFeedElement}
        largeFeedElement={largeFeedElement}
      />
    </div>
  );
};

export default MainVideoPage;

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
import proSocketListeners from "../../utilities/proSocketListeners";

const ProMainVideoPage = () => {
  const dispatch = useDispatch();
  const callStatus = useSelector((state) => state.callStatus);
  const streams = useSelector((state) => state.streams);
  const [searchParams, setSearchParams] = useSearchParams();
  const [apptInfo, setApptInfo] = useState({});
  const smallFeedElement = useRef(null);
  const largeFeedElement = useRef(null);
  const [haveGottenIce, setHaveGottenIce] = useState(false);
  const streamsRef = useRef(null);

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
      } catch (err) {
        console.log(err);
      }
    };
    fetchMedia();
  }, [dispatch]);

  useEffect(() => {
    const getIceAsync = async () => {
      const socket = socketConnection(searchParams.get("token"));
      const uuid = searchParams.get("uuid");
      const iceCandidates = await socket.emitWithAck(
        "getIce",
        uuid,
        "professional"
      );
      console.log(iceCandidates);
      iceCandidates.forEach((iceCandidate) => {
        for (const s in streams) {
          if (s !== "localStream") {
            const pc = streams[s].peerConnection;
            pc.addIceCandidate(iceCandidate);
            console.log("=========== Add Ice Candidate ===========");
          }
        }
      });
    };

    if (streams.remote1 && !haveGottenIce) {
      setHaveGottenIce(true);
      getIceAsync();
      streamsRef.current = streams;
    }
  }, [searchParams, streams, haveGottenIce]);

  useEffect(() => {
    const setAsyncOffer = async () => {
      for (const s in streams) {
        if (s !== "localStream") {
          const pc = streams[s].peerConnection;
          await pc.setRemoteDescription(callStatus.offer);
          console.log(pc.signalingState);
        }
      }
    };

    if (callStatus.offer && streams.remote1 && streams.remote1.peerConnection) {
      setAsyncOffer();
    }
  }, [callStatus.offer, streams]);

  useEffect(() => {
    const createAnswerAsync = async () => {
      for (const s in streams) {
        if (s !== "localStream") {
          const pc = streams[s].peerConnection;
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          console.log(pc.signalingState);

          dispatch(updateCallStatus("haveCreatedAnswer", true));
          dispatch(updateCallStatus("answer", answer));
          const uuid = searchParams.get("uuid");
          const token = searchParams.get("token");
          const socket = socketConnection(token);
          socket.emit("newAnswer", { answer, uuid });
        }
      }
    };
    if (
      callStatus.audio === "enabled" &&
      callStatus.video === "enabled" &&
      !callStatus.haveCreatedAnswer
    ) {
      createAnswerAsync();
    }
  }, [
    callStatus.audio,
    callStatus.video,
    callStatus.haveCreatedAnswer,
    dispatch,
    searchParams,
    streams,
  ]);

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

  useEffect(() => {
    const token = searchParams.get("token");
    const socket = socketConnection(token);
    proSocketListeners.proVideoSocketListeners(socket, addIceCandidateToPc);
  }, [searchParams]);

  const addIceCandidateToPc = (iceCandidate) => {
    for (const s in streamsRef.current) {
      if (s !== "localStream") {
        const pc = streams[s].peerConnection;
        pc.addIceCandidate(iceCandidate);
        console.log("Added an iceCandidate to existing page presence");
      }
    }
  };

  const addIce = (iceCandidate) => {
    const socket = socketConnection(searchParams.get("token"));
    socket.emit("iceToServer", {
      iceCandidate,
      who: "professional",
      uuid: searchParams.get("uuid"),
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
        {callStatus.audio === "enabled" && callStatus.video === "off" ? (
          <div className="call-info">
            <h1>
              {searchParams.get("client")} is in the waiting room. <br />
              Call will start when video and audio are enabled
            </h1>
          </div>
        ) : (
          <></>
        )}
        <ChatWindow />
      </div>
      <ActionButtons smallFeedElement={smallFeedElement} />
    </div>
  );
};

export default ProMainVideoPage;

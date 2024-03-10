# Nihility

## Mastering webRTC - real-Time video and screen-share

Working w/MediaStreams, the mic, camera, & screen. Connecting the browsers - PeerConnection & Signaling, w/React

## 一、WebRTC 介绍

课程源仓库地址 [webrtcCourse](https://github.com/robertbunch/webrtcCourse)

### 什么是 WebRTC？

WebRTC 全称为 `Web Real-Time Communication`，是一种支持 Web 应用程序实时通信的技术，浏览器可以捕获以及可选地流式音频和视频媒体，以及在浏览器之间交换任意数据而无需中间人(intermediary)。

RTC 是基于 UPD 连接的，它很快但不稳定。与 TCP 不同，http 和 websocket 就是基于 TCP 连接的。

### 为什么使用 WebRTC？

## 二、基础项目

Project - getUserMedia playground - (lame) project that teaches you the basics

### 修改视频大小

```js
const constraints = {
  audio: true,
  video: true,
};
let stream = await navigator.mediaDevices.getUserMedia(constraints);

const changeVideoSize = () => {
  stream.getVideoTracks().forEach((track) => {
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
};
```

### 视频流录制

```js
let mediaRecorder;
let recordedBlobs;

// 开始录制
const startRecording = () => {
  recordedBlobs = [];
  mediaRecorder = new MediaRecorder(stream);
  mediaRecorder.ondataavailable = (e) => {
    console.log("Data is available for the media recorder!");
    recordedBlobs.push(e.data);
  };
  mediaRecorder.start();
};

// 停止录制
const stopRecording = () => {
  console.log("stop recording...");
  mediaRecorder.stop();
};

// 播放录制内容
const playRecording = () => {
  console.log("play recording...");
  const superBuffer = new Blob(recordedBlobs);
  const $otherVideo = document.querySelector("#other-video");
  $otherVideo.src = window.URL.createObjectURL(superBuffer);
  $otherVideo.controls = true;
  $otherVideo.play();
};
```

### 共享屏幕

```js
const shareScreen = async () => {
  const options = {
    video: true,
    audio: false,
    surfaceSwitching: "include",
  };
  try {
    mediaStream = await navigator.mediaDevices.getDisplayMedia(options);
  } catch (err) {
    console.log(err);
  }
};
```

### 获取设备信息

由于权限问题，获取设备信息不能为本地，必须是安全的，通过`https://`或`wss://`提供服务。

创建 `package.json` 文件

```bash
npm init -y
```

安装 `express`

```bash
npm install express
```

获取设备信息

```js
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
```

## 三、WebRTC 对等连接

rtcPeerConnection - Stream video, peer to peer

### SDP

SDP是`Session Description Protocol`的缩写，它是一个描述连接的多媒体内容的标准，例如分辨率格式、编码器、加密等。

### ICE

ICE是`Interactive Connectivity Establishment`的缩写，它是一个框架允许浏览器进行对等连接。有很多原因导致对等点a到对等点b的直接连接是行不通的，

### NAT

NAT是`Network Address Translation`的缩写，用来给你的设备提供公共IP地址。

### STUN

STUN是`Session Traversal Utilities for NAT`的缩写，它是一种发现您的公共IP地址的协议，判断出路由器阻止直连的限制方法的协议。客户端通过给公网的`STUN`服务器发送请求获得自己的公网地址信息，以及是否能够被访问。

### 创建信令服务(Signaling)

安装 socket.io
```bash
npm install socket.io
```

安装mkcert
```bash
npm install -g mkcert
```

使用mkcert创建免费证书
```bash
mkcert create-ca
mkcert create-cert
```

## 四、使用 WebRTC 和 React 开发 TeleLegal 项目

webrtc and react - a TeleLegal site

## 五、部署

const initState = {
  current: "idle",
  video: "off", // "off", "enabled", "disabled", "complete "
  audio: "off",
  audioDevice: "default",
  videoDevice: "default",
  shareScreen: false,
  haveMedia: false,
};

const callStatusReducer = (state = initState, action) => {
  if (action.type === "UPDATE_CALL_STATUS") {
    const copyStatus = { ...state };
    copyStatus[action.payload.prop] = action.payload.value;
    console.log(copyStatus.video);
    return copyStatus;
  } else if (action.type === "LOGOUT_ACTION" || action.type === "NEW_VERSION") {
    return initState;
  } else {
    return state;
  }
};

export default callStatusReducer;

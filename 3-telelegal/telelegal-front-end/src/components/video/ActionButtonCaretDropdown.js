const ActionButtonCaretDropdown = ({
  defaultValue,
  onChange,
  deviceList,
  type,
}) => {
  let dropdownElement;
  if (type === "video") {
    dropdownElement = deviceList.map((x) => (
      <option key={x.deviceId} value={x.deviceId}>
        {x.label}
      </option>
    ));
  } else if (type === "audio") {
    const audioInputElement = [];
    const audioOutputElement = [];
    deviceList.forEach((x) => {
      if (x.kind === "audioinput") {
        audioInputElement.push(
          <option key={`input-${x.deviceId}`} value={`input-${x.deviceId}`}>
            {x.label}
          </option>
        );
      } else if (x.kind === "audiooutput") {
        audioOutputElement.push(
          <option key={`outpu-${x.deviceId}`} value={`outpu-${x.deviceId}`}>
            {x.label}
          </option>
        );
      }
    });
    audioInputElement.unshift(<optgroup label="Input Devices"></optgroup>);
    audioOutputElement.unshift(<optgroup label="Output Devices"></optgroup>);
    dropdownElement = audioInputElement.concat(audioOutputElement);
  }

  return (
    <div className="caret-dropdown" style={{ top: "-25px" }}>
      <select defaultValue={defaultValue} onChange={onChange}>
        {dropdownElement}
      </select>
    </div>
  );
};

export default ActionButtonCaretDropdown;

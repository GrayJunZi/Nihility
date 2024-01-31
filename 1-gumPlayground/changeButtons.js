const buttonsById = [
  "share",
  "show-video",
  "stop-video",
  "change-size",
  "start-record",
  "stop-record",
  "play-record",
  "share-screen",
];

const colorTypes = {
  green: "btn-success",
  blue: "btn-primary",
  grey: "btn-secondary",
  red: "btn-danger",
};

const $buttons = buttonsById.map((buttonId) =>
  document.getElementById(buttonId)
);

const changeButtons = (colors) => {
  colors.forEach((color, i) => {
    Object.values(colorTypes).forEach((x) => $buttons[i].classList.remove(x));
    $buttons[i].classList.add(colorTypes[color]);
  });
};

// 创建 路由

const { app, linkSecret } = require("./server");
const jwt = require("jsonwebtoken");
const frontEnd = "https://localhost:3000";
const { v4: uuidv4 } = require("uuid");

const professionalAppointments = [
  {
    professionalsFullName: "Peter Chan, J.D.",
    apptData: Date.now() + 500000,
    uuid: 1,
    clientName: "Jim Jones",
  },
  {
    professionalsFullName: "Peter Chan, J.D.",
    apptData: Date.now() + 500000,
    uuid: 2,
    clientName: "Akash Patel",
  },
  {
    professionalsFullName: "Peter Chan, J.D.",
    apptData: Date.now() + 500000,
    uuid: 3,
    clientName: "Mike Wulliams",
  },
];

app.set("professionalAppointments", professionalAppointments);

app.get("/user-link", (req, res) => {
  // 用户数据
  const apptData = professionalAppointments[0];

  const token = jwt.sign(apptData, linkSecret);
  res.send(`${frontEnd}/join-video?token=${token}`);
});

app.post("/validate-link", (req, res) => {
  const token = req.body.token;
  const decodedData = jwt.verify(token, linkSecret);

  res.json(decodedData);
});

app.get("/pro-link", (req, res) => {
  const userData = {
    fullName: "Peter Chan, J.D.",
    proId: 123,
  };
  const token = jwt.sign(userData, linkSecret);
  res.send(
    `<a href="${frontEnd}/dashboard?token=${token}" target="_blank">Link Here</a>`
  );
});

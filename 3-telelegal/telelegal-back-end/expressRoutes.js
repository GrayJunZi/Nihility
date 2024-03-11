// 创建 路由

const app = require("./server").app;
const jwt = require("jsonwebtoken");
const linkSecret = "vnialkasdfjlkafgoituaslkdj";
const frontEnd = "https://localhost:3000";

app.get("/user-link", (req, res) => {
  //
  const apptData = {
    professionalsFullName: "Robot, J.D.",
    apptDate: Date.now(),
  };

  const token = jwt.sign(apptData, linkSecret);
  res.send(`${frontEnd}/join-video?token=${token}`);
});

app.post("/validate-link", (req, res) => {
  const token = req.body.token;
  const decodedData = jwt.verify(token, linkSecret);
  
  res.json(decodedData);
});

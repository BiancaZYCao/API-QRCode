const express = require("express");
const path = require("path");
const app = express();
const { v4: uuidv4 } = require("uuid");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "/public")));

const qrRouter = require("./routers/qrRouter");
app.use("/qr", qrRouter);

app.get("/", (req, res) => {
  res.send("Homepage");
});

app.listen(3000, () => {
  console.log("server for lab05 is running at port 3000.");
});

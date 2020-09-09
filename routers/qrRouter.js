const express = require("express");
const qrRouter = express.Router();
let data = require("../data");
const qr = require("qr-image");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const getRespType = (type) => {
  if (type == "svg") {
    return "svg";
  } else if (type == "pdf") {
    return "application/pdf";
  }
  return "image/png";
};

/* default QR-code Hard Code as www.google.com png file */
qrRouter.route("/").get((req, res) => {
  try {
    const code = qr.imageSync("www.google.com", { type: "png" });
    const filePath = path.join(__dirname, `qr.png`);
    fs.writeFileSync(filePath, code);
    res.sendFile(filePath);
  } catch (err) {
    return res.status(500).send(err);
  }
});

/* Synchronous Mode */
qrRouter.route("/:data").get((req, res) => {
  try {
    let options = { type: "png", ...req.query };
    const code = qr.imageSync(req.params.data, options);
    const filePath = path.join(
      __dirname,
      "images",
      uuidv4() + "." + options.type
    );
    console.log(filePath);
    fs.writeFileSync(filePath, code);
    let restype = getRespType(options.type);
    res.type(restype);
    res.sendFile(filePath);
  } catch (err) {
    console.log(err.stack);
    return res.status(500).send(err);
  }
});

/* async mode */
qrRouter.get("/async/:data", async (req, res) => {
  try {
    let options = { type: "png", ...req.query };
    const code = await qr.image(req.params.data, options);
    let restype = getRespType(options.type);
    res.type(restype);
    code.pipe(res);
  } catch (err) {
    console.log(err.stack);
    res.status(500).send(err);
  }
});

/* POST with complex data */
qrRouter.route("/").post(async (req, res) => {
  try {
    let content = JSON.stringify(req.body);
    let options = { type: "png", ...req.query };
    const code = await qr.image(content, options);
    let restype = getRespType(options.type);
    res.type(restype);
    code.pipe(res);
  } catch (err) {
    console.log(err.stack);
    res.status(500).send(err);
  }
  //res.send("This will be a png serving post method.");
});

module.exports = qrRouter;

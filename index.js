const cors = require("cors");
const express = require("express");
const wppconnect = require("@wppconnect-team/wppconnect");
const { Message } = require("./modules/message");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));
app.use(cors());
app.use(express.json());

let client = null;

app.get("/", (req, res) => {
  if (client && client.isLogged) {
    return res.status(200).json({ message: "Anda telah terhubung ke WhatsApp" });
  }

  wppconnect
    .create({
      session: "swu-token",
      headless: true,
      puppeteerOptions: {
        args: ["--no-sandbox"],
      },
      disableWelcome: true,
      autoClose: 60000,
      catchQR: (base64Qr, asciiQR) => {
        res.setHeader("Content-Type", "text/html");
        res.send(`<img src="${base64Qr}" alt="WhatsApp QR Code">`);
      },
      logQR: false,
      statusFind: (statusSession, session) => {
        //return isLogged || notLogged || browserClose || qrReadSuccess || qrReadFail || autocloseCalled || desconnectedMobile || deleteToken

        if (statusSession === "isLogged") {
          return res.status(200).json({ message: "Anda telah terhubung ke WhatsApp" });
        }
      },
    })
    .then((_client) => {
      client = _client;
      start(client);
    })
    .catch((error) => {
      console.log(error);
    });
});

function start(client) {
  client.onMessage(async (message) => {
    if (message.from != "status@broadcast") {
      try {
        await Message(client, message);
      } catch (error) {
        console.error(error);
        return error;
      }
    }
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

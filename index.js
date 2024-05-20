const cors = require("cors");
const express = require("express");
const session = require("express-session");
const wppconnect = require("@wppconnect-team/wppconnect");
const { Message } = require("./modules/message");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));
app.use(cors());
app.use(express.json());
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true if using HTTPS
      // maxAge: 3600000,
    },
  })
);

let client = null;

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "auth.html"));
});

app.post("/auth", (req, res) => {
  const { password } = req.body;
  if (password === process.env.PASSWORD) {
    req.session.authenticated = true;
    res.sendStatus(200);
  } else {
    res.redirect("/out?failed=true");
  }
});

app.get("/out", (req, res) => {
  const failed = req.query.failed === "true";
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Anda gagal logout" });
    }

    res.clearCookie("connect.sid");

    if (failed) {
      res.status(401).json({ message: "Password yang Anda masukkan salah" });
    } else {
      res.status(200).json({ message: "Anda telah logout" });
    }
  });
});

function isAuthenticated(req, res, next) {
  if (req.session.authenticated) {
    return next();
  }
  res.status(401).json({ message: "Anda harus login terlebih dahulu" });
}

app.get("/in", isAuthenticated, (req, res) => {
  if (client && client.isInChat) {
    return res.status(200).json({ message: "Anda telah terhubung ke WhatsApp (InChat)" });
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

const cors = require("cors");
const express = require("express");
const session = require("express-session");
const wppconnect = require("@wppconnect-team/wppconnect");
const { Message } = require("./modules/message");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use("/assets", express.static(path.join(__dirname, "assets")));

app.use(express.urlencoded({ extended: true }));
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
let deviceInfo = {};

function checkAuth(req, res, next) {
  if (req.session.isAuthenticated) {
    return next();
  } else {
    res.redirect("/login");
  }
}

function checkNotAuth(req, res, next) {
  if (req.session.isAuthenticated) {
    res.redirect("/");
  } else {
    return next();
  }
}

app.get("/login", checkNotAuth, (req, res) => {
  res.render("login", { error: null });
});

app.post("/login", checkNotAuth, (req, res) => {
  const { username, password } = req.body;
  if (username === process.env.USERNAME_WEB && password === process.env.PASSWORD_WEB) {
    req.session.isAuthenticated = true;
    res.redirect("/");
  } else {
    res.render("login", { error: "username atau password salah" });
  }
});

app.get("/", checkAuth, (req, res) => {
  res.render("index", { success: null, qr: null, deviceInfo: null });
});

app.get("/logout", checkAuth, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.redirect("/");
    }
    res.clearCookie("connect.sid");
    res.redirect("/login");
  });
});

app.get("/scan", checkAuth, (req, res) => {
  if (client && client.isInChat) {
    return res.render("index", {
      success: "Anda telah terhubung dengan WhatsApp (InChat)",
      qr: null,
      deviceInfo,
    });
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
        res.render("index", { success: null, qr: base64Qr, deviceInfo: null });
      },
      logQR: false,
      statusFind: (statusSession, session) => {
        if (statusSession === "isLogged") {
          return res.render("index", {
            success: "Anda telah terhubung dengan WhatsApp",
            qr: null,
            deviceInfo,
          });
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

  client
    .getHostDevice()
    .then((hostDevice) => {
      const fullName = hostDevice.pushname ?? "Admin";
      const platform = hostDevice.platform ?? "Android";
      deviceInfo.fullName = fullName[0].toUpperCase() + fullName.slice(1);
      deviceInfo.platform = platform[0].toUpperCase() + platform.slice(1);

      console.log("Host Device Info:", hostDevice);
      console.log(deviceInfo);
    })
    .catch((error) => {
      console.error("Error getting host device info:", error);
    });
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

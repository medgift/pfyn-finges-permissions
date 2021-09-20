const express = require("express");
const router = express.Router();

const admin = require("firebase-admin");

const serviceAccount = require("../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

/* GET home page. */
router.get("/", async function (req, res, next) {
  let { users } = await admin.auth().listUsers();

  res.render("index", {
    title: "Pfyn-Finges Permissions Manager",
    users: users,
  });
});

/* MAKE user an admin */
router.patch("/user/:uid/:mode", async function (req, res, next) {
  let uid = req.params.uid;
  let mode = req.params.mode;

  console.log(`Make user ${uid} a ${mode}...`);

  await admin.auth().setCustomUserClaims(uid, { admin: mode === "admin" });

  res.send({ message: "OK" });
});

module.exports = router;

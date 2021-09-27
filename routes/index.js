const express = require("express");
const router = express.Router();

const admin = require("firebase-admin");

const serviceAccountGrp1 = require("../serviceAccountKey-grp1.json");
const serviceAccountGrp2 = require("../serviceAccountKey-grp2.json");
const serviceAccountGrp3 = require("../serviceAccountKey-grp3.json");
const serviceAccountGrp4 = require("../serviceAccountKey-grp4.json");
const serviceAccountGrp5 = require("../serviceAccountKey-grp5.json");
const serviceAccountGrp23 = require("../serviceAccountKey-grp23.json");

admin.initializeApp({ credential: admin.credential.cert(serviceAccountGrp23) });

const adminGrp1 = admin.initializeApp(
  { credential: admin.credential.cert(serviceAccountGrp1) },
  "grp1"
);
const adminGrp2 = admin.initializeApp(
  { credential: admin.credential.cert(serviceAccountGrp2) },
  "grp2"
);
const adminGrp3 = admin.initializeApp(
  { credential: admin.credential.cert(serviceAccountGrp3) },
  "grp3"
);
const adminGrp4 = admin.initializeApp(
  { credential: admin.credential.cert(serviceAccountGrp4) },
  "grp4"
);
const adminGrp5 = admin.initializeApp(
  { credential: admin.credential.cert(serviceAccountGrp5) },
  "grp5"
);

const GROUPS = ["grp1", "grp2", "grp3", "grp4", "grp5", "grp23"];

/* GET home page. */
router.get("/", async function (req, res, next) {
  let groups = GROUPS;

  res.render("index", {
    title: "Pfyn-Finges Permissions Manager",
    groups: groups,
  });
});

/* GET a group's users */
router.get("/users/:group", async function (req, res, next) {
  let group = req.params.group;

  let firebaseAdmin = selectAdmin(group);

  let { users } = await firebaseAdmin.auth().listUsers();

  res.render("users", {
    title: `Pfyn-Finges Permissions Manager - ${req.params.group}`,
    users: users,
    group: group,
  });
});

/* MAKE user an admin */
router.patch("/users/:group/:uid/:mode", async function (req, res, next) {
  let group = req.params.group;
  let uid = req.params.uid;
  let mode = req.params.mode;

  let firebaseAdmin = selectAdmin(group);

  console.log(`Make user ${uid} a ${mode}...`);

  await firebaseAdmin
    .auth()
    .setCustomUserClaims(uid, { admin: mode === "admin" });

  res.send({ message: "OK" });
});

function selectAdmin(group) {
  switch (group) {
    case GROUPS[0]:
      return adminGrp1;
    case GROUPS[1]:
      return adminGrp2;
    case GROUPS[2]:
      return adminGrp3;
    case GROUPS[3]:
      return adminGrp4;
    case GROUPS[4]:
      return adminGrp5;
    case GROUPS[5]:
      return admin;
    default:
      console.error("This group is not recognized!");
      return null;
  }
}

module.exports = router;

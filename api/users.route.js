const express = require("express");
const UsersCtrl = require("./users.controller.js");

const router = express.Router();

router.route("/login").post(UsersCtrl.apiLogin);
router.route("/register").post(UsersCtrl.apiRegister);

module.exports = router;

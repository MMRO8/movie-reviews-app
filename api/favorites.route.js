const express = require("express");
const FavoritesCtrl = require("./favorites.controller.js");

const router = express.Router();

router.route("/update").post(FavoritesCtrl.apiUpdateFavorite); // للإضافة والحذف
router.route("/user/:user").get(FavoritesCtrl.apiGetFavorites); // لجلب القائمة

module.exports = router;

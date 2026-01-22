const express = require("express");
const MoviesCtrl = require("./movies.controller.js");

const router = express.Router();

// الرابط الرئيسي: يجلب الأفلام (GET) ويضيف فيلماً جديداً (POST)
router.route("/").get(MoviesCtrl.apiGetMovies).post(MoviesCtrl.apiPostMovie); // 👈 هذا هو الجديد

router.route("/id/:id").get(MoviesCtrl.apiGetMovieById);
router.route("/ratings").get(MoviesCtrl.apiGetRatings);

module.exports = router;

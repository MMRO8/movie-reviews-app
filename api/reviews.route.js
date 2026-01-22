const express = require("express");
const ReviewsCtrl = require("./reviews.controller.js");

const router = express.Router();

// 1. جلب المراجعات الخاصة بفيلم معين
// يطابق دالة apiGetReviews في الكنترولر
router.route("/movie/:id").get(ReviewsCtrl.apiGetReviews);

// أضف هذا السطر مع باقي الروابط
router.route("/user/:username").get(ReviewsCtrl.apiGetReviewsByUser);

// 2. إضافة مراجعة جديدة
// يطابق دالة apiPostReview في الكنترولر
router.route("/new").post(ReviewsCtrl.apiPostReview);

// 3. تعديل أو حذف مراجعة (باستخدام معرف المراجعة)
// يطابق دالة apiUpdateReview و apiDeleteReview
router
  .route("/:id")
  .put(ReviewsCtrl.apiUpdateReview)
  .delete(ReviewsCtrl.apiDeleteReview);

module.exports = router;

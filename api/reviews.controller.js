const ReviewsDAO = require("../dao/reviewsDAO.js");

module.exports = class ReviewsController {
  static async apiPostReview(req, res, next) {
    try {
      // نأخذ الـ ID كنص (String) لأن MongoDB تتعامل معه هكذا
      const movieId = req.body.movieId;
      const review = req.body.review;
      const user = req.body.user;

      console.log("Posting review for movieId:", movieId);

      const reviewResponse = await ReviewsDAO.addReview(movieId, user, review);
      res.json({ status: "success" });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  static async apiGetReviews(req, res, next) {
    try {
      let id = req.params.id || {};
      let reviews = await ReviewsDAO.getReviewsByMovieId(id);

      if (!reviews) {
        res.status(404).json({ error: "Not found" });
        return;
      }
      res.json(reviews);
    } catch (e) {
      console.log(`api, ${e}`);
      res.status(500).json({ error: e });
    }
  }

  static async apiUpdateReview(req, res, next) {
    try {
      const reviewId = req.body.reviewId;
      const review = req.body.review;
      const user = req.body.user;

      const reviewResponse = await ReviewsDAO.updateReview(
        reviewId,
        user,
        review,
      );

      var { error } = reviewResponse;
      if (error) {
        res.status(400).json({ error });
      }

      if (reviewResponse.modifiedCount === 0) {
        throw new Error(
          "unable to update review - user may not be original poster",
        );
      }

      res.json({ status: "success" });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  static async apiDeleteReview(req, res, next) {
    try {
      const reviewId = req.params.id;
      const reviewResponse = await ReviewsDAO.deleteReview(reviewId);
      res.json({ status: "success" });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
  static async apiGetReviewsByUser(req, res, next) {
    try {
      let username = req.params.username || {};
      let reviews = await ReviewsDAO.getReviewsByUser(username);

      if (!reviews) {
        res.status(404).json({ error: "Not found" });
        return;
      }
      res.json(reviews);
    } catch (e) {
      res.status(500).json({ error: e });
    }
  }
};

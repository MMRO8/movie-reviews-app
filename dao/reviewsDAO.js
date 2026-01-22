const mongodb = require("mongodb");
const ObjectId = mongodb.ObjectId;

let reviews;

module.exports = class ReviewsDAO {
  static async injectDB(conn) {
    if (reviews) {
      return;
    }
    try {
      reviews = await conn.db("reviews").collection("reviews");
    } catch (e) {
      console.error(`Unable to establish collection handles in userDAO: ${e}`);
    }
  }

  static async addReview(movieId, user, review) {
    try {
      const reviewDoc = {
        movieId: new ObjectId(movieId), // ⚠️ هذا هو التغيير المهم: تحويل النص لـ ObjectId
        user: user,
        review: review,
        date: new Date(), // إضافة تاريخ للمراجعة
      };
      return await reviews.insertOne(reviewDoc);
    } catch (e) {
      console.error(`Unable to post review: ${e}`);
      return { error: e };
    }
  }

  static async getReviewsByMovieId(movieId) {
    try {
      // البحث أيضاً يجب أن يتم باستخدام ObjectId
      const cursor = await reviews.find({ movieId: new ObjectId(movieId) });
      return await cursor.toArray();
    } catch (e) {
      console.error(`Unable to get reviews: ${e}`);
      return [];
    }
  }

  static async updateReview(reviewId, user, review) {
    try {
      const updateResponse = await reviews.updateOne(
        { _id: new ObjectId(reviewId) }, // التأكد من أن معرف المراجعة ObjectId
        { $set: { review: review } },
      );

      return updateResponse;
    } catch (e) {
      console.error(`Unable to update review: ${e}`);
      return { error: e };
    }
  }

  static async deleteReview(reviewId) {
    try {
      const deleteResponse = await reviews.deleteOne({
        _id: new ObjectId(reviewId),
      });

      return deleteResponse;
    } catch (e) {
      console.error(`Unable to delete review: ${e}`);
      return { error: e };
    }
  }
  // دالة جديدة لجلب مراجعات مستخدم معين
  static async getReviewsByUser(username) {
    try {
      const cursor = await reviews.find({ user: username });
      return await cursor.toArray();
    } catch (e) {
      console.error(`Unable to get reviews by user: ${e}`);
      return [];
    }
  }
};

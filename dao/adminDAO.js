let reviewsColl;
let usersColl;
let favoritesColl;

module.exports = class AdminDAO {
  static async injectDB(conn) {
    if (reviewsColl && usersColl && favoritesColl) {
      return;
    }
    try {
      const db = conn.db("reviews");
      reviewsColl = db.collection("reviews");
      usersColl = db.collection("users");
      favoritesColl = db.collection("favorites");
    } catch (e) {
      console.error(`Unable to establish collection handles in AdminDAO: ${e}`);
    }
  }

  static async getStats() {
    try {
      // نطلب من قاعدة البيانات عد الوثائق (سريع جداً)
      const reviewsCount = await reviewsColl.countDocuments();
      const usersCount = await usersColl.countDocuments();
      const favoritesCount = await favoritesColl.countDocuments();

      return {
        reviews: reviewsCount,
        users: usersCount,
        favorites: favoritesCount,
      };
    } catch (e) {
      console.error(`Unable to get stats: ${e}`);
      return { error: e };
    }
  }
};

let favoritesCollection;

module.exports = class FavoritesDAO {
  static async injectDB(conn) {
    if (favoritesCollection) {
      return;
    }
    try {
      favoritesCollection = await conn.db("reviews").collection("favorites");
    } catch (e) {
      console.error(
        `Unable to establish collection handles in favoritesDAO: ${e}`,
      );
    }
  }

  static async updateFavorite(user, movieId, movieTitle, posterPath) {
    try {
      // البحث هل الفيلم موجود بالفعل في مفضلة هذا المستخدم؟
      const favorite = await favoritesCollection.findOne({
        user: user,
        movieId: movieId,
      });

      if (favorite) {
        // إذا كان موجوداً -> احذفه (Toggle Off)
        await favoritesCollection.deleteOne({
          user: user,
          movieId: movieId,
        });
        return { action: "removed" };
      } else {
        // إذا لم يكن موجوداً -> أضفه (Toggle On)
        await favoritesCollection.insertOne({
          user: user,
          movieId: movieId,
          movieTitle: movieTitle,
          posterPath: posterPath, // نحفظ الصورة لنعرضها في البروفايل لاحقاً
        });
        return { action: "added" };
      }
    } catch (e) {
      console.error(`Unable to update favorite: ${e}`);
      return { error: e };
    }
  }

  static async getFavorites(user) {
    try {
      const cursor = await favoritesCollection.find({ user: user });
      return await cursor.toArray();
    } catch (e) {
      console.error(`Unable to get favorites: ${e}`);
      return [];
    }
  }
};

const FavoritesDAO = require("../dao/favoritesDAO.js");

module.exports = class FavoritesController {
  static async apiUpdateFavorite(req, res, next) {
    try {
      const { user, movieId, movieTitle, posterPath } = req.body;
      const response = await FavoritesDAO.updateFavorite(
        user,
        movieId,
        movieTitle,
        posterPath,
      );
      res.json(response);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  static async apiGetFavorites(req, res, next) {
    try {
      const user = req.params.user;
      const favorites = await FavoritesDAO.getFavorites(user);
      res.json(favorites);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
};

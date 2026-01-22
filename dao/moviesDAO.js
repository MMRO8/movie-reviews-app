const mongodb = require("mongodb");
const ObjectId = mongodb.ObjectId;

let movies;

module.exports = class MoviesDAO {
  static async injectDB(conn) {
    if (movies) {
      return;
    }
    try {
      movies = await conn.db("sample_mflix").collection("movies");
    } catch (e) {
      console.error(
        `Unable to establish collection handles in moviesDAO: ${e}`,
      );
    }
  }

  static async getMovies({
    filters = null,
    page = 0,
    moviesPerPage = 20,
  } = {}) {
    let query;
    if (filters) {
      if ("title" in filters) {
        query = { $text: { $search: filters["title"] } };
      } else if ("rated" in filters) {
        query = { rated: { $eq: filters["rated"] } };
      }
    }

    let cursor;

    try {
      cursor = await movies.find(query);
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`);
      return { moviesList: [], totalNumMovies: 0 };
    }

    // 🔥 التعديل هنا: أضفنا sort({ _id: -1 })
    // -1 تعني ترتيب تنازلي (الجديد فوق، والقديم تحت)
    const displayCursor = cursor
      .sort({ _id: -1 })
      .limit(moviesPerPage)
      .skip(moviesPerPage * page);

    try {
      const moviesList = await displayCursor.toArray();
      const totalNumMovies = await movies.countDocuments(query);

      return { moviesList, totalNumMovies };
    } catch (e) {
      console.error(
        `Unable to convert cursor to array or problem counting documents, ${e}`,
      );
      return { moviesList: [], totalNumMovies: 0 };
    }
  }

  static async getMovieById(id) {
    try {
      // هنا السحر! نستخدم aggregate لدمج الفيلم مع مراجعاته
      const pipeline = [
        {
          $match: {
            _id: new ObjectId(id),
          },
        },
        {
          $lookup: {
            from: "reviews",
            localField: "_id",
            foreignField: "movieId",
            as: "reviews",
          },
        },
      ];
      return await movies.aggregate(pipeline).next();
    } catch (e) {
      console.error(`Something went wrong in getMovieById: ${e}`);
      throw e;
    }
  }

  static async getRatings() {
    let ratings = [];
    try {
      ratings = await movies.distinct("rated");
      return ratings;
    } catch (e) {
      console.error(`Unable to get ratings, ${e}`);
      return ratings;
    }
  }
  static async addMovie(movieInfo) {
    try {
      // ننشئ وثيقة الفيلم
      // نضع تاريخاً وهمياً لكي يظهر كفيلم حديث
      return await movies.insertOne({
        title: movieInfo.title,
        plot: movieInfo.plot,
        year: 2024, // نضعه حديثاً
        genres: ["Action", "Sci-Fi"], // تصنيفات افتراضية
        poster: null, // سنعتمد على TMDB للصور
      });
    } catch (e) {
      console.error(`Unable to add movie: ${e}`);
      return { error: e };
    }
  }
};

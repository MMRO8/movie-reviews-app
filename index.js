const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
require("dotenv").config();

// استيراد الملفات
const favorites = require("./api/favorites.route");
const FavoritesDAO = require("./dao/favoritesDAO");
const admin = require("./api/admin.route");
const AdminDAO = require("./dao/adminDAO");
const movies = require("./api/movies.route");
const MoviesDAO = require("./dao/moviesDAO");
const reviews = require("./api/reviews.route");
const ReviewsDAO = require("./dao/reviewsDAO");
const users = require("./api/users.route");
const UsersDAO = require("./dao/usersDAO");

const app = express();
const port = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// الروابط (Routes)
app.use("/api/v1/admin", admin);
app.use("/api/v1/favorites", favorites);
app.use("/api/v1/movies", movies);
app.use("/api/v1/reviews", reviews);
app.use("/api/v1/users", users);

// 🔥 التعديل هنا: حذفنا "*" لكي لا ينهار السيرفر
app.use((req, res) => res.status(404).json({ error: "not found" }));

// الاتصال بقاعدة البيانات وتشغيل السيرفر
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, {
  maxPoolSize: 50,
  wtimeoutMS: 2500,
});

async function run() {
  try {
    await client.connect();

    // حقن قاعدة البيانات
    await AdminDAO.injectDB(client);
    await UsersDAO.injectDB(client);
    await FavoritesDAO.injectDB(client);
    await MoviesDAO.injectDB(client);
    await ReviewsDAO.injectDB(client);

    console.log("✅ Connected to MongoDB successfully!");

    app.listen(port, () => {
      console.log(`🚀 Server is running on port: ${port}`);
    });
  } catch (error) {
    console.error("❌ Failed to connect to database:", error);
    process.exit(1);
  }
}

run().catch(console.dir);

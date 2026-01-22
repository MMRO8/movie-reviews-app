const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
require("dotenv").config();
const favorites = require("./api/favorites.route");
const FavoritesDAO = require("./dao/favoritesDAO");

const admin = require("./api/admin.route");
const AdminDAO = require("./dao/adminDAO");

// 1. استيراد ملفات الأفلام
const movies = require("./api/movies.route");
const MoviesDAO = require("./dao/moviesDAO");

// 2. (جديد) استيراد ملفات المراجعات
const reviews = require("./api/reviews.route");
const ReviewsDAO = require("./dao/reviewsDAO");

// 3. استيراد ملفات المستخدمين
const users = require("./api/users.route");
const UsersDAO = require("./dao/usersDAO");

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

app.use("/api/v1/admin", admin);

app.use("/api/v1/favorites", favorites);

// توجيه طلبات الأفلام
app.use("/api/v1/movies", movies);

// 3. (جديد) توجيه طلبات المراجعات
// أي رابط يبدأ بـ /api/v1/reviews سيذهب لملف المراجعات
app.use("/api/v1/reviews", reviews);

// إذا طلب المستخدم رابطاً غير موجود (يجب أن يكون هذا السطر بعد الروابط الصحيحة)
app.use("/api/v1/users", users);
app.use((req, res) => res.status(404).json({ error: "not found" }));
const uri = process.env.MONGO_URI;

const client = new MongoClient(uri, {
  maxPoolSize: 50,
  wtimeoutMS: 2500,
});

async function run() {
  try {
    await client.connect();

    await AdminDAO.injectDB(client);

    await UsersDAO.injectDB(client);

    await FavoritesDAO.injectDB(client);

    // حقن الاتصال داخل ملف DAO للأفلام
    await MoviesDAO.injectDB(client);

    // 4. (جديد) حقن الاتصال داخل ملف DAO للمراجعات
    await ReviewsDAO.injectDB(client);

    console.log("✅ Connected to MongoDB and DAOs created successfully!");

    app.listen(port, () => {
      console.log(`🚀 Server is running on port: ${port}`);
    });
  } catch (error) {
    console.error("❌ Failed to connect to the database:", error);
    process.exit(1);
  }
}

run().catch(console.dir);

// الروابط العالمية (Render) 🌍
const LOCAL_API_LINK = "https://my-movie-api-vx.onrender.com/api/v1/movies/";
const LOCAL_SEARCH_API =
  "https://my-movie-api-vx.onrender.com/api/v1/movies?title=";
const FAV_API = "https://my-movie-api-vx.onrender.com/api/v1/favorites/";

// 2. روابط الصور (TMDB Only) 📸
// مفتاح جديد ومضمون
// مفتاح جديد (جربه الآن)
const TMDB_API_KEY = "67d0746aca0d123043ebc6a69eed5780";
const TMDB_IMG_PATH = "https://image.tmdb.org/t/p/w500";
const TMDB_SEARCH_URL = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=`;

const main = document.getElementById("section");
const form = document.getElementById("form");
const search = document.getElementById("query");
const userPanel = document.getElementById("user-panel");

// المستخدم
const user = localStorage.getItem("user");

// --- إعداد شريط المستخدم ---
if (userPanel) {
  if (user) {
    // زر الداشبورد (للأدمن فقط)
    let adminBtn = "";
    if (user === "admin") {
      adminBtn = `<a href="admin.html" style="color: red; font-weight: bold;">⚙️ Dashboard</a>`;
    }

    userPanel.innerHTML = `
            ${adminBtn}
            <a href="profile.html" style="color: white; text-decoration: none;">
                <span style="color: var(--accent-color);">👤 ${user}</span>
            </a>
            <button class="logout-btn" onclick="logout()">Logout</button>
        `;
  } else {
    userPanel.innerHTML = `
            <a href="login.html">Login</a>
            <a href="signup.html">Sign Up</a>
        `;
  }
}

function logout() {
  localStorage.removeItem("user");
  window.location.reload();
}

// --- المنطق الرئيسي ---
let userFavorites = [];

init();

async function init() {
  if (user) {
    await fetchUserFavorites();
  }
  returnMovies(LOCAL_API_LINK);
}

// جلب قائمة المفضلة
async function fetchUserFavorites() {
  try {
    const res = await fetch(FAV_API + "user/" + user);
    if (!res.ok) return; // حماية من الأخطاء
    const data = await res.json();
    userFavorites = data.map((fav) => fav.movieId.toString());
  } catch (error) {
    console.error("Error fetching favorites:", error);
  }
}

// دالة عرض الأفلام
function returnMovies(url) {
  // 1. عرض التحميل (Skeleton)
  main.innerHTML = "";
  for (let i = 0; i < 8; i++) {
    const skeletonCard = document.createElement("div");
    skeletonCard.classList.add("row");
    skeletonCard.innerHTML = `
        <div class="column">
            <div class="card" style="pointer-events: none; height: 450px;">
                <div class="skeleton skeleton-image" style="height: 300px;"></div>
                <div class="skeleton skeleton-text" style="width: 80%; margin-top: 15px;"></div>
                <div class="skeleton skeleton-text" style="width: 50%;"></div>
            </div>
        </div>
      `;
    main.appendChild(skeletonCard);
  }

  // 2. جلب البيانات من MongoDB (نصوص فقط)
  fetch(url)
    .then((res) => res.json())
    .then(function (data) {
      const list = data.movies || data.results;
      main.innerHTML = ""; // حذف Skeleton

      list.forEach((element) => {
        const div_card = document.createElement("div");
        div_card.setAttribute("class", "card");

        const movieId = element._id.toString();

        // المفضلة
        const isFav = userFavorites.includes(movieId);
        const heartClass = isFav ? "fav-active" : "fav-inactive";
        const heartSymbol = isFav ? "♥" : "♡";

        const div_row = document.createElement("div");
        div_row.setAttribute("class", "row");

        const div_column = document.createElement("div");
        div_column.setAttribute("class", "column");

        const image = document.createElement("img");
        image.setAttribute("class", "thumbnail");

        // ⚠️ هنا نحن لا نستخدم MongoDB نهائياً للصور
        // نضع صورة افتراضية رمادية حتى تأتي صورة TMDB
        image.src = "https://via.placeholder.com/300x450?text=Loading...";

        const title = document.createElement("h3");
        title.innerHTML = `${element.title}<br><a href="movie.html?id=${movieId}&title=${element.title}">reviews</a>`;

        const center = document.createElement("center");
        center.appendChild(image);

        const favBtn = document.createElement("button");
        favBtn.className = `fav-btn ${heartClass}`;
        favBtn.innerHTML = heartSymbol;
        favBtn.onclick = function () {
          toggleFavorite(movieId, element.title, image.src, favBtn);
        };

        center.appendChild(favBtn);
        div_card.appendChild(center);
        div_card.appendChild(title);
        div_column.appendChild(div_card);
        div_row.appendChild(div_column);

        main.appendChild(div_row);

        // 🔥 هنا نطلب الصورة الحقيقية من TMDB فقط
        getTMDBImage(element.title, image);
      });
    })
    .catch((err) => console.error("Error loading movies:", err));
}

// دالة جلب الصور من TMDB
async function getTMDBImage(movieTitle, imageElement) {
  try {
    const res = await fetch(TMDB_SEARCH_URL + encodeURIComponent(movieTitle));
    if (!res.ok) return; // إذا فشل الطلب نتوقف

    const data = await res.json();

    // إذا وجدنا صورة في TMDB نستخدمها
    if (
      data.results &&
      data.results.length > 0 &&
      data.results[0].poster_path
    ) {
      imageElement.src = TMDB_IMG_PATH + data.results[0].poster_path;
    } else {
      // إذا لم يجد TMDB صورة، نضع صورة "No Image"
      imageElement.src = "https://via.placeholder.com/300x450?text=No+Image";
    }
  } catch (error) {
    console.log("Network error fetching image");
  }
}

// دالة المفضلة
async function toggleFavorite(movieId, title, poster, btnElement) {
  if (!user) {
    alert("🔒 Please login to add favorites!");
    return;
  }

  try {
    const res = await fetch(FAV_API + "update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user: user,
        movieId: movieId,
        movieTitle: title,
        posterPath: poster,
      }),
    });

    const data = await res.json();

    if (data.action === "added") {
      btnElement.classList.remove("fav-inactive");
      btnElement.classList.add("fav-active");
      btnElement.innerHTML = "♥";
      userFavorites.push(movieId);
    } else if (data.action === "removed") {
      btnElement.classList.remove("fav-active");
      btnElement.classList.add("fav-inactive");
      btnElement.innerHTML = "♡";
      userFavorites = userFavorites.filter((id) => id !== movieId);
    }
  } catch (error) {
    console.error("Error toggling favorite:", error);
  }
}

// البحث
form.addEventListener("submit", (e) => {
  e.preventDefault();
  main.innerHTML = "";
  const searchItem = search.value;
  if (searchItem) {
    returnMovies(LOCAL_SEARCH_API + searchItem);
    search.value = "";
  }
});

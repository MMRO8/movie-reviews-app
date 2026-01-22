const APILINK = "http://localhost:8000/api/v1/reviews/";

const user = localStorage.getItem("user");
const main = document.getElementById("section");
const profileName = document.getElementById("profile-name");
const userPanel = document.getElementById("user-panel");

// --- التعديل الجديد للصورة ---
const avatarImage = document.getElementById("profile-avatar");

// إعداد رابط الصورة الذكي
// name=${user}: يضع الاسم
// background=random: يختار لوناً عشوائياً جميلاً
// size=128: دقة الصورة
// bold=true: جعل الخط عريضاً
// color=fff: لون الخط أبيض
if (avatarImage && user) {
  avatarImage.src = `https://ui-avatars.com/api/?name=${user}&background=random&length=1&bold=true&color=fff&size=128`;
}
// -----------------------------

// 1. حماية الصفحة
if (!user) {
  window.location.href = "login.html";
} else {
  profileName.innerText = user; // عرض اسم المستخدم في البطاقة
}

// 2. شريط التنقل
if (userPanel) {
  userPanel.innerHTML = `
        <span style="color:var(--accent-color)">${user}</span>
        <button class="logout-btn" onclick="logout()">Logout</button>
    `;
}
function logout() {
  localStorage.removeItem("user");
  window.location.href = "index.html";
}

// 3. جلب مراجعات المستخدم
getReviews();

async function getReviews() {
  // استخدمنا الرابط الجديد الذي أنشأناه في الباك إند
  const response = await fetch(APILINK + "user/" + user);
  const data = await response.json();

  console.log(data);

  if (data.length === 0) {
    main.innerHTML = `<h3 style="padding:20px;">You haven't written any reviews yet! 🕸️</h3>`;
    return;
  }

  data.forEach((review) => {
    const div_card = document.createElement("div");
    div_card.innerHTML = `
          <div class="row">
            <div class="column" style="width: 100%;"> <div class="card" id="${review._id}">
                <p><strong>Movie ID:</strong> <a href="movie.html?id=${review.movieId}&title=Movie" style="color:var(--accent-color)">Go to Movie</a></p>
                <p><strong>Review:</strong> ${review.review}</p>
                <p style="color: #666; font-size: 0.8rem;">${new Date(review.date).toDateString()}</p>
                
                <p>
                    <a href="#" onclick="editReview('${review._id}', '${review.review}', '${review.user}', '${review.movieId}')">✏️ Edit</a> 
                    <a href="#" onclick="deleteReview('${review._id}')" style="color: red; margin-left: 10px;">🗑️ Delete</a>
                </p>
              </div>
            </div>
          </div>
        `;
    main.appendChild(div_card);
  });
}

// 4. وظائف الحذف والتعديل (نفس منطق movie.js)
function deleteReview(id) {
  if (confirm("Are you sure you want to delete this review?")) {
    fetch(APILINK + id, { method: "DELETE" })
      .then((res) => res.json())
      .then((res) => location.reload());
  }
}

function editReview(id, review, user, movieId) {
  const element = document.getElementById(id);
  element.innerHTML = `
        <p><strong>Editing Review...</strong></p>
        <input type="text" id="input-${id}" value="${review}" style="width: 100%; padding: 10px; margin: 10px 0; color: black;">
        <button onclick="saveEdit('${id}', '${movieId}')" class="login-btn" style="width: auto;">Update</button>
        <button onclick="location.reload()" class="logout-btn">Cancel</button>
    `;
}

function saveEdit(id, movieId) {
  const newReview = document.getElementById("input-" + id).value;

  fetch(APILINK + id, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      reviewId: id,
      user: user,
      review: newReview,
      movieId: movieId,
    }),
  })
    .then((res) => res.json())
    .then((res) => location.reload());
}

// --- قسم المفضلة (Watchlist Logic) ---

const favSection = document.getElementById("favorites-section");
const FAV_API = "http://localhost:8000/api/v1/favorites/";

// استدعاء الدالة فوراً
getFavorites();

async function getFavorites() {
  try {
    const response = await fetch(FAV_API + "user/" + user);
    const data = await response.json();

    // تنظيف القسم
    favSection.innerHTML = "";

    if (data.length === 0) {
      favSection.innerHTML = `<p style="color:#888;">No favorite movies yet. Go add some! ❤️</p>`;
      return;
    }

    data.forEach((fav) => {
      // سنصنع بطاقة صغيرة لكل فيلم
      const movieCard = document.createElement("div");

      // تنسيق بسيط للبطاقة (يمكنك نقله لـ CSS لاحقاً)
      movieCard.style.cssText = `
                width: 150px; 
                background: #1e1e1e; 
                border-radius: 10px; 
                overflow: hidden; 
                box-shadow: 0 4px 10px rgba(0,0,0,0.3);
                text-align: center;
                position: relative;
            `;

      // صورة افتراضية
      let poster = "https://via.placeholder.com/150x225";

      // إذا كان هناك رابط صورة محفوظ، نستخدمه
      // ملاحظة: رابط TMDB يحتاج لمقدمة إذا كان مخزناً كمسار فقط، لكننا خزنناه كاملاً في script.js
      if (fav.posterPath) {
        poster = fav.posterPath;
      }

      movieCard.innerHTML = `
                <a href="movie.html?id=${fav.movieId}&title=${fav.movieTitle}">
                    <img src="${poster}" style="width:100%; height:225px; object-fit:cover;">
                </a>
                <h4 style="padding: 5px; font-size: 0.8rem; color: white;">${fav.movieTitle}</h4>
                <button onclick="removeFromFav('${fav.movieId}')" style="background:red; color:white; border:none; width:100%; cursor:pointer; padding:5px;">Remove 💔</button>
            `;

      favSection.appendChild(movieCard);
    });
  } catch (error) {
    console.error("Error fetching favorites:", error);
  }
}

// دالة لحذف الفيلم من المفضلة مباشرة من صفحة البروفايل
async function removeFromFav(movieId) {
  if (confirm("Remove from watchlist?")) {
    await fetch(FAV_API + "update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user: user,
        movieId: movieId,
        // لا نحتاج لباقي البيانات للحذف
      }),
    });
    // إعادة تحميل القائمة لتحديث العرض
    getFavorites();
  }
}

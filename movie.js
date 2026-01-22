// 1. تعريف الروابط والثوابت (مرة واحدة فقط)
const APILINK = "http://localhost:8000/api/v1/reviews/";

// ثوابت الصور (للخلفية)
const TMDB_API_KEY = "67d0746aca0d123043ebc6a69eed5780";
const TMDB_SEARCH_URL = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=`;
const TMDB_IMG_PATH_ORIGINAL = "https://image.tmdb.org/t/p/original";

// 2. التحقق من تسجيل الدخول
const user = localStorage.getItem("user");
if (!user) {
  alert("🔒 You must be logged in to view reviews!");
  window.location.href = "login.html";
  throw new Error("Access Denied");
}

const url = new URL(location.href);
const movieId = url.searchParams.get("id");
const movieTitle = url.searchParams.get("title");

const main = document.getElementById("section");
const title = document.getElementById("title");

if (title) title.innerText = movieTitle;

// 🔥 تشغيل الخلفية الديناميكية
setDynamicBackground(movieTitle);

// --- زر Logout ---
const userPanel = document.getElementById("user-panel");
if (userPanel) {
  userPanel.innerHTML = `
        <span>Welcome, ${user}</span>
        <button class="logout-btn" onclick="logout()">Logout</button>
    `;
}
function logout() {
  localStorage.removeItem("user");
  window.location.href = "index.html";
}

// --- قسم إضافة مراجعة جديدة ---
const div_new = document.createElement("div");
div_new.innerHTML = `
  <div class="row">
    <div class="column">
      <div class="card">
          <h3>Add New Review</h3>
          <p><strong>User: </strong> ${user}</p> 
          <p><strong>Review: </strong>
            <input type="text" id="new_review" value="" placeholder="Type your review here...">
          </p>
          <p><a href="#" onclick="saveReview('new_review')">💾 Save Review</a></p>
      </div>
    </div>
  </div>
`;
main.appendChild(div_new);

// --- جلب وعرض المراجعات ---
returnReviews(APILINK);

function returnReviews(url) {
  console.log("Fetching reviews for ID:", movieId);

  fetch(url + "movie/" + movieId)
    .then((res) => res.json())
    .then(function (data) {
      console.log("Data received:", data);

      if (data.length === 0) {
        console.log("No reviews found.");
        return;
      }

      data.forEach((review) => {
        const div_card = document.createElement("div");
        div_card.innerHTML = `
          <div class="row">
            <div class="column">
              <div class="card" id="${review._id}">
                <p><strong>User:</strong> ${review.user}</p>
                <p><strong>Review:</strong> ${review.review}</p>
                
                ${
                  review.user === user
                    ? `
                    <p>
                      <a href="#" onclick="editReview('${review._id}', '${review.review}', '${review.user}')">✏️</a> 
                      <a href="#" onclick="deleteReview('${review._id}')">🗑️</a>
                    </p>
                `
                    : ""
                }
                
              </div>
            </div>
          </div>
        `;
        main.appendChild(div_card);
      });
    })
    .catch((err) => console.error("Error fetching reviews:", err));
}

// --- وظائف التعديل والحفظ ---

function editReview(id, review, user) {
  const element = document.getElementById(id);
  const reviewInputId = "review" + id;

  element.innerHTML = `
    <p><strong>User: </strong>${user}</p>
    <p><strong>Review: </strong>
      <input type="text" id="${reviewInputId}" value="${review}">
    </p>
    <p><a href="#" onclick="saveReview('${reviewInputId}', '${id}')">💾 Update</a></p>
  `;
}

function saveReview(reviewInputId, id = "") {
  const review = document.getElementById(reviewInputId).value;

  const body = {
    review: review,
    user: user,
    movieId: movieId,
  };

  if (id) {
    body.reviewId = id;
  }

  const method = id ? "PUT" : "POST";

  // تصحيح: استخدام finalUrl مباشرة وحذف المتغير الزائد url
  const finalUrl = id ? APILINK + id : APILINK + "new";

  fetch(finalUrl, {
    method: method,
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then((res) => res.json())
    .then((res) => {
      console.log(res);
      location.reload();
    });
}

function deleteReview(id) {
  fetch(APILINK + id, {
    method: "DELETE",
  })
    .then((res) => res.json())
    .then((res) => {
      console.log(res);
      location.reload();
    });
}

// دالة لتغيير الخلفية بشكل ديناميكي
async function setDynamicBackground(movieTitle) {
  try {
    const res = await fetch(TMDB_SEARCH_URL + encodeURIComponent(movieTitle));
    const data = await res.json();

    if (
      data.results &&
      data.results.length > 0 &&
      data.results[0].backdrop_path
    ) {
      const bgImage = TMDB_IMG_PATH_ORIGINAL + data.results[0].backdrop_path;
      document.body.style.setProperty("--bg-image", `url('${bgImage}')`);
    } else if (
      data.results &&
      data.results.length > 0 &&
      data.results[0].poster_path
    ) {
      const bgImage = TMDB_IMG_PATH_ORIGINAL + data.results[0].poster_path;
      document.body.style.setProperty("--bg-image", `url('${bgImage}')`);
    }
  } catch (error) {
    console.error("Could not set background:", error);
  }
}

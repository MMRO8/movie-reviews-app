const signupForm = document.getElementById("signupForm");
const errorMsg = document.getElementById("error-msg");

const API_LINK = "https://my-movie-api-vx.onrender.com/api/v1/movies/";

signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  errorMsg.innerText = "";

  try {
    // إرسال طلب التسجيل (Register)
    const response = await fetch(APILINK + "register", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: username, password: password }),
    });

    const data = await response.json();

    if (data.status === "success") {
      // نجاح التسجيل
      const btn = document.querySelector(".login-btn");
      btn.style.backgroundColor = "#4caf50";
      btn.innerText = "Account Created! Go to Login...";

      // توجيه المستخدم لصفحة الدخول بعد ثانية
      setTimeout(() => {
        window.location.href = "login.html";
      }, 1500);
    } else {
      // فشل (غالباً لأن الاسم مستخدم سابقاً)
      errorMsg.innerText = "❌ " + (data.error || "Failed to register");
    }
  } catch (err) {
    console.error(err);
    errorMsg.innerText = "❌ Server error";
  }
});

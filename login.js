const loginForm = document.getElementById("loginForm");
const errorMsg = document.getElementById("error-msg");

// رابط الباك إند الخاص بالمستخدمين
// تعريف الرابط (Render)
const APILINK = "https://my-movie-api-vx.onrender.com/api/v1/login"; 

// ... بقية الكود كما هو ...

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  // مسح رسائل الخطأ السابقة
  errorMsg.innerText = "";

  try {
    // إرسال طلب الدخول للسيرفر
    const response = await fetch(APILINK + "login", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: username, password: password }),
    });

    const data = await response.json();

    if (data.status === "success") {
      // 1. حفظ اسم المستخدم في المتصفح
      localStorage.setItem("user", data.username);

      // 2. تغيير لون الزر للأخضر كنوع من الاحتفال
      const btn = document.querySelector(".login-btn");
      btn.style.backgroundColor = "#4caf50";
      btn.innerText = "Success! Redirecting...";

      // 3. الانتقال للصفحة الرئيسية بعد ثانية واحدة
      setTimeout(() => {
        window.location.href = "index.html";
      }, 1000);
    } else {
      // إذا كان هناك خطأ (الاسم أو كلمة السر خطأ)
      errorMsg.innerText = "❌ " + (data.error || "Login failed");
    }
  } catch (err) {
    console.error(err);
    errorMsg.innerText = "❌ Server error, please try again later.";
  }
});

// 🟢 رابط السيرفر الخاص بك (Render)
const APILINK = "https://my-movie-api-vx.onrender.com/api/v1/users/login";

const loginForm = document.querySelector("#login-form");
// ملاحظة: حتى لو كان id الخانة في html هو email، سنأخذ قيمتها ونرسلها كـ username
const userInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const usernameValue = userInput.value;
    const passwordValue = passwordInput.value;

    if (!usernameValue || !passwordValue) {
      alert("Please fill in all fields!");
      return;
    }

    try {
      console.log("Sending login request for:", usernameValue);

      const res = await fetch(APILINK, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // 🔥 الإصلاح هنا: نرسل username لأن الـ Controller ينتظر username
        body: JSON.stringify({
          username: usernameValue,
          password: passwordValue,
        }),
      });

      const data = await res.json();
      console.log("Server response:", data);

      // 🔥 التحقق حسب رد الـ Controller الخاص بك
      if (data.status === "success") {
        // تم الدخول بنجاح
        localStorage.setItem("user", data.username); // حفظ الاسم
        window.location.href = "index.html"; // الانتقال للصفحة الرئيسية
      } else {
        // عرض رسالة الخطأ القادمة من السيرفر (User not found أو Wrong password)
        alert("Login Failed: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      console.error("Login Error:", err);
      alert("Connection Error! Check Console.");
    }
  });
}

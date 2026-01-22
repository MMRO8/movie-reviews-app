// 🟢 تعريف الرابط الصحيح (Render)
// في index.js المسار هو /api/v1/users
// لذا الرابط الكامل لتسجيل الدخول يكون:
const APILINK = "https://my-movie-api-vx.onrender.com/api/v1/users/login";

const loginForm = document.querySelector("#login-form"); // تأكد من ID الفورم في HTML
const emailInput = document.querySelector("#email"); // تأكد من ID الإيميل
const passwordInput = document.querySelector("#password"); // تأكد من ID الباسورد

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = emailInput.value;
    const password = passwordInput.value;

    if (!email || !password) {
      alert("Please fill in all fields!");
      return;
    }

    try {
      console.log("Attempting to login to:", APILINK); // للمراقبة في الكونسول

      const res = await fetch(APILINK, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email, // تأكد أن الباك إند يتوقع "email"
          password: password, // تأكد أن الباك إند يتوقع "password"
        }),
      });

      const data = await res.json();
      console.log("Server response:", data); // لنرى ماذا رد السيرفر

      // هنا نتحقق حسب رد سيرفرك (قد يكون data.status أو data.token)
      if (data.status === "success" || data.user || data.token) {
        // تم الدخول بنجاح
        localStorage.setItem("user", data.name || data.user || email); // حفظ الاسم
        window.location.href = "index.html"; // التوجيه للصفحة الرئيسية
      } else {
        alert("Incorrect Password or User! ❌");
      }
    } catch (err) {
      console.error("Login Error:", err);
      alert("Connection Error! Check Console.");
    }
  });
}

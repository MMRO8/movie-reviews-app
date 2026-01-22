const UsersDAO = require("../dao/usersDAO.js");

module.exports = class UsersController {
  static async apiLogin(req, res, next) {
    try {
      const username = req.body.username;
      const password = req.body.password;

      const user = await UsersDAO.login(username);

      if (!user) {
        // المستخدم غير موجود
        res.status(400).json({ error: "User not found" });
        return;
      }

      // التحقق من كلمة السر
      if (user.password !== password) {
        res.status(400).json({ error: "Wrong password" });
        return;
      }

      // تم الدخول بنجاح
      res.json({ status: "success", username: user.username });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  static async apiRegister(req, res, next) {
    try {
      const username = req.body.username;
      const password = req.body.password;

      const registerResponse = await UsersDAO.register(username, password);

      if (registerResponse.error) {
        res.status(400).json({ error: registerResponse.error });
        return;
      }

      res.json({ status: "success" });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
};

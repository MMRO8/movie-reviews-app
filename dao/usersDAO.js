let users;

module.exports = class UsersDAO {
  static async injectDB(conn) {
    if (users) {
      return;
    }
    try {
      // سننشئ مجموعة جديدة اسمها users
      users = await conn.db("reviews").collection("users");
    } catch (e) {
      console.error(`Unable to establish collection handles in usersDAO: ${e}`);
    }
  }

  static async login(username) {
    try {
      // البحث عن مستخدم يحمل نفس الاسم
      return await users.findOne({ username: username });
    } catch (e) {
      console.error(`Unable to login: ${e}`);
      return { error: e };
    }
  }

  static async register(username, password) {
    try {
      // التأكد أولاً ألا يكون الاسم مكرراً
      const existingUser = await users.findOne({ username: username });
      if (existingUser) {
        return { error: "Username already exists" };
      }

      const userDoc = {
        username: username,
        password: password, // ملاحظة: في المشاريع الحقيقية يجب تشفير كلمة السر، لكن سنبقيها نصاً للتعلم الآن
      };
      return await users.insertOne(userDoc);
    } catch (e) {
      console.error(`Unable to register: ${e}`);
      return { error: e };
    }
  }
};

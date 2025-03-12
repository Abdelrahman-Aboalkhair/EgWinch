const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./modules/users/user.model");

async function createSuperAdmin() {
  await mongoose.connect(process.env.MONGO_URI);

  const existingSuperAdmin = await User.findOne({ role: "super-admin" });

  if (!existingSuperAdmin) {
    const hashedPassword = await bcrypt.hash(
      process.env.SUPER_ADMIN_PASSWORD,
      12
    );

    await User.create({
      name: "Super Admin",
      email: "superadmin@gmail.com",
      password: hashedPassword,
      role: "super-admin",
    });

    console.log("✅ Super Admin created successfully!");
  } else {
    console.log("⚠️ Super Admin already exists!");
  }

  mongoose.disconnect();
}

createSuperAdmin();

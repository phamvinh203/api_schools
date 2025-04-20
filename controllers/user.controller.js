const User = require('../models/user.model');
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken'); 
// [POST] /api/user/register
module.exports.register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // Kiểm tra email đã tồn tại chưa
    const existingUser = await User.findOne({ email: email, deleted: false });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Băm mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo user mới
    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
    });

    // Tạo JWT token
    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Gửi token qua cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 1 ngày
    });

    // Trả về phản hồi
    res.status(201).json({
      message: "User registered successfully",
      data: newUser,
    });

  } catch (error) {
    console.error("Registration error:", error.message);
    res.status(500).json({ message: "Error registering user" });
  }
};

// [POST] /api/user/login
module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Tìm user theo email và chưa bị xóa
    const user = await User.findOne({ 
      email: email, 
      deleted: false 
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // So sánh mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Tạo JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" } // Token hết hạn sau 1 ngày
    );

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 1 ngày
    });

    // Trả kết quả (có thể không cần trả token vì đã lưu ở cookie)
    res.status(200).json({
      message: "Login successful",
      data: user,
      token: token, 
    }); 

  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Error logging in" });
  }
};


// [GET] /api/user/profile
module.exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password'); 
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error.message);
    res.status(500).json({ message: "Error fetching user profile" });
  }
}
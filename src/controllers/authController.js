const AuthService = require("../services/authService");

/**
 * Đăng nhập: lưu accessToken + refreshToken vào cookie httpOnly
 */
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const { accessToken, refreshToken, user } = await AuthService.login({ username, password });

    // Lưu accessToken và refreshToken vào cookie httpOnly
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false, sameSite: 'lax',
      // secure: process.env.NODE_ENV === "production",
      // sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 24, // 1 ngày (hoặc lấy từ env)
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, sameSite: 'lax',
      // secure: process.env.NODE_ENV === "production",
      // sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 ngày (hoặc lấy từ env)
    });

    res.json({ user });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

/**
 * Đăng xuất: xóa cookie
 */
exports.logout = async (req, res) => {
  res.clearCookie("accessToken", {
    httpOnly: true,

        secure: false, sameSite: 'lax',
    // secure: process.env.NODE_ENV === "production",
    // sameSite: "strict",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,

        secure: false, sameSite: 'lax'
    // secure: process.env.NODE_ENV === "production",
    // sameSite: "strict",
  });
  await AuthService.logout();
  res.json({ message: "Logged out successfully" });
};

/**
 * Refresh access token
 */
exports.refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(401).json({ message: "No refresh token" });

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    // Có thể kiểm tra user tồn tại ở đây nếu muốn
    const user = { _id: decoded.id, username: decoded.username, role: decoded.role };
    const accessToken = jwt.sign(user, process.env.JWT_ACCESS_SECRET, { expiresIn: process.env.JWT_ACCESS_EXPIRE_IN });
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false, sameSite: 'lax',

      // secure: process.env.NODE_ENV === "production",
      // sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 24 * 10, // 1 ngày
    });
    res.json({ message: "Token refreshed" });
  } catch (error) {
    res.status(401).json({ message: "Invalid refresh token" });
  }
};

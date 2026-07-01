import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 วัน
    httpOnly: true, // ป้องกัน XSS
    sameSite: "strict", // ป้องกัน CSRF
    secure: process.env.NODE_ENV !== "development", // ใช้ HTTPS ใน production
  });

  return token;
};

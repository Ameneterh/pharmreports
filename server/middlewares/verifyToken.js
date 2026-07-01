import jwt from "jsonwebtoken";

// export const verifyToken = (req, res, next) => {
//   const token = req.headers.authorization?.split(" ")[1];
//   if (!token) return res.status(401).json({ message: "No token found" });

//   try {
//     req.user = jwt.verify(token, process.env.JWT_SECRET_KEY);
//     next();
//   } catch {
//     res.status(401).json({ message: "Invalid token" });
//   }
// };

export const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token)
    return res.status(401).json({
      success: false,
      message: "Unuthorized! - No valid token provided",
    });

  try {
    const decoded = jwt.verify(token, process.env.JWT_TOKEN);

    if (!decoded)
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized! - Invalid token" });

    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.log("Error in verifyToken", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

import jwt from "jsonwebtoken";

const verifyUser = (allowedRoles = []) => {
  return (req, res, next) => {
    // 🔥 get token from cookie OR header
    let token = req.cookies.token;

    if (!token && req.headers.authorization) {
      token = req.headers.authorization.split(" ")[1];
    }

    console.log("👉 COOKIE TOKEN:", req.cookies.token);
    console.log("👉 HEADER TOKEN:", req.headers.authorization);
    console.log("👉 FINAL TOKEN:", token);
    console.log("COOKIES 👉", req.cookies);

    if (!token) {
      return res.status(401).json({
        status: false,
        message: "No token found",
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      console.log("👉 DECODED:", decoded);

      req.user = decoded;
      console.log("USER 👉", req.user);
      const userRoles = decoded.roles || [decoded.role];


      // ✅ role check
      if (allowedRoles.length > 0) {
        const hasAccess = userRoles.some((role) => allowedRoles.includes(role));

        if (!hasAccess) {
          return res.status(403).json({
            status: false,
            message: "Access Denied",
          });
        }
      }

      next();
    } catch (err) {
      console.log("❌ JWT ERROR:", err);
      return res.status(401).json({
        status: false,
        message: "Invalid token",
      });
    }
  };
};

export default verifyUser;

import permissions from "../config/permissions.js";

// export const authorize = (requiredPermission) => {
//   return (req, res, next) => {
//     const userRole = req.userId.role;

//     console.log(userRole);

//     const rolePermissions = permissions[userRole] || [];

//     if (!rolePermissions.includes(requiredPermission)) {
//       return res.status(403).json({
//         success: false,
//         message: "You do not have permission to perform this action",
//         permission: requiredPermission,
//       });
//     }

//     next();
//   };
// };

export const authorize = (requiredPermission) => {
  return (req, res, next) => {
    const userRole = req.user?.role;

    console.log("User:", req.user?._id);
    console.log("User role:", userRole);
    console.log("Required permission:", requiredPermission);

    const rolePermissions = permissions[userRole] || [];

    if (!rolePermissions.includes(requiredPermission)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to perform this action",
        permission: requiredPermission,
      });
    }

    next();
  };
};

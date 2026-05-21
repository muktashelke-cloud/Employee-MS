export const rolePermissions = {
  superadmin: [
    "view_dashboard",
    "view_profile",
    "view_employee",
    "view_attendance",
    "apply_leave",
    "manage_admin",
    "manage_hr"
  ],

  admin: [
    "view_dashboard",
    "view_profile",
    "view_employee",
    "view_attendance",
    "manage_hr"
  ],

  hr: [
    "view_dashboard",
    "view_employee",
    "view_attendance"
  ],

  employee: [
    "view_dashboard",
    "view_profile",
    "apply_leave",
    "view_attendance"
  ]
};

export const hasPermission = (role, permission) => {
  return rolePermissions[role]?.includes(permission);
};
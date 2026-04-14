export const ROLES = {
  ADMIN: "ADMIN",
  USER: "USER",
};

// check if user is admin
export const isAdmin = (user) => {
  return user?.role === ROLES.ADMIN;
};

// check if user is normal user
export const isUser = (user) => {
  return user?.role === ROLES.USER;
};

// check access
export const hasRole = (user, roles = []) => {
  return roles.includes(user?.role);
};
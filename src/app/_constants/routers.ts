export const apiRouters = {
  LOGIN: 'auth/sign-in',
  SIGNUP: 'auth/sign-up',
  GET_USERS: '/users/all',
  GET_USER: (id: string) => `/users/${id}`,
  DELETE_USER: (id: string) => `users/delete/${id}`,
};

export const pageRouter = {
  HOME: '/',
  LOGIN: '/auth/login',
  SIGNUP: '/auth/signup',
};

export const adminRouter = {
  USERS: '/admin/users',
  CATEGORIES: '/admin/categories',
  POST: '/admin/posts',
  TAGS: '/admin/tags',
  AUTHORS: '/admin/authors',
};

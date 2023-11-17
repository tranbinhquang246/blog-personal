export const apiRouters = {
  LOGIN: 'auth/sign-in',
  SIGNUP: 'auth/sign-up',

  GET_USERS: '/users/all',
  GET_USER: (id: string) => `/users/${id}`,
  DELETE_USER: (id: string) => `users/delete/${id}`,

  CATEGORY_LIST: '/category',
  CATEGORY_DETAIL: (id: string) => `/category/${id}`,

  TAG_LIST: '/tag',
  TAG_DETAIL: (id: string) => `/tag/${id}`,

  AUTHOR_LIST: '/author',
  AUTHOR_DETAIL: (id: string) => `/author/${id}`,
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

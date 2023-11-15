export interface CategoryForm {
  name: string;
  isPublic: boolean;
}

export interface Category {
  id: string;
  name: string;
  publicStatus: boolean;
  _count: {
    post: number;
  };
  createdAt: string;
  updatedAt: string;
}

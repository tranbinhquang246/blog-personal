export interface Tag {
  id: string;
  name: string;
  publicStatus: boolean;
  _count: {
    post: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface TagForm {
  name: string;
  isPublic: boolean;
}

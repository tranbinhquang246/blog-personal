interface ValueForm {
  value: string;
}

export interface AuthorForm {
  fullName: string;
  aliasName: string;
  introduction: string;
  reason: ValueForm[];
  target: ValueForm[];
  experience: ValueForm[];
  interest: ValueForm[];
}

export interface AuthorFormPost {
  fullName: string;
  aliasName: string;
  introduction: string;
  reason: string[];
  target: string[];
  experience: string[];
  interest: string[];
}

export interface Author extends AuthorFormPost {
  id: string;
  createdAt: string;
  updatedAt: string;
  lifeProcess: null;
}

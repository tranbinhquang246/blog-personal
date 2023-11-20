import { OptionType } from '.';
import { Category } from './category';
import { Tag } from './tag';
import { User } from './user';

export interface Post {
  category: CategoryPost[];
  tag: TagPost[];
  comment: [];
  content: string;
  id: string;
  title: string;
  user: User;
  createdAt: string;
  updatedAt: string;
}

interface CategoryPost {
  id: string;
  category: Category;
}

interface TagPost {
  id: string;
  tag: Tag;
}

export interface PostForm {
  title: string;
  category: OptionType;
  tag?: OptionType[];
  thumbnail?: any;
  content: string;
}

export interface PostData extends Omit<PostForm, 'tag' | 'category'> {
  tag: string[] | [];
  category: string;
}

export interface UpdateData extends Omit<PostForm, 'tag' | 'category'> {
  tag: string[] | [];
  categoryPostId: {
    id: string;
    category: string;
  };
}

export interface CreationData {
  category: Omit<Category, '_count'>[];
  tag: Omit<Tag, '_count'>[];
}

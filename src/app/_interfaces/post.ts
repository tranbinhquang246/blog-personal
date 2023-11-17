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
}

interface CategoryPost {
  category: Category;
}

interface TagPost {
  tag: Tag;
}

export interface PostForm {
  title: string;
  category: OptionType;
  tag: OptionType[];
  content: string;
}

export interface PostData extends Omit<PostForm, 'tag' | 'category'> {
  tag: string[];
  category: string;
}

export interface CreationData {
  category: Omit<Category, '_count'>[];
  tag: Omit<Tag, '_count'>[];
}

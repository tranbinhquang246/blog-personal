import { OptionType } from '.';
import { Category } from './category';
import { Tag } from './tag';

export interface PostForm {
  title: string;
  category: OptionType;
  tag: OptionType[];
  content: string;
}

export interface CreationData {
  category: Omit<Category, '_count'>[];
  tag: Omit<Tag, '_count'>[];
}

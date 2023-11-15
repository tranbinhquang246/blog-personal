import { OptionType } from '.';

export interface PostForm {
  title: string;
  category: OptionType;
  tag: string[];
  content: string;
}

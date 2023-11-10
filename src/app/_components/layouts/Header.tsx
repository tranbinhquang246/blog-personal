import { ReactNode } from 'react';

type Props = { className?: string; link?: string; children?: ReactNode };

const Header = ({ link, children, className }: Props) => {
  return <header>Header</header>;
};

export default Header;

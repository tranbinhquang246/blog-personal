type Props = { className?: string };

const Footer = ({ className }: Props) => {
  return (
    <footer className={`mb-3 ${className}`}>
      <p className={`text-center text-xs font-medium leading-6 text-`}>
        Footer
      </p>
    </footer>
  );
};

export default Footer;

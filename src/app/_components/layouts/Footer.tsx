import Image from 'next/image';
import { FacebookIcon, InstagramIcon, TiktokIcon } from 'public/icons';

const navigation = {
  main: [
    { name: 'Home', href: '#' },
    { name: 'Blogs', href: '#' },
    { name: 'About me', href: '#' },
    { name: 'Contact me', href: '#' },
  ],
  social: [
    {
      name: 'Facebook',
      href: '#',
      icon: FacebookIcon,
    },
    {
      name: 'Instagram',
      href: '#',
      icon: InstagramIcon,
    },

    {
      name: 'Tiktok',
      href: '#',
      icon: TiktokIcon,
    },
  ],
};

const Footer = () => {
  return (
    <footer className="bg-dark text-white border-t-[1px]">
      <div className="mx-auto max-w-7xl overflow-hidden px-6 py-4 sm:py-6 lg:px-8">
        <nav
          className="columns-2 flex flex-col xs:flex-row justify-center gap-5"
          aria-label="Footer">
          {navigation.main.map((item) => (
            <div key={item.name} className="text-center">
              <a
                href={item.href}
                className="text-sm leading-6 hover:text-slate-300">
                {item.name}
              </a>
            </div>
          ))}
        </nav>
        <div className="mt-3 flex justify-center space-x-10">
          {navigation.social.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className=" hover:text-gray-500">
              <Image src={item.icon} alt={item.name} width={24} height={24} />
            </a>
          ))}
        </div>
        <p className="mt-3 text-center text-xs leading-5">
          &copy; 2023 Lorem ipsum
        </p>
      </div>
    </footer>
  );
};

export default Footer;

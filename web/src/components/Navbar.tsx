'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MdHome } from 'react-icons/md';
import { RxCardStackPlus } from 'react-icons/rx';
import { GrStorage } from 'react-icons/gr';

const Navbar = () => {
  const pathname = usePathname();

  const navItems = [
    { href: '/', Icon: MdHome, size: 25 },
    { href: '/organisations', Icon: RxCardStackPlus, size: 23 },
    { href: '/temp', Icon: GrStorage, size: 20 },
  ];

  return (
    <div className="flex flex-row items-center justify-center space-x-6 bg-zinc-800 rounded-full border border-zinc-700 py-4 px-6 m-2 fixed bottom-4 left-1/2 transform -translate-x-1/2">
      {navItems.map(({ href, Icon, size }, index) => (
        <Link href={href} key={index} className="flex items-center">
          <Icon
            size={size}
            className={`transition duration-200 ${
              pathname === href
                ? 'text-white'
                : 'text-zinc-400 hover:text-white'
            }`}
          />
        </Link>
      ))}
    </div>
  );
};

export default Navbar;

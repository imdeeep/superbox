'use client';
import React from 'react';
import { GrHistory } from 'react-icons/gr';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

const Header = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex sticky top-0 w-full justify-between px-5 py-4">
      <h1 className="text-zinc-400 hover:text-white transition-all select-none">
        Superbox
      </h1>
      <div className="space-x-5 flex items-center">
        <Link href="/chat" className="text-zinc-400 hover:text-white">
          <GrHistory />
        </Link>
        <button
          onClick={handleLogout} // Add onClick event to the button
          className="text-zinc-400 hover:text-white transition-all"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Header;

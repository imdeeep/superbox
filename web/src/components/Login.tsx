'use client';
import React from 'react';
import { cn } from '@/lib/utils';
import DotPattern from './ui/dot-pattern';
import { BsGoogle } from 'react-icons/bs';
import { BASE_URL } from '@/constant/data';

const Login = () => {
  const handleGoogleLogin = () => {
    window.location.href = `${BASE_URL}auth/google`;
  };

  return (
    <>
      <DotPattern
        className={cn(
          '[mask-image:radial-gradient(600px_circle_at_center,white,transparent)]'
        )}
      />
      <div className="flex sticky top-0 w-full justify-between px-5 py-4">
        <h1 className="text-zinc-400 hover:text-white transition-all select-none">
          Superbox
        </h1>
      </div>
      <div className="space-y-10 mt-[7rem] px-[6rem]">
        <h1 className="text-5xl">
          Hello, <span className="gradient-text">Individual</span>
        </h1>
        <button
          onClick={handleGoogleLogin}
          className="flex items-center bg-gradient-to-b from-secondary to-tertiary/10 hover:text-white transition-all ease-in-out text-zinc-400 gap-2 py-3 px-5 rounded-2xl"
        >
          <BsGoogle />
          Continue with Google
        </button>
      </div>
      <p className="px-[6rem] py-[3rem] text-zinc-400 text-sm">
        Continuing indicates your acceptance of our{' '}
        <span className="text-white cursor-pointer">Terms of Service</span> and{' '}
        <span className="text-white cursor-pointer">Privacy Policy</span>
      </p>
    </>
  );
};

export default Login;

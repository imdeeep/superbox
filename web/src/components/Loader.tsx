// Loading.tsx
import React from 'react';
import { cn } from '@/lib/utils';
import DotPattern from './ui/dot-pattern';

const Loader = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <DotPattern
        className={cn(
          '[mask-image:radial-gradient(800px_circle_at_center,white,transparent)]'
        )}
      />
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-white"></div>
    </div>
  );
};

export default Loader;

import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import Navbar from '@/components/Navbar';
import Header from '@/components/Header';
import DotPattern from '@/components/ui/dot-pattern';
import { cn } from '@/lib/utils';
import { AuthProvider } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});

const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'Superbox',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <ProtectedRoute>
            <DotPattern
              className={cn(
                '[mask-image:radial-gradient(800px_circle_at_center,white,transparent)]'
              )}
            />
            <Header />
            {children}
            <Navbar />
          </ProtectedRoute>
        </AuthProvider>
      </body>
    </html>
  );
}

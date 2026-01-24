'use client';

import { useTheme } from 'hooks/useTheme';

export function AnimatedGradient() {
  const { theme, mounted } = useTheme();

  if (!mounted) return null;

  const isDark = theme === 'dark';

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Dark mode gradient */}
      {isDark && (
        <div className="absolute inset-0 bg-background">
          {/* Multiple animated gradient orbs */}
          <div
            className="absolute w-96 h-96 rounded-full opacity-30 mix-blend-screen filter blur-3xl animate-gradient-shift"
            style={{
              background:
                'radial-gradient(circle, rgb(139, 92, 246) 0%, transparent 70%)',
              top: '0%',
              left: '0%',
              animation: 'float 8s ease-in-out infinite',
            }}
          />
          <div
            className="absolute w-96 h-96 rounded-full opacity-20 mix-blend-screen filter blur-3xl"
            style={{
              background:
                'radial-gradient(circle, rgb(59, 130, 246) 0%, transparent 70%)',
              top: '30%',
              right: '10%',
              animation: 'float 10s ease-in-out infinite 2s',
            }}
          />
          <div
            className="absolute w-96 h-96 rounded-full opacity-25 mix-blend-screen filter blur-3xl"
            style={{
              background:
                'radial-gradient(circle, rgb(236, 72, 153) 0%, transparent 70%)',
              bottom: '0%',
              left: '30%',
              animation: 'float 12s ease-in-out infinite 4s',
            }}
          />
          <div
            className="absolute w-96 h-96 rounded-full opacity-20 mix-blend-screen filter blur-3xl"
            style={{
              background:
                'radial-gradient(circle, rgb(34, 197, 94) 0%, transparent 70%)',
              bottom: '20%',
              right: '20%',
              animation: 'float 9s ease-in-out infinite 1s',
            }}
          />
        </div>
      )}

      {/* Light mode gradient */}
      {!isDark && (
        <div className="absolute inset-0 bg-linear-to-br from-blue-50 via-white to-purple-50">
          {/* Multiple animated gradient orbs for light mode */}
          <div
            className="absolute w-96 h-96 rounded-full opacity-40 mix-blend-multiply filter blur-3xl"
            style={{
              background:
                'radial-gradient(circle, rgb(59, 130, 246) 0%, transparent 70%)',
              top: '0%',
              left: '0%',
              animation: 'float 8s ease-in-out infinite',
            }}
          />
          <div
            className="absolute w-96 h-96 rounded-full opacity-30 mix-blend-multiply filter blur-3xl"
            style={{
              background:
                'radial-gradient(circle, rgb(139, 92, 246) 0%, transparent 70%)',
              top: '30%',
              right: '10%',
              animation: 'float 10s ease-in-out infinite 2s',
            }}
          />
          <div
            className="absolute w-96 h-96 rounded-full opacity-35 mix-blend-multiply filter blur-3xl"
            style={{
              background:
                'radial-gradient(circle, rgb(236, 72, 153) 0%, transparent 70%)',
              bottom: '0%',
              left: '30%',
              animation: 'float 12s ease-in-out infinite 4s',
            }}
          />
          <div
            className="absolute w-96 h-96 rounded-full opacity-30 mix-blend-multiply filter blur-3xl"
            style={{
              background:
                'radial-gradient(circle, rgb(34, 197, 94) 0%, transparent 70%)',
              bottom: '20%',
              right: '20%',
              animation: 'float 9s ease-in-out infinite 1s',
            }}
          />
        </div>
      )}
    </div>
  );
}

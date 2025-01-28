'use client';
import { FiSun, FiMoon } from "react-icons/fi";
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';

const ThemeSwitch = () => {
  const [mounted, setMounted] = useState<boolean>(false);
  const { setTheme, resolvedTheme } = useTheme();

  // Ensure the component is mounted before accessing the theme
  useEffect(() => {
    setMounted(true);
  }, []);

  // Return null until the component is mounted
  if (!mounted) return null;

  return (
    <div>
      {resolvedTheme === 'dark' ? (
        <FiSun
          className="cursor-pointer"
          size={24}
          onClick={() => setTheme('light')}
        />
      ) : (
        <FiMoon
          className="cursor-pointer"
          size={24}
          onClick={() => setTheme('dark')}
        />
      )}
    </div>
  );
};

export default ThemeSwitch;

'use client';

import {
  createContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

export type Theme = 'light' | 'dark';

export type ThemeContextValue = {
  theme: Theme;
  toggleTheme: () => void;
};

// createContext의 기본값은 Provider가 없을 때 사용하는 fallback 값입니다.
export const ThemeContext = createContext<ThemeContextValue>({
  theme: 'light',
  toggleTheme: () => {},
});

export default function ThemeProvider({
  children,
}: {
  children: ReactNode;
}) {
  // theme은 'light' 또는 'dark'만 가질 수 있습니다.
  const [theme, setTheme] = useState<Theme>('light');

  // 상태가 바뀔 때 HTML 문서의 data-theme 속성을 갱신합니다.
  useEffect(() => {
    // window/document는 브라우저 환경에서만 존재합니다.
    if (typeof window !== 'undefined') {
      document.documentElement.dataset.theme = theme;
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

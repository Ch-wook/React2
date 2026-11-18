'use client';

import { useContext } from 'react';
import { ThemeContext } from './ThemeProvider';

export default function ThemeStatus() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <div className="theme-status">
      <button
        type="button"
        className="theme-button"
        onClick={toggleTheme}
        aria-label="다크 모드"
        aria-pressed={theme === 'dark'}
      >
        Theme: {theme === 'dark' ? '🌙 Dark' : '🌞 Light'}
      </button>
      <span className="muted">Context API로 페이지 전체의 테마를 공유</span>
    </div>
  );
}

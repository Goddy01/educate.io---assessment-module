'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useKeyboardShortcuts() {
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + K for search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      }

      // Ctrl/Cmd + E for export (on dashboard)
      if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        const exportButton = document.querySelector('button[title*="Export"]') as HTMLButtonElement;
        if (exportButton) {
          exportButton.click();
        }
      }

      // Ctrl/Cmd + N for new assessment
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        router.push('/quizzes/new');
      }

      // Escape to close modals
      if (e.key === 'Escape') {
        const modal = document.querySelector('.fixed.inset-0.bg-black') as HTMLElement;
        if (modal) {
          const closeButton = modal.querySelector('button') as HTMLButtonElement;
          if (closeButton) closeButton.click();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router]);
}


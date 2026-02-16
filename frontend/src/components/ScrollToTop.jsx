import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Small delay to ensure the DOM is ready
    const timer = setTimeout(() => {
      // For dashboard pages with fixed layout, we need to scroll the content area
      // The main content area has overflow-y-auto
      const contentArea = document.querySelector('.overflow-y-auto');
      if (contentArea) {
        contentArea.scrollTop = 0;
      } else {
        // Fallback to window scroll for landing page
        window.scrollTo(0, 0);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}

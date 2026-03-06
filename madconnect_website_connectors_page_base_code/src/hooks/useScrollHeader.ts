import { useEffect, useState } from "react";

interface ScrollHeaderState {
  isScrolled: boolean;
}

/**
 * Custom hook to track scroll position and determine header visibility state.
 * Returns isScrolled: true when scrollY > threshold (default 40px)
 */
export function useScrollHeader(threshold = 40): ScrollHeaderState {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > threshold);
    };

    // Check initial scroll position
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [threshold]);

  return { isScrolled };
}

export default useScrollHeader;

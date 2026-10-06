import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * SegmentAutoScroll
 * Smoothly and gracefully glides to the next section when the user scrolls near the end of a section (>= 85%).
 * Built with gesture-awareness so it never fights the user's manual scrolling or causes stutter.
 */
const SegmentAutoScroll = ({ threshold = 0.85 }) => {
  const location = useLocation();
  const isAutoScrollingRef = useRef(false);
  const animFrameIdRef = useRef(null);
  const scrollTimeoutRef = useRef(null);
  const lastScrollYRef = useRef(0);
  const lastTriggeredIndexRef = useRef(-1);
  const isUserInteractingRef = useRef(false);

  useEffect(() => {
    // Reset state on route change
    isAutoScrollingRef.current = false;
    lastTriggeredIndexRef.current = -1;
    lastScrollYRef.current = window.scrollY;

    const cancelAutoScroll = () => {
      if (isAutoScrollingRef.current) {
        if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
        isAutoScrollingRef.current = false;
      }
    };

    const handleUserGestureStart = () => {
      isUserInteractingRef.current = true;
      cancelAutoScroll();
    };

    const handleUserGestureEnd = () => {
      isUserInteractingRef.current = false;
    };

    window.addEventListener('wheel', handleUserGestureStart, { passive: true });
    window.addEventListener('touchstart', handleUserGestureStart, { passive: true });
    window.addEventListener('touchend', handleUserGestureEnd, { passive: true });

    const getSegments = () => {
      const elements = Array.from(
        document.querySelectorAll('main > section, main section, footer, [data-segment="true"]')
      );
      const valid = [];
      const seenTops = new Set();

      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const top = Math.round(rect.top + window.scrollY);
        if (rect.height >= 180 && !seenTops.has(top) && el.offsetParent !== null) {
          seenTops.add(top);
          valid.push({ el, top, height: rect.height });
        }
      });

      valid.sort((a, b) => a.top - b.top);
      return valid;
    };

    // Smooth scroll animation using requestAnimationFrame with easeInOutCubic
    const smoothScrollTo = (targetY, duration = 650) => {
      cancelAutoScroll();
      isAutoScrollingRef.current = true;

      const startY = window.scrollY;
      const distance = targetY - startY;
      if (Math.abs(distance) < 8) {
        isAutoScrollingRef.current = false;
        return;
      }

      const startTime = performance.now();

      const easeInOutCubic = (t) =>
        t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;

      const step = (currentTime) => {
        if (isUserInteractingRef.current) {
          isAutoScrollingRef.current = false;
          return;
        }

        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeInOutCubic(progress);

        window.scrollTo(0, startY + distance * easedProgress);

        if (progress < 1) {
          animFrameIdRef.current = requestAnimationFrame(step);
        } else {
          isAutoScrollingRef.current = false;
          lastScrollYRef.current = window.scrollY;
        }
      };

      animFrameIdRef.current = requestAnimationFrame(step);
    };

    const checkAndTriggerScroll = () => {
      if (isAutoScrollingRef.current) return;

      const currentScrollY = window.scrollY;
      const isScrollingDown = currentScrollY > lastScrollYRef.current;
      lastScrollYRef.current = currentScrollY;

      if (!isScrollingDown) {
        // Reset last triggered index if scrolling upwards
        const segments = getSegments();
        const activeIndex = segments.findIndex((seg) => {
          return currentScrollY >= seg.top - 100 && currentScrollY < seg.top + seg.height - 100;
        });
        if (activeIndex !== -1 && activeIndex !== lastTriggeredIndexRef.current) {
          lastTriggeredIndexRef.current = -1;
        }
        return;
      }

      const segments = getSegments();
      if (segments.length < 2) return;

      for (let i = 0; i < segments.length - 1; i++) {
        const current = segments[i];
        const next = segments[i + 1];

        const isInside =
          currentScrollY + 5 >= current.top &&
          currentScrollY < current.top + current.height - 40;

        if (isInside) {
          const maxScrollable =
            current.height > window.innerHeight
              ? current.height - window.innerHeight
              : current.height * 0.85;

          const scrolledInside = currentScrollY - current.top;
          const progress = maxScrollable > 0 ? scrolledInside / maxScrollable : 1;

          if (progress >= threshold && lastTriggeredIndexRef.current !== i) {
            lastTriggeredIndexRef.current = i;
            smoothScrollTo(next.top, 700);
            break;
          }
        }
      }
    };

    const handleScroll = () => {
      if (isAutoScrollingRef.current) return;

      // Settle detection: wait until the user pauses manual scrolling (~120ms)
      // This prevents interrupting the user mid-swipe or mid-wheel gesture
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => {
        isUserInteractingRef.current = false;
        checkAndTriggerScroll();
      }, 120);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('wheel', handleUserGestureStart);
      window.removeEventListener('touchstart', handleUserGestureStart);
      window.removeEventListener('touchend', handleUserGestureEnd);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [location.pathname, threshold]);

  return null;
};

export default SegmentAutoScroll;

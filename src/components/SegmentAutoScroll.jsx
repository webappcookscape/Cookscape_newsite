import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * SegmentAutoScroll
 * Automatically scrolls to the next segment/section when the user scrolls 85% of the current segment.
 */
const SegmentAutoScroll = ({ threshold = 0.85 }) => {
  const location = useLocation();
  const isAutoScrollingRef = useRef(false);
  const lastScrollYRef = useRef(0);
  const lastTriggeredIndexRef = useRef(-1);
  const scrollTimeoutRef = useRef(null);

  useEffect(() => {
    // Reset state on route change
    isAutoScrollingRef.current = false;
    lastTriggeredIndexRef.current = -1;
    lastScrollYRef.current = window.scrollY;

    const getSegments = () => {
      // Collect all main sections and footer as distinct segments
      const elements = Array.from(
        document.querySelectorAll('main > section, main section, footer, [data-segment="true"]')
      );

      // Filter out hidden, tiny, or duplicate nested sections
      const validSegments = [];
      const seenTops = new Set();

      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const top = Math.round(rect.top + window.scrollY);
        const height = rect.height;

        // Must have meaningful height and not share identical top position
        if (height >= 180 && !seenTops.has(top) && el.offsetParent !== null) {
          seenTops.add(top);
          validSegments.push(el);
        }
      });

      // Sort by their vertical position on the page
      validSegments.sort((a, b) => {
        const topA = a.getBoundingClientRect().top + window.scrollY;
        const topB = b.getBoundingClientRect().top + window.scrollY;
        return topA - topB;
      });

      return validSegments;
    };

    const handleScroll = () => {
      if (isAutoScrollingRef.current) return;

      const currentScrollY = window.scrollY;
      const isScrollingDown = currentScrollY > lastScrollYRef.current;
      lastScrollYRef.current = currentScrollY;

      // Only advance automatically when scrolling downwards
      if (!isScrollingDown) {
        // If scrolling up, reset lock if we moved away from the last triggered section
        const segments = getSegments();
        const activeIndex = segments.findIndex((seg) => {
          const rect = seg.getBoundingClientRect();
          return rect.top <= window.innerHeight * 0.4 && rect.bottom >= window.innerHeight * 0.4;
        });
        if (activeIndex !== -1 && activeIndex !== lastTriggeredIndexRef.current) {
          lastTriggeredIndexRef.current = -1;
        }
        return;
      }

      const segments = getSegments();
      if (segments.length < 2) return;

      for (let i = 0; i < segments.length - 1; i++) {
        const currentSegment = segments[i];
        const nextSegment = segments[i + 1];

        const rect = currentSegment.getBoundingClientRect();
        const segmentTop = rect.top + currentScrollY;
        const segmentHeight = rect.height;

        // Check if user is currently inside this segment
        const isInside =
          currentScrollY + 5 >= segmentTop &&
          currentScrollY < segmentTop + segmentHeight - 40;

        if (isInside) {
          // Calculate progress through this segment
          const isTallerThanViewport = segmentHeight > window.innerHeight;
          const maxScrollable = isTallerThanViewport
            ? segmentHeight - window.innerHeight
            : segmentHeight * 0.85;

          const scrolledInside = currentScrollY - segmentTop;
          const progress = maxScrollable > 0 ? scrolledInside / maxScrollable : 1;

          // When scrolled through >= 85% of this segment
          if (progress >= threshold && lastTriggeredIndexRef.current !== i) {
            isAutoScrollingRef.current = true;
            lastTriggeredIndexRef.current = i;

            // Smooth scroll immediately to the top of the next segment
            const nextRect = nextSegment.getBoundingClientRect();
            const targetY = nextRect.top + window.scrollY;

            window.scrollTo({
              top: targetY,
              behavior: 'smooth',
            });

            // Unlock after smooth scroll transition completes
            if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
            scrollTimeoutRef.current = setTimeout(() => {
              isAutoScrollingRef.current = false;
              lastScrollYRef.current = window.scrollY;
            }, 850);

            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, [location.pathname, threshold]);

  return null;
};

export default SegmentAutoScroll;

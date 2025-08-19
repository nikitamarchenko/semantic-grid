import { useEffect, useRef } from "react";

export const ScrollLockWrapper = ({ children }: any) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let startX = 0;
    let startY = 0;
    let lockedDirection: "x" | "y" | null = null;

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0]?.clientX || 0;
      startY = e.touches[0]?.clientY || 0;
      lockedDirection = null;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const dx = Math.abs((e.touches[0]?.clientX || 0) - startX);
      const dy = Math.abs((e.touches[0]?.clientY || 0) - startY);

      if (!lockedDirection) {
        lockedDirection = dx > dy ? "x" : "y";
      }

      if (
        (lockedDirection === "x" && dy > dx) ||
        (lockedDirection === "y" && dx > dy)
      ) {
        e.preventDefault(); // Block the undesired scroll direction
      }
    };

    const el = ref.current;
    if (el) {
      el.addEventListener("touchstart", handleTouchStart, { passive: true });
      el.addEventListener("touchmove", handleTouchMove, { passive: false });
    }

    return () => {
      if (el) {
        el.removeEventListener("touchstart", handleTouchStart);
        el.removeEventListener("touchmove", handleTouchMove);
      }
    };
  }, []);

  return (
    <div
      ref={ref}
      style={{
        overflow: "auto",
        touchAction: "none",
        height: "calc(100vh - 50px)",
      }}
    >
      {children}
    </div>
  );
};

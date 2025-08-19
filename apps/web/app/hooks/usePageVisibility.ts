'use client';

import { useEffect, useState } from 'react';

const getIsDocumentVisible = () => {
  if (typeof document === 'undefined') return false;
  return !document.hidden;
};

export const usePageVisibility = (cb: () => void = () => {}) => {
  const [isVisible, setIsVisible] = useState(getIsDocumentVisible());
  const onVisibilityChange = () => {
    setIsVisible(getIsDocumentVisible());
    if (getIsDocumentVisible() && typeof cb === 'function') {
      cb();
    }
  };

  useEffect(() => {
    document.addEventListener('visibilitychange', onVisibilityChange, false);
    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  });

  return { isVisible };
};
